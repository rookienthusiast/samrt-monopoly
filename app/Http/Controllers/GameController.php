<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function dashboard(): Response
    {
        // Fetch properties with their levels
        $properties = Property::with('levels')->get();

        return Inertia::render('Dashboard', [
            'properties' => $properties,
            'gameStatus' => 'demo' 
        ]);
    }
}
