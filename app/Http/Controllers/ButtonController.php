<?php

namespace App\Http\Controllers;

use App\Models\Button;
use App\Models\Page;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ButtonController extends Controller
{
    /**
     * Fetch buttons for a specific page
     */
    public function fetchButtons($pageId)
    {
        try {
            $buttons = Button::where('page_id', $pageId)
                ->get(['x', 'y', 'audio_path', 'page_id'])
                ->map(function ($button) {
                    $textbookId = Page::where('id', $button->page_id)->value('textbook_id');
                    $fileName = basename($button->audio_path);

                    // Construct audio URL
                    return [
                        'x' => $button->x,
                        'y' => $button->y,
                        'audio' => route('button.audio', ['textbookId' => $textbookId, 'fileName' => $fileName]),
                    ];
                });

            return response()->json(['buttons' => $buttons]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch buttons'], 500);
        }
    }

    /**
     * Serve the audio file for a button
     */

    public function serveAudio($textbookId, $filename)
    {
        $filePath = "audio/{$textbookId}/{$filename}";
        
        if (!Storage::exists($filePath)) {
            abort(404, 'File not found');
        }
    
        $file = Storage::get($filePath);
        $mimeType = Storage::mimeType($filePath);
    
        return response($file, 200)->header('Content-Type', $mimeType);
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
}