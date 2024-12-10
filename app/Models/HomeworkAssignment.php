<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeworkAssignment extends Model
{
    use HasFactory;

    protected $fillable = ['teacher_id', 'student_id', 'page_id', 'assigned_date', 'is_daily_homework'];
}
