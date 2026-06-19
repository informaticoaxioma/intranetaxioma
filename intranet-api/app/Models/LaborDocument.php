<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaborDocument extends Model
{
    protected $fillable = [
        'user_id',
        'tipo_documento',
        'archivo',
        'path',
        'fecha_emision',
        'fecha_vencimiento',
        'observaciones'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
