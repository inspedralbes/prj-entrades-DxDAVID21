<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\MovieSession;
use App\Models\SessionSeat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    private const BLOCK_DURATION = 15; // minutes

    public function blockSeats(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:movie_sessions,id',
            'seats_ids' => 'required|array|min:1',
            'seats_ids.*' => 'integer',
        ]);

        $user = $request->user();
        $sessionId = $request->input('session_id');
        $seatIds = $request->input('seats_ids');
        $expiresAt = now()->addMinutes(self::BLOCK_DURATION);

        $sessionSeats = SessionSeat::where('session_id', $sessionId)
            ->whereIn('seat_id', $seatIds)
            ->where('status', 'available')
            ->get();

        if ($sessionSeats->count() !== count($seatIds)) {
            return response()->json(['message' => 'Some seats are not available'], 400);
        }

        foreach ($sessionSeats as $sessionSeat) {
            $sessionSeat->update([
                'status' => 'blocked',
                'blocked_by' => $user->id,
                'blocked_at' => now(),
                'lock_expires_at' => $expiresAt,
            ]);
        }

        $total = $this->calculateTotal($sessionId, $seatIds);

        return response()->json([
            'session_seats' => $sessionSeats,
            'total' => $total,
            'expires_at' => $expiresAt,
        ]);

    }

    public function releaseSeats(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:movie_sessions,id',
            'seats_ids' => 'required|array',
            'seats_ids.*' => 'integer',
        ]);

        // $user = &request()->user();
        // $sessionId = $request->input('session_id');
        // $seatIds = $request->input('seats_ids');

        SessionSeat::where('session_id', $request->input('session_id'))
            ->whereIn('seat_id', $request->input('seats_ids'))
            ->where('blocked_by', $request->user()->id)
            ->update([
                'status' => 'available',
                'blocked_by' => null,
                'blocked_at' => null,
                'lock_expires_at' => null,
            ]);

        return response()->json(['message' => 'Seats released']);
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:movie_sessions,id',
            'seats_ids' => 'required|array|min:1',
            'seats_ids.*' => 'integer',
        ]);

        $user = $request->user();
        $sessionId = $request->input('session_id');
        $seatIds = $request->input('seats_ids');


        $sessionSeats = SessionSeat::where('session_id', $sessionId)
            ->whereIn('seat_id', $seatIds)
            ->where('status', 'blocked')
            ->where('blocked_by', $user->id)
            ->where('lock_expires_at', '>', now())
            ->get();

        if ($sessionSeats->count() !== count($seatIds)) {
            return response()->json(['message' => 'Some seats are not blocked by you or the lock has expired'], 400);
        }

        $total = $this->calculateTotal($sessionId, $seatIds);
        $expiresAt = now()->addMinutes(self::BLOCK_DURATION);

        $order = Order::create([
            'user_id' => $user->id,
            'session_id' => $sessionId,
            'total_amount' => $total,
            'status' => 'PENDING',
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'order' => $order,
            'expires_at' => $expiresAt,
        ]);
    }

    public function simulatePayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::find($request->input('order_id'));

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'PENDING') {
            return response()->json(['message' => 'Order already processed'], 400);
        }

        if ($order->expires_at && $order->expires_at < now()) {
            $order->update(['status' => 'EXPIRED']);
            return response()->json(['message' => 'Order has expired'], 400);
        }

        $order->update([
            'status' => 'COMPLETED',
            'paid_at' => now(),
            'payment_reference' => 'PAY' . Str::upper(Str::random(10)),
        ]);

        // $sessionSeats = SessionSeat::where('session_id', $order->session_id)
        //     ->whereIn('seat_id', function ($query) use ($order) {
        //         $query->select('seat_id')
        //             ->from('sessions_seats')
        //             ->where('id', $order->id);
        //     })
        //     ->get();

        $sessionSeats = SessionSeat::where('session_id', $order->session_id)
            ->where('status', 'blocked')
            ->where('blocked_by', $order->user_id)
            ->get();

        foreach ($sessionSeats as $sessionSeat) {
            $sessionSeat->update([
                'status' => 'purchased',
                'blocked_by' => null,
                'blocked_at' => null,
                'lock_expires_at' => null,
            ]);

            Ticket::create([
                'order_id' => $order->id,
                'sessions_seat_id' => $sessionSeat->id,
                'qr_code' => 'TKT-' . Str::upper(Str::random(12)),
            ]);
        }

        return response()->json([
            'order' => $order,
            'message' => 'Payment successful, tickets generated',
        ]);
    }

    public function getUserOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('session.movie', 'tickets.sessionSeat.seat')
            ->get();
        return response()->json($orders);
    }

    private function calculateTotal($sessionId, $seatIds)
    {
        $session = MovieSession::find($sessionId);
        $seats = SessionSeat::where('session_id', $sessionId)->whereIn('seat_id', $seatIds)->with('seat')->get();

        $total = 0;
        foreach ($seats as $sessionSeat) {
            $price = $session->price * $sessionSeat->seat->price_modifier;
            $total += $price;
        }
        return $total;
    }
}

