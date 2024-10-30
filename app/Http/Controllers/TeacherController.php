<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        return Inertia::render('TeacherPage'); // Ensure this corresponds to the frontend component name
    }
}

