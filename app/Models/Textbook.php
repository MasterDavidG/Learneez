<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Textbook extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'user_id'];

    public function pages()
    {
        return $this->hasMany(Page::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
