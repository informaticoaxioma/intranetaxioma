<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WallPost extends Model
{
    use HasFactory;

    protected $table = 'wall_posts';

    protected $fillable = [
        'user_id',
        'contrato',
        'contenido',
        'imagen',
        'path_imagen',
    ];

    protected $appends = ['imagen_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(WallComment::class, 'post_id');
    }

    public function reactions()
    {
        return $this->hasMany(WallReaction::class, 'post_id');
    }

    public function getImagenUrlAttribute()
    {
        if (!$this->path_imagen) {
            return null;
        }

        return asset('storage/' . $this->path_imagen);
    }
}
