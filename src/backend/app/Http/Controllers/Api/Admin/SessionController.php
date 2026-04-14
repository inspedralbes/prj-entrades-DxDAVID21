<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MovieSession;
use App\Models\Movie;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    public function index()
    {
        return response()->json(MovieSession::with(['movie', 'room'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'movie_id' => 'required|exists:movies,id',
            'room_id' => 'required|exists:rooms,id',
            'start_time' => 'required|date',
            'price' => 'nullable|numeric|min:0',
        ]);

        $movie = Movie::find($request->input('movie_id'));
        $endTime = \Carbon\Carbon::parse($request->input('start_time'))->addMinutes($movie->duration);

        $session = MovieSession::create([
            'movie_id' => $request->input('movie_id'),
            'room_id' => $request->input('room_id'),
            'start_time' => $request->input('start_time'),
            'end_time' => $endTime,
            'price' => $request->input('price'),
        ]);

        $seats = Seat::where('room_id', $request->input('room_id'))->get();
        $sessionSeats = [];

        foreach ($seats as $seat) {
            $sessionSeats[] = [
                'session_id' => $session->id,
                'seat_id' => $seat->id,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('sessions_seats')->insert($sessionSeats);

        return response()->json($session->load('movie', 'room'), 201);
    }

    public function show($id)
    {
        $movieSession =  MovieSession::find($id);


        return response()->json($movieSession->load('movie', 'room', 'sessionSeats'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'movie_id' => 'exists:movies,id',
            'room_id' => 'exists:rooms,id',
            'start_time' => 'date',
            'price' => 'numeric|min:0',
        ]);

        $movieSession = MovieSession::find($id);

        $movieSession->update($request->all());
        return response()->json($movieSession);
    }

    public function destroy($id)
    {
        $movieSession = MovieSession::find($id);
        $movieSession->delete();
        return response()->json(['message' => 'Session deleted']);
    }
}
