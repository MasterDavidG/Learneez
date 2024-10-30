<?php
// DrawingController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // <-- Add this line

class DrawingController extends Controller
{
    public function save(Request $request)
    {
        $lines = $request->input('lines');
        
        // Save the drawing as a JSON file in storage
        Storage::put('drawings/drawing.json', json_encode($lines));

        return response()->json(['success' => true]);
    }
}
