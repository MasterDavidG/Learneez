<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


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

    public function checkAssignmentStatus($pageId)
{
    try {
        $user = Auth::user();

        // Ensure the user is authenticated
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Fetch the assignment for the logged-in user and the given page ID
        $assignment = Assignment::where('user_id', $user->id)
            ->where('page_id', $pageId)
            ->first();

        return response()->json([
            'hasAssignment' => $assignment ? true : false,
            'isDone' => $assignment && $assignment->task_status === 'completed' ? true : false
        ]);
    } catch (\Exception $e) {

        return response()->json([
            'error' => 'Internal Server Error'
        ], 500);
    }
}

}
