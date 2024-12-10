<?php

namespace App\Http\Controllers;

use App\Models\Textbook;
use App\Models\Page;
use Illuminate\Http\Request;

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
            $textbooks = Textbook::all(['id', 'title']); // Fetch only id and title
            return response()->json($textbooks, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch textbooks.'], 500);
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
}
