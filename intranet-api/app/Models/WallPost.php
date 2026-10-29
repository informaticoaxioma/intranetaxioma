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
        'imagenes',
    ];

    protected $casts = [
        'imagenes' => 'array',
    ];

    protected $appends = ['imagen_url', 'imagenes_urls'];

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
        if ($this->path_imagen) {
            return asset('storage/' . $this->path_imagen);
        }

        if (!empty($this->imagenes) && is_array($this->imagenes)) {
            return asset('storage/' . $this->imagenes[0]);
        }

        return null;
    }

    public function getImagenesUrlsAttribute()
    {
        if (!empty($this->imagenes) && is_array($this->imagenes)) {
            return array_values(array_map(fn($path) => asset('storage/' . $path), $this->imagenes));
        }

        if (!empty($this->imagen) && is_string($this->imagen) && str_starts_with(trim($this->imagen), '[')) {
            $decoded = json_decode($this->imagen, true);
            if (is_array($decoded) && !empty($decoded)) {
                return array_values(array_map(fn($path) => asset('storage/' . $path), $decoded));
            }
        }

        if ($this->path_imagen) {
            return [asset('storage/' . $this->path_imagen)];
        }

        return [];
    }
}
