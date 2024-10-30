<?php
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Route for Welcome Page
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Dashboard Route for Redirecting Based on User Role
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user(); // Make sure the user is authenticated
        // Redirect based on role
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            default => redirect('/')->withErrors(['Unauthorized access.']),
        };
    })->name('dashboard');

    // Role-based Routes
    Route::middleware(CheckRole::class.':student')->get('/student', [StudentController::class, 'index'])->name('student.dashboard');
    Route::middleware(CheckRole::class.':teacher')->get('/teacher', [TeacherController::class, 'index'])->name('teacher.dashboard');
    Route::middleware(CheckRole::class.':admin')->get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
});

require __DIR__.'/auth.php';
