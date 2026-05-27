<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'fecha',
        'tipo',
        'hora_inicio',
        'hora_fin',
        'ubicacion',
        'descripcion'
    ];
}
