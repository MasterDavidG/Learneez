<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'page_id', 'submission_path'];

    public function user()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
