<?php

namespace App\Http\Controllers;

use App\Models\Textbook;
use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;



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
}
