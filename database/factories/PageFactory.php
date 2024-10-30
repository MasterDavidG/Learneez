<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\Textbook;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition()
    {
        return [
            'textbook_id' => Textbook::factory()->create()->id,
            'image_path' => $this->faker->imageUrl(800, 600, 'abstract'),
            'audio_path' => $this->faker->file('/audio', 'mp3'),
        ];
    }
}
