<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use Pdf;
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
            ->where('submissions.student_id', $studentId)
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
    public function viewSubmissions(Request $request)
    {
        $studentId = $request->query('student_id');
    
        // Log the received student ID for debugging
        Log::info("Fetching submissions for student_id: {$studentId}");
    
        if (!$studentId) {
            return redirect()->back()->withErrors(['Student ID is required']);
        }
    
        $submissions = Submission::where('student_id', $studentId)
            ->where('status', 'submitted') // Filter submissions with status: submitted
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($submission) {
                $filePath = "drawings/{$submission->drawing}";
    
                // Construct URL using Laravel's storage facade
                if (Storage::exists($filePath)) {
                    $submission->drawing_url = Storage::url($filePath);
                } else {
                    Log::warning("Drawing not found: {$filePath}");
                    $submission->drawing_url = null;
                }
    
                return $submission;
            });
    
        return Inertia::render('TeacherSubmissions', [
            'submissions' => $submissions,
            'studentId' => $studentId,
        ]);
    }
    public function getStudentSubmissions(Request $request)
    {
        $studentId = $request->user()->id;

        $submissions = Submission::where('student_id', $studentId)
            ->with(['page', 'textbook']) // Optional: Include related data
            ->get();

        return response()->json($submissions);
    }

    // Save a new submission (student)
    public function saveStudentSubmission(Request $request)
    {
        $validated = $request->validate([
            'page_id' => 'required|exists:pages,id',
            'image' => 'required|file|mimes:jpg,jpeg,png',
        ]);

        $filePath = $request->file('image')->store('submissions', 'public');

        $submission = Submission::create([
            'student_id' => $request->user()->id,
            'page_id' => $validated['page_id'],
            'image' => $filePath,
            'status' => 'submitted',
        ]);

        return response()->json(['message' => 'Submission saved successfully!', 'submission' => $submission]);
    }

    // View a specific submission (for student)
    public function viewStudentSubmission($submissionId)
    {
        $submission = Submission::where('id', $submissionId)
            ->where('student_id', auth()->id())
            ->firstOrFail();

        return response()->json($submission);
    }
    public function showDrawing($filename)
    {

        try {
            $filePath = "drawings/{$filename}";
    
            if (!Storage::exists($filePath)) {
                Log::warning("Drawing file not found: {$filePath}");
                abort(404, 'File not found');
            }
    
            $fileContent = Storage::get($filePath);
            $mimeType = Storage::mimeType($filePath);
    
            return response($fileContent, 200)->header('Content-Type', $mimeType ?? 'application/json');
        } catch (\Exception $e) {
            Log::error("Error fetching drawing: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to load drawing'], 500);
        }
    }
    
}
