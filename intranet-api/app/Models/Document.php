<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'categoria',
        'autor',
        'tamano_archivo',
        'ultima_modificacion',
        'path',
        'archivo'
    ];

        /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    public function getArchivoUrlAttribute()
    {
        return asset('storage/' . $this->archivo);
    }
}
