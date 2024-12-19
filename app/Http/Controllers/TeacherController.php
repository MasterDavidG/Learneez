<?php
namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Textbook;
use App\Models\Page;
use App\Models\Submission;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class TeacherController extends Controller
{
    public function index()
    {
        return Inertia::render('TeacherDashboard');
    }

    public function getStudents()
    {
        $teacherId = Auth::id();

        $students = User::where('role', 'student')
                        ->where('teacher_id', $teacherId)
                        ->get();

        return response()->json($students);
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

    public function showDrawing($filename)
    {
        try {
            $filePath = "drawings/{$filename}";
            if (!Storage::exists($filePath)) {
                Log::warning("Drawing file not found: {$filePath}");
                abort(404, 'File not found');
            }
            $file = Storage::get($filePath);
            $mimeType = Storage::mimeType($filePath) ?? 'image/png';
            return response($file, 200)->header('Content-Type', $mimeType);
        } catch (\Exception $e) {
            Log::error("Error fetching drawing: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to load drawing'], 500);
        }
    }

    public function getBooks()
    {
        $books = Textbook::all();
        return response()->json($books);
    }

    public function getPagesForBook($bookId)
    {
        $pages = Page::where('textbook_id', $bookId)->get();
        return response()->json($pages);
    }

    public function assignHomework(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer|exists:users,id',
            'page_id' => 'required|integer|exists:pages,id',
        ]);
    
        try {
            // Check if an assignment already exists for this student and page
            $existingAssignment = Assignment::where('user_id', $validated['student_id'])
                ->where('page_id', $validated['page_id'])
                ->first();
    
            if ($existingAssignment) {
                return response()->json(['message' => 'Homework already assigned for this page'], 409);
            }
    
            // Create a new assignment
            Assignment::create([
                'user_id' => $validated['student_id'],
                'page_id' => $validated['page_id'],
                'task_status' => 'incomplete', // Default status
            ]);
    
            return response()->json(['message' => 'Homework assigned successfully']);
        } catch (\Exception $e) {
            Log::error("Error assigning homework: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to assign homework'], 500);
        }
    }
    
// In TeacherController.php
public function adoptStudent(Request $request)
{
    $validated = $request->validate([
        'student_id' => 'required|integer|exists:users,id',
    ]);

    $student = User::where('id', $validated['student_id'])
        ->where('role', 'student')
        ->firstOrFail();

    $student->teacher_id = Auth::id();
    $student->save();

    return response()->json(['message' => 'Student adopted successfully']);
}
public function getUnassignedStudents()
{
    $students = User::where('role', 'student')
                    ->whereNull('teacher_id')
                    ->get();

    return response()->json($students);
}
}
