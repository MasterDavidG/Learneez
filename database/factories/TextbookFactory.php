<?php

namespace Database\Factories;

use App\Models\Textbook;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TextbookFactory extends Factory
{
    protected $model = Textbook::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'user_id' => User::factory()->create()->id,
        ];
    }
}
