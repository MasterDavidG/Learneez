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

    public function uploadTextbook(Request $request)
    {
        $request->validate(['pdf' => 'required|file|mimes:pdf|max:20480']); // 20MB limit

        try {
            // Store uploaded PDF
            $pdfPath = $request->file('pdf')->store('textbooks');

            $textBook = Textbook::create([
                'title' => 'Uchebik Test',
            ]);

            Storage::makeDirectory("pages/{$textBook->id}");
            Storage::makeDirectory("audio/{$textBook->id}");

            $pdf = new Pdf(storage_path("app/private/{$pdfPath}"));
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

            return response()->json(['message' => 'Textbook uploaded and pages created successfully']);
        } catch (\Exception $e) {
            Log::error('Error uploading textbook: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
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
