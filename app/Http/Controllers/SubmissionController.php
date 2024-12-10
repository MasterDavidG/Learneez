<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function getSubmissions(Request $request)
    {
        $studentId = $request->query('student_id');

        if (!$studentId) {
            return response()->json(['error' => 'Student ID is required'], 400);
        }

        $submissions = Submission::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($submission) {
                $submission->drawing_url = route('submissions.drawing', ['filename' => $submission->drawing]);
                return $submission;
            });

        return response()->json($submissions);
    }
}
