<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Button extends Model
{
    use HasFactory;

    protected $fillable = ['page_id', 'x', 'y', 'audio_path'];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
