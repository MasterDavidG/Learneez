<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Illuminate\Http\Request;
// StudentController.php

class StudentController extends Controller
{
    public function index()
    {
        return Inertia::render('StudentPage'); // Ensure this corresponds to the frontend component name
    }
}

