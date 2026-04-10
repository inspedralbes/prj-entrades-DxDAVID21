<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::with('seats')->get());
    }

    public function store (Request $request)
    {
        $request->validate([
            'name'=>'required|string|max:255',
            'rows'=> 'required|integer|min:1',
            'seats_per_row'=> 'required|integer|min:1',
        ]);

        $room = Room::create(['name'=>$request->input('name')]);

        $seats = [];

        for ($row = 0; $row < $request->input('rows'); $row++) {
            $rowLetter = chr(65 + $row);
            for ($seatNum = 1; $seatNum <= $request->input('seats_per_row'); $seatNum++) {
                $type = ($row < 2) ? 'vip' : 'standard';
                $priceModifier = ($row < 2) ?  1.5 : 1.0;

                $seats[] = [
                    'room_id' => $room->id,
                    'row_label' => $rowLetter,
                    'number' => $seatNum,
                    'type' => $type,
                    'price_modifier' => $priceModifier,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('seats')->insert($seats);

        return response()->json($room->load('seats'), 201);
    }

    public function show (Room $room)
    {
        return response()->json($room->load('seats'));
    }

    // public function update(Request $request, Room $room)
    // {
    //     $request->validate([
    //         'name'=> 'string|max:100',
    //     ]);

    //     $room->update(['name' => $request->input('name')]);
    //     return response()->json($room);
    // }

    // public function destroy (Room $room)
    // {
    //     $room->delete();
    //     return response()->json(['message'=>'Room deleted']);
    // }
}
