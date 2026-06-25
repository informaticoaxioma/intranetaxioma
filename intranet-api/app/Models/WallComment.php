<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WallComment extends Model
{
    use HasFactory;

    protected $table = 'wall_comments';

    protected $fillable = [
        'post_id',
        'user_id',
        'contenido',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(WallPost::class);
    }
}
