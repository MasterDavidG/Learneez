<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::all();
        return response()->json($assignments);
    }

    public function store(Request $request)
    {
        $assignment = Assignment::create($request->all());
        return response()->json($assignment, 201);
    }

    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->update($request->all());
        
        return response()->json($assignment);
    }
}
