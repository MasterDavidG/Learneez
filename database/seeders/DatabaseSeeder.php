<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Textbook;
use App\Models\Page;
use App\Models\Button;
use App\Models\Submission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Ensure directories exist
        Storage::makeDirectory('private/pages');
        Storage::makeDirectory('private/textbooks');
        Storage::makeDirectory('private/audio');

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create teacher
        $teacher = User::create([
            'name' => 'Teacher User',
            'email' => 'teacher@example.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        // Create student and assign the teacher
        $student = User::create([
            'name' => 'Student User',
            'email' => 'student@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'teacher_id' => $teacher->id, // Link student to the teacher
        ]);

        // Create textbooks
        $textbooks = [
            ['title' => 'Math Textbook'],
            ['title' => 'Science Textbook'],
            ['title' => 'History Textbook'],
        ];

        foreach ($textbooks as $textbookData) {
            // Create a textbook record
            $textbook = Textbook::create($textbookData);

            // Simulate storing the textbook PDF
            $pdfFilePath = "private/textbooks/{$textbook->title}.pdf";
            Storage::put($pdfFilePath, "Sample PDF content for {$textbook->title}");

            // Create pages for the textbook
            for ($pageNum = 1; $pageNum <= 3; $pageNum++) {
                // Simulate storing the page image
                $imageFilePath = "private/pages/{$textbook->title}_page_{$pageNum}.jpg";
                Storage::put($imageFilePath, "Sample Page {$pageNum} Image Content");

                $page = Page::create([
                    'textbook_id' => $textbook->id,
                    'page_number' => $pageNum,
                    'image' => $imageFilePath,
                ]);

                // Add buttons to each page
                $buttons = [
                    ['x' => 50 + ($pageNum * 10), 'y' => 100 + ($pageNum * 20), 'audio_path' => "private/audio/{$textbook->title}_button_{$pageNum}_1.mp3"],
                    ['x' => 200 + ($pageNum * 10), 'y' => 300 + ($pageNum * 20), 'audio_path' => "private/audio/{$textbook->title}_button_{$pageNum}_2.mp3"],
                ];

                foreach ($buttons as $buttonData) {
                    // Simulate storing button audio
                    Storage::put($buttonData['audio_path'], "Sample Audio for Button {$buttonData['x']}, {$buttonData['y']}");

                    Button::create(array_merge(['page_id' => $page->id], $buttonData));
                }
            }
        }

        // Create a sample submission
        $sampleDrawingPath = 'private/pages/drawing_sample.png';
        Storage::put($sampleDrawingPath, 'Sample Drawing Content');

        Submission::create([
            'student_id' => $student->id,
            'teacher_id' => $teacher->id,
            'page_id' => 1, // Link to the first page of the first textbook
            'drawing' => $sampleDrawingPath,
        ]);
    }
}
