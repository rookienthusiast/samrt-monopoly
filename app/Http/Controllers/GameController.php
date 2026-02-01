<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\GameRoom;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function createRoom()
    {
        $code = strtoupper(Str::random(6));
        
        // Ensure uniqueness
        while(GameRoom::where('code', $code)->exists()) {
            $code = strtoupper(Str::random(6));
        }

        $room = GameRoom::create([
            'code' => $code,
            'status' => 'LOBBY',
            'players' => [
                ['id' => 1, 'name' => 'Player 1', 'color' => 'red', 'position' => 0, 'money' => 1500],
                ['id' => 2, 'name' => 'Player 2', 'color' => 'blue', 'position' => 0, 'money' => 1500],
                ['id' => 3, 'name' => 'Player 3', 'color' => 'green', 'position' => 0, 'money' => 1500],
                ['id' => 4, 'name' => 'Player 4', 'color' => 'yellow', 'position' => 0, 'money' => 1500]
            ],
            'board_state' => [],
            'logs' => ['> Room Created']
        ]);

        return response()->json([
            'success' => true,
            'room' => $room
        ]);
    }

    public function joinRoom(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $room = GameRoom::where('code', $request->code)->first();

        if (!$room) {
            return response()->json(['success' => false, 'message' => 'Room not found'], 404);
        }

        return response()->json([
            'success' => true,
            'room' => $room
        ]);
    }

    public function getRooms()
    {
        $rooms = GameRoom::latest()->get();
        return response()->json([
            'success' => true,
            'rooms' => $rooms
        ]);
    }

    public function deleteRoom(Request $request) 
    {
        $request->validate([
            'code' => 'required'
        ]);
        
        GameRoom::where('code', $request->code)->delete();
        
        return response()->json([
            'success' => true
        ]);
    }

    public function updateState(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'players' => 'array',
            'status' => 'string',
            'logs' => 'array'
        ]);

        $room = GameRoom::where('code', $request->code)->firstOrFail();

        $room->update($request->only(['players', 'status', 'logs', 'board_state']));

        return response()->json(['success' => true]);
    }

    public function dashboard(): Response
    {

        $properties = Property::with('levels')->get();

        return Inertia::render('Dashboard', [
            'properties' => $properties,
            'gameStatus' => 'demo'
        ]);
    }
}
