<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Textbook;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index($textbookId)
    {
        $pages = Page::where('textbook_id', $textbookId)->get();
        return response()->json($pages);
    }

    public function store(Request $request, $textbookId)
    {
        $page = new Page($request->all());
        $page->textbook_id = $textbookId;
        $page->save();
        
        return response()->json($page, 201);
    }
}

