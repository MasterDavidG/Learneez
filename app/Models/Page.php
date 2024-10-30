<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = ['textbook_id', 'image_path', 'audio_path'];

    public function textbook()
    {
        return $this->belongsTo(Textbook::class);
    }
}
