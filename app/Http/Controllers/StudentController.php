<?php

namespace App\Http\Controllers;
use App\Models\Textbook;
use Illuminate\Support\Facades\DB;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Page;
use App\Models\Button;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    /**
     * Render Student Dashboard
     */
    public function index()
    {
        return inertia('StudentDashboard');
    }
    public function getProfile()
    {
        try {
            $user = Auth::user();
    
            return response()->json([
                'name' => $user->name,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching profile: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to fetch profile.'], 500);
        }
    }
    
    /**
     * Get Homework Status for a Specific Page
     */
    public function getHomeworkStatus(Request $request)
    {
        $user = Auth::user();

        $homework = Assignment::where('user_id', $user->id)
            ->where('task_status', 'incomplete')
            ->first();

        return response()->json([
            'page_id' => $homework->page_id ?? null,
        ]);
    }

    /**
     * Mark a Page as Done
     */
    public function markAsDone($pageId)
    {
        try {
            $user = Auth::user();

            // Ensure the page exists
            $page = Page::findOrFail($pageId);

            // Check if the assignment already exists
            $assignment = Assignment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'page_id' => $pageId,
                ],
                ['task_status' => 'completed']
            );

            return response()->json(['message' => 'Page marked as done successfully.']);
        } catch (\Exception $e) {
            Log::error("Error marking page as done: {$e->getMessage()}");

            return response()->json(['error' => 'Failed to mark page as done.'], 500);
        }
    }

    /**
     * Save a Drawing Submission
     */
    public function saveDrawing(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'page_id' => 'required|integer|exists:pages,id',
            'drawing_json' => 'required|string'
        ]);

        try {
            $user = Auth::user();

            // Check for an existing submission for the student and page
            $submission = Submission::where('student_id', $user->id)
                ->where('page_id', $validated['page_id'])
                ->first();

            $fileName = 'drawing_' . uniqid() . '.json';

            if ($submission) {
                // Handle save logic
                $filePath = "drawings/{$fileName}";
                Storage::put($filePath, $validated['drawing_json']);
                // Update existing submission
                $submission->update([
                    'drawing' => $fileName,
                    'status' => 'saved',
                    'updated_at' => now(),
                ]);
            } else {
                // Create new submission
                Submission::create([
                    'student_id' => $user->id,
                    'teacher_id' => $user->teacher_id,
                    'page_id' => $validated['page_id'],
                    'drawing' => $fileName,
                    'status' => 'saved',
                ]);
            }

            return response()->json([
                'message' => 'Drawing saved successfully!',
                'status' => 'saved',
            ]);
        } catch (\Exception $e) {
            Log::error("Error saving/submitting drawing: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to process the drawing'], 500);
        }
    }

    /**
     * Submit a Drawing Submission
     */
    public function submitDrawing(Request $request) {

        $validated = $request->validate([
            'page_id' => 'required|integer|exists:pages,id'
        ]);

        $user = Auth::user();

        $submission = Submission::where('student_id', $user->id)
                ->where('page_id', $validated['page_id']);

        $submission->update([
            'status' => 'submitted',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Drawing submitted successfully!',
            'status' => 'submitted',
        ]);
    }


    /**
     * Show Student Page
     */
    public function showStudentPage($pageId)
    {
        try {
            $page = Page::findOrFail($pageId);

            return inertia('StudentPage', [
                'page' => [
                    'id' => $page->id,
                    'textbook_id' => $page->textbook_id,
                    'image' => basename($page->image),
                    'page_number' => $page->page_number,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching student page: {$e->getMessage()}");

            return redirect()->route('student.dashboard')
                ->withErrors(['error' => 'Failed to load the page.']);
        }
    }

    /**
     * Fetch Buttons for a Page
     */
    public function fetchPageButtons($pageId)
    {
        try {
            // Fetch buttons and construct the URL
            $buttons = Button::where('page_id', $pageId)
                ->get(['x', 'y', 'audio_path', 'page_id'])
                ->map(function ($button) {
                    $textbookId = Page::where('id', $button->page_id)->value('textbook_id');
                    $fileName = basename($button->audio_path);
    
                    // Generate a correct URL to serve the audio
                    $audioUrl = route('audio.serve', ['textbookId' => $textbookId, 'fileName' => $fileName]);
    
                    return [
                        'x' => $button->x,
                        'y' => $button->y,
                        'audio' => $audioUrl,
                    ];
                });
    
            return response()->json(['buttons' => $buttons]);
        } catch (\Exception $e) {
            Log::error("Error fetching buttons: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to fetch buttons'], 500);
        }
    }
    
       /**
     * Remove Assigned Teacher
     */
    public function removeTeacher()
    {
        try {
            $student = Auth::user();

            if ($student->role !== 'student') {
                return response()->json(['error' => 'Unauthorized action'], 403);
            }

            if (is_null($student->teacher_id)) {
                return response()->json(['message' => 'No teacher assigned to remove'], 200);
            }

            $student->teacher_id = null;
            $student->save();

            return response()->json(['message' => 'Teacher removed successfully']);
        } catch (\Exception $e) {
            Log::error("Error removing teacher: {$e->getMessage()}");

            return response()->json(['error' => 'Failed to remove teacher'], 500);
        }
    }

    /**
     * Get Next Page
     */
    public function getNextPage($pageId)
    {
        try {
            $currentPage = Page::findOrFail($pageId);

            $nextPage = Page::where('textbook_id', $currentPage->textbook_id)
                ->where('page_number', '>', $currentPage->page_number)
                ->orderBy('page_number', 'asc')
                ->first();

            if (!$nextPage) {
                return response()->json(['error' => 'No next page available.'], 404);
            }

            return response()->json($nextPage);
        } catch (\Exception $e) {
            Log::error("Error fetching next page: {$e->getMessage()}");

            return response()->json(['error' => 'Failed to fetch next page.'], 500);
        }
    }

    /**
     * Get Previous Page
     */
    public function getPrevPage($pageId)
    {
        try {
            $currentPage = Page::findOrFail($pageId);

            $prevPage = Page::where('textbook_id', $currentPage->textbook_id)
                ->where('page_number', '<', $currentPage->page_number)
                ->orderBy('page_number', 'desc')
                ->first();

            if (!$prevPage) {
                return response()->json(['error' => 'No previous page available.'], 404);
            }

            return response()->json($prevPage);
        } catch (\Exception $e) {
            Log::error("Error fetching previous page: {$e->getMessage()}");

            return response()->json(['error' => 'Failed to fetch previous page.'], 500);
        }
    }


    public function assignTextbook(Request $request)
    {
        try {
            $user = Auth::user();
    
            // Validate that the input contains a valid textbook ID
            $validated = $request->validate([
                'textbook_id' => 'required|exists:textbooks,id',
            ]);
    
            // Check if the relationship already exists
            $alreadyAssigned = DB::table('user_textbooks')
                ->where('user_id', $user->id)
                ->where('textbook_id', $validated['textbook_id'])
                ->exists();
    
            if ($alreadyAssigned) {
                return response()->json(['message' => 'Textbook already assigned to this student.'], 200);
            }
    
            // Attach textbook to the user
            $_user = User::where('id', $user->id)->first();
            $_user->textbooks()->attach($validated['textbook_id']);
    
            return response()->json(['message' => 'Textbook assigned successfully.'], 200);
        } catch (\Exception $e) {
            Log::error("Error assigning textbook: {$e->getMessage()}");
    
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
}
