<?php

namespace App\Http\Controllers;

use App\Models\Textbook;
use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Pdf;



class TextbookController extends Controller
{
    /**
     * Fetch all textbooks.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {    
            // Fetch textbooks associated with the user through the pivot table
            $textbooks = Textbook::select('id', 'title')->get();
    
            return response()->json($textbooks, 200);
        } catch (\Exception $e) {
            Log::error("Error fetching textbooks: {$e->getMessage()}");
    
            return response()->json(['error' => 'Failed to fetch textbooks.'], 500);
        }
    }
    
    public function userTextbooks()
    {
        try {
            $user = Auth::user(); // Get the currently authenticated user
            // Retrieve textbooks linked to the user through the user_textbooks table
            $textbooks = Textbook::whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->select('id', 'title')->get();

            return response()->json($textbooks, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch user textbooks.'], 500);
        }
    }
    /**
     * Fetch pages for a specific textbook.
     *
     * @param Textbook $textbook
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPages(Textbook $textbook)
    {
        try {
            // Use the 'pages' relationship defined in the Page model
            $pages = $textbook->pages()->get(['id', 'page_number', 'image']);

            return response()->json($pages, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch pages for the textbook.'], 500);
        }
    }

        // Step 1: Upload textbook and save the title
        public function uploadTextbook(Request $request)
        {
            $request->validate([
                'title' => 'required|string|max:255',
                'pdf' => 'required|file|mimes:pdf|max:20480', // 20MB limit
            ]);
    
            try {
                // Save the uploaded PDF file
                $pdfPath = $request->file('pdf')->store('private/textbooks');
    
                // Create textbook entry
                $textBook = Textbook::create([
                    'title' => $request->input('title'),
                ]);
    
                // Save the PDF file in a fixed location with the textbook ID
                Storage::move($pdfPath, "private/textbooks/{$textBook->id}.pdf");
    
                return response()->json([
                    'message' => 'Textbook uploaded successfully. Ready for processing.',
                    'textbook_id' => $textBook->id,
                ]);
            } catch (\Exception $e) {
                Log::error('Error uploading textbook: ' . $e->getMessage());
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
    
        // Step 2: Process the textbook into pages
        public function processTextbook(Request $request, $id)
        {
            try {
                $textBook = Textbook::findOrFail($id);
    
                // Define PDF file path
                $pdfFullPath = storage_path("app/private/textbooks/{$textBook->id}.pdf");
                if (!file_exists($pdfFullPath)) {
                    return response()->json(['error' => 'PDF file not found'], 404);
                }
    
                // Create directories for pages and audio
                Storage::makeDirectory("private/pages/{$textBook->id}");
                Storage::makeDirectory("private/audio/{$textBook->id}");
    
                // Load and process the PDF
                $pdf = new Pdf($pdfFullPath);
                $pageCount = $pdf->pageCount();
    
                for ($i = 1; $i <= $pageCount; $i++) {
                    $imageName = "page_{$i}.jpg";
                    $pdf->selectPage($i)->save(storage_path("app/private/pages/{$textBook->id}/{$imageName}"));
    
                    Page::create([
                        'textbook_id' => $textBook->id,
                        'image' => $imageName,
                        'page_number' => $i,
                    ]);
                }
    
                return response()->json([
                    'message' => 'Textbook processed successfully into pages.',
                ]);
            } catch (\Exception $e) {
                Log::error('Error processing textbook: ' . $e->getMessage());
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
    
}
