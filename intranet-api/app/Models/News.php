<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $table = 'news';

    protected $fillable = [
        'titulo',
        'resumen',
        'texto_noticia',
        'categoria',
        'autor',
        'imagen'
    ];

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    public function getImagenUrlAttribute()
    {
        if (!$this->imagen) {
            return null;
        }

        return asset('storage/' . $this->imagen);
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    public function scopeCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

}