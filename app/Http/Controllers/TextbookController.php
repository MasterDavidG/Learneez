<?php

namespace App\Http\Controllers;

use App\Models\Textbook;
use Illuminate\Http\Request;

class TextbookController extends Controller
{
    public function index()
    {
        $textbooks = Textbook::all();
        return response()->json($textbooks);
    }

    public function store(Request $request)
    {
        $textbook = Textbook::create($request->all());
        return response()->json($textbook, 201);
    }

    public function show($id)
    {
        $textbook = Textbook::findOrFail($id);
        return response()->json($textbook);
    }
}
