<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function getSubmissions(Request $request)
    {
        $studentId = $request->query('student_id');

        if (!$studentId) {
            return response()->json(['error' => 'Student ID is required'], 400);
        }

        $submissions = DB::table('submissions')
            ->orderBy('submissions.created_at', 'desc')
            ->leftJoin('pages', 'pages.id', 'submissions.page_id')
            ->select('submissions.*', 'pages.textbook_id', 'pages.image')
            ->get();

        return response()->json($submissions);
    }

    public function getSubmissionJSON(Request $request, $submissionId)
    {
        $submission = Submission::where('id', $submissionId)->first();
        $filePath = "drawings/{$submission->drawing}";
        
        if (!Storage::exists($filePath)) {
            abort(404, 'File not found');
        }
    
        $file = Storage::get($filePath);
        $mimeType = Storage::mimeType($filePath);
    
        return response($file, 200)->header('Content-Type', $mimeType);
    }
}
