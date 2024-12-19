<?php

use App\Http\Controllers\{
    SubmissionController,
    Auth\AuthenticatedSessionController,
    StudentController,
    TeacherController,
    TextbookController,
    PageController,
    AdminController,
    ButtonController
};
use Illuminate\Support\Facades\{Auth, Route, Storage};
use Inertia\Inertia;

require __DIR__ . '/auth.php';

use App\Http\Controllers\ProfileController;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Welcome and About Pages
Route::get('/', fn() => Inertia::render('Welcome'))->name('home');
Route::get('/about', fn() => Inertia::render('About'));

// Route to show submission drawings
Route::get('/submissions/drawings/{filename}', [TeacherController::class, 'showDrawing'])
    ->name('submissions.drawing')
    ->middleware('auth');

// Dashboard Route with Role-Based Redirection
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            default => redirect('/')->withErrors(['Unauthorized access.']),
        };
    })->name('dashboard');

    Route::get('/pages/{textbookId}/{filename}', [PageController::class, 'showPage'])->name('showPage');

    Route::middleware(['auth', 'role:student'])->group(function () {
        Route::get('/student', fn() => Inertia::render('StudentDashboard'))->name('student.dashboard');
        Route::middleware(['auth', 'role:student'])->get('/api/student/profile', [StudentController::class, 'getProfile'])->name('student.profile');
        Route::get('/api/user/textbooks', [TextbookController::class, 'userTextbooks'])->name('api.user.textbooks');

        // Route for rendering a specific student page
        Route::get('/student/page/{pageId}', [StudentController::class, 'showStudentPage'])->name('student.page');

        // API route for fetching buttons associated with a page
        Route::get('/api/student/page/{pageId}/buttons', [StudentController::class, 'fetchPageButtons'])->name('student.page.buttons');

        // Save drawing submission
        Route::post('/student/drawing/save', [StudentController::class, 'saveDrawing'])->name('student.saveDrawing');

        // Submit drawing submission
        Route::post('/student/drawing/submit', [StudentController::class, 'submitDrawing'])->name('student.submitDrawing');

        // Mark a page as done
        Route::post('/student/page/{pageId}/mark-as-done', [StudentController::class, 'markAsDone'])->name('student.page.markAsDone');

        // API for next and previous page navigation

        Route::post('/api/student/remove-teacher', [StudentController::class, 'removeTeacher']);
        Route::get('/student/page/{pageId}/next', [StudentController::class, 'getNextPage']);
        Route::get('/student/page/{pageId}/prev', [StudentController::class, 'getPrevPage']);
        Route::get('/student/page/{pageId}/buttons', [StudentController::class, 'fetchPageButtons']);
        Route::get('/api/buttons/{pageId}', [ButtonController::class, 'fetchButtons'])
            ->name('buttons.fetch');

        // Route to serve audio files for a button
        Route::get('/api/buttons/audio/{textbookId}/{fileName}', [ButtonController::class, 'serveAudio'])
            ->name('button.audio');
    });

    Route::post('/student/assign-textbook', [StudentController::class, 'assignTextbook'])
        ->name('student.assignTextbook')
        ->middleware(['auth', 'role:student']);

    // Teacher Routes
    Route::middleware(['auth', 'role:teacher'])->group(function () {
        Route::get('/teacher', [TeacherController::class, 'index'])->name('teacher.dashboard');
        Route::get('/teacher/submissions', [TeacherController::class, 'viewSubmissions'])->name('teacher.submissions');
        Route::get('/teacher/books', [TeacherController::class, 'getBooks'])->name('teacher.books');
        Route::get('/teacher/books/{book}/pages', [TeacherController::class, 'getPagesForBook'])->name('teacher.book.pages');
        Route::post('/api/teacher/assign-homework', [TeacherController::class, 'assignHomework'])->name('teacher.assignHomework');
        Route::get('/api/submissions', [SubmissionController::class, 'getSubmissions'])->name('api.submissions');
        Route::get('/api/submission/{submissionId}', [SubmissionController::class, 'getSubmissionJSON'])->name('api.submissionJSON');
        Route::get('/api/students', [TeacherController::class, 'getStudents'])->name('api.students');
        Route::post('/api/teacher/adopt-student', [TeacherController::class, 'adoptStudent']);
        Route::get('/api/unassigned-students', [TeacherController::class, 'getUnassignedStudents']);
        Route::get('/teacher/drawings/{filename}', [TeacherController::class, 'showDrawing'])
            ->name('teacher.showDrawing');
    });

    // Admin Routes
    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::post('/admin/save-page', [AdminController::class, 'savePage'])->name('admin.savePage');
        Route::post('/admin/upload-and-process-textbook', [AdminController::class, 'uploadAndProcessTextbook']);

        // Route to show submission drawings
        Route::middleware(['auth', 'role:admin'])->group(function () {
            Route::post('/admin/save-button', [AdminController::class, 'saveButton'])->name('admin.saveButton');
        });
    });
});

// Logout Route
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/page/{pageId}/buttons', [ButtonController::class, 'fetchPageButtons']);
Route::get('/api/buttons/{pageId}', [ButtonController::class, 'fetchButtons']);

// Public API Endpoints
Route::get('/api/textbooks', [TextbookController::class, 'index'])->name('api.textbooks');
Route::get('/api/textbooks/{textbook}/pages', [PageController::class, 'getPagesForTextbook']);
Route::get('/api/pages', [PageController::class, 'index']);
Route::get('/api/student/homework-status', [StudentController::class, 'getHomeworkStatus']);

require __DIR__ . '/auth.php';
