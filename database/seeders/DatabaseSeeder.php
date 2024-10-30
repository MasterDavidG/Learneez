<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Textbook;
use App\Models\Page;
use App\Models\Assignment;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create teacher user
        $teacher = User::create([
            'name' => 'Teacher User',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        // Create student user
        $student = User::create([
            'name' => 'Student User',
            'email' => 'student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        // Create textbooks
        $mathTextbook = Textbook::create([
            'title' => 'Math Textbook',
            'user_id' => $admin->id,  // Assigning the admin as the creator
        ]);

        $scienceTextbook = Textbook::create([
            'title' => 'Science Textbook',
            'user_id' => $admin->id,  // Assigning the admin as the creator
        ]);

        // Create pages for Math textbook
        $page1 = Page::create([
            'textbook_id' => $mathTextbook->id,
            'audio_file' => 'audio/1011.mp3',  // Correct reference to audio file
            'content' => 'Math Page 1 content, using the SVG file.',
            'image' => 'svg.svg',  // Correct reference to SVG image
        ]);

        $page2 = Page::create([
            'textbook_id' => $mathTextbook->id,
            'audio_file' => 'audio/1012.mp3',  // Reference another audio file
            'content' => 'Math Page 2 content.',
            'image' => 'svg.svg',  // Reuse SVG or another one
        ]);

        // Create pages for Science textbook
        $page3 = Page::create([
            'textbook_id' => $scienceTextbook->id,
            'audio_file' => 'audio/1011.mp3',  // Reference the same audio file for simplicity
            'content' => 'Science Page 1 content.',
            'image' => 'svg.svg',
        ]);

        $page4 = Page::create([
            'textbook_id' => $scienceTextbook->id,
            'audio_file' => 'audio/1012.mp3',  // Another audio file
            'content' => 'Science Page 2 content.',
            'image' => 'svg.svg',
        ]);

        // Create assignments for student
        Assignment::create([
            'page_id' => $page1->id,
            'user_id' => $student->id,
            'task_status' => 'incomplete',
        ]);

        Assignment::create([
            'page_id' => $page3->id,
            'user_id' => $student->id,
            'task_status' => 'incomplete',
        ]);
    }
}
