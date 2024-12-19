<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Button;
use App\Models\Textbook;
use Spatie\PdfToImage\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index()
    {
        $pages = Page::all();
        return inertia('AdminPage', ['pages' => $pages]);
    }

    public function uploadAndProcessTextbook(Request $request)
    {
        // Validate the input fields: title and PDF
        $request->validate([
            'title' => 'required|string|max:255',
            'pdf' => 'required|file|mimes:pdf|max:20480', // Max size 20MB
        ]);
    
        try {
            Log::info('Starting textbook upload and processing...');
    
            // Store uploaded PDF to 'textbooks' directory
            $pdfPath = $request->file('pdf')->store('textbooks'); // Correct path
            Log::info("PDF successfully stored at: {$pdfPath}");
    
            // Create textbook record with the given title
            $textbook = Textbook::create([
                'title' => $request->title,
            ]);
            Log::info("Textbook created: ID {$textbook->id}, Title: {$textbook->title}");
    
            // Create directories for pages and audio
            Storage::makeDirectory("pages/{$textbook->id}");
            Storage::makeDirectory("audio/{$textbook->id}");
            Log::info("Directories created for textbook ID: {$textbook->id}");
    
            // Process PDF pages
            $pdf = new Pdf(storage_path("app/private/{$pdfPath}")); // Adjusted path
            $pageCount = $pdf->pageCount();
            Log::info("PDF has {$pageCount} pages.");
    
            for ($i = 1; $i <= $pageCount; $i++) {
                $imageName = "page_{$i}.jpg";
    
                // Save each page as an image
                $pdf->selectPage($i)->save(storage_path("app/private/pages/{$textbook->id}/{$imageName}"));
                Log::info("Processed page {$i} for textbook ID {$textbook->id}");
    
                // Create a record in the 'pages' table
                Page::create([
                    'textbook_id' => $textbook->id,
                    'image' => $imageName,
                    'page_number' => $i,
                ]);
            }
    
            Log::info('Textbook processing completed successfully.');
    
            return response()->json([
                'message' => 'Textbook uploaded and processed successfully',
                'textbook_id' => $textbook->id,
            ]);
        } catch (\Exception $e) {
            Log::error("Error uploading and processing textbook: {$e->getMessage()}");
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    
    public function saveButton(Request $request)
    {
        $validated = $request->validate([
            'page_id' => 'required|exists:pages,id',
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'audio' => 'nullable|file|mimes:webm',
        ]);

        try {
            $page = Page::findOrFail($validated['page_id']);
            $textbookId = $page->textbook_id;

            $filename = Str::uuid().".webm";
            if ($request->hasFile('audio')) {
                $request->file('audio')->storeAs("audio/{$textbookId}", $filename);
            }

            Button::create([
                'page_id' => $validated['page_id'],
                'x' => $validated['x'],
                'y' => $validated['y'],
                'audio_path' => $filename,
            ]);

            return response()->json(['message' => 'Button saved successfully']);
        } catch (\Exception $e) {
            Log::error('Error saving button: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to save button.'], 500);
        }
        
    }
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
    public function savePage(Request $request)
    {
        $validated = $request->validate([
            'page_id' => 'required|exists:pages,id',
            'buttons' => 'required|array',
            'buttons.*.x' => 'required|numeric',
            'buttons.*.y' => 'required|numeric',
            'buttons.*.audio' => 'nullable|file|mimes:webm',
        ]);

        try {
            $page = Page::findOrFail($validated['page_id']);

            foreach ($validated['buttons'] as $button) {
                $filename = Str::uuid().".webm";

                if (isset($button['audio']) && $button['audio'] instanceof \Illuminate\Http\UploadedFile) {
                    $button['audio']->store("audio/{$page->textbook_id}/{$filename}");
                }

                Button::create([
                    'page_id' => $page->id,
                    'x' => $button['x'],
                    'y' => $button['y'],
                    'audio_path' => $filename,
                ]);
            }

            return response()->json(['message' => 'Page saved successfully']);
        } catch (\Exception $e) {
            Log::error('Error saving page: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to save page.'], 500);
        }
    }
}
