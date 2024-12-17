<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Textbook extends Model
{
    use HasFactory;

    protected $fillable = ['title'];


    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_textbooks', 'textbook_id', 'user_id')
                    ->withTimestamps();
    }
}
