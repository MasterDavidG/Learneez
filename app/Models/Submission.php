<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'teacher_id', 'page_id', 'drawing'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
