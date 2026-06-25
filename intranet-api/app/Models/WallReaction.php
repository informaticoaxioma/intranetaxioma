<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WallReaction extends Model
{
    use HasFactory;

    protected $table = 'wall_reactions';

    protected $fillable = [
        'post_id',
        'user_id',
        'tipo',
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
