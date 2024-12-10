<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Page;
use App\Models\Button;
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
        $validated = $request->validate([
            'page_id' => 'required|integer|exists:pages,id',
            'drawing' => 'required|string',
        ]);

        try {
            $drawingData = base64_decode(
                preg_replace('#^data:image/\w+;base64,#i', '', $validated['drawing'])
            );

            $fileName = 'drawing_' . uniqid() . '.png';
            $filePath = "drawings/{$fileName}";

            Storage::put($filePath, $drawingData);

            Submission::create([
                'student_id' => Auth::id(),
                'teacher_id' => Auth::user()->teacher_id,
                'page_id' => $validated['page_id'],
                'drawing' => $fileName,
            ]);

            return response()->json(['message' => 'Drawing saved successfully']);
        } catch (\Exception $e) {
            Log::error("Error saving drawing: {$e->getMessage()}");

            return response()->json(['error' => 'Failed to save drawing'], 500);
        }
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
}
