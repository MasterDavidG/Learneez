<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = ['textbook_id', 'image', 'content', 'page_number'];

    public function buttons()
    {
        return $this->hasMany(Button::class);
    }

    public function textbook()
    {
        return $this->belongsTo(Textbook::class);
    }
}
