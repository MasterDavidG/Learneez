<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Button;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PageController extends Controller
{


    public function showPage($textbookId, $filename)
    {
        $filePath = "pages/{$textbookId}/{$filename}";
        
        if (!Storage::exists($filePath)) {
            abort(404, 'File not found');
        }
    
        $file = Storage::get($filePath);
        $mimeType = Storage::mimeType($filePath);
    
        return response($file, 200)->header('Content-Type', $mimeType);
    }
    
    public function getPagesForTextbook($textbookId)
    {
        $pages = Page::where('textbook_id', $textbookId)->get();

        return response()->json($pages);
    }

    public function index(Request $request)
    {
        $bookId = $request->query('book_id');
        $pages = Page::where('textbook_id', $bookId)->get();

        return response()->json($pages);
    }
}
