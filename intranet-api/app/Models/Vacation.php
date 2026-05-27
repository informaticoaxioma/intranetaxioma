<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fecha_inicio',
        'fecha_fin',
        'dias_solicitados',
        'comentario',
        'estado',
        'aprobado_por',
        'fecha_aprobacion',
        'comentario_admin'
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'aprobado_por');
    }
}