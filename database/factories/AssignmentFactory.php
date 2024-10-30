<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\User;
use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    protected $model = Assignment::class;

    public function definition()
    {
        return [
            'user_id' => User::factory()->create()->id,
            'page_id' => Page::factory()->create()->id,
            'submission_path' => null, // Start with no submission
        ];
    }
}
