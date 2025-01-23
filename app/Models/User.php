<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;



class User extends Authenticatable implements MustVerifyEmail{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'teacher_id' // Nullable field to link students with teachers
    ];

    // Relationship for students assigned to this teacher
    public function students()
    {
        return $this->hasMany(User::class, 'teacher_id');
    }

    // Relationship to the teacher assigned to this student
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // Relationship for homework assignments given to this student
    public function homeworkAssignments()
    {
        return $this->hasMany(HomeworkAssignment::class, 'student_id');
    }

    // Relationship for homework assignments created by this teacher
    public function assignedHomework()
    {
        return $this->hasMany(HomeworkAssignment::class, 'teacher_id');
    }
    public function textbooks()
    {
        return $this->belongsToMany(Textbook::class, 'user_textbooks', 'user_id', 'textbook_id')->withTimestamps();
    }
}
