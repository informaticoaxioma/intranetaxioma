<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, HasRoles, Notifiable;

  protected $fillable = [
    'name',

    'apellido',

    'email',

    'password',

    'telefono',

    'direccion',

    'fecha_nacimiento',

    'departamento',

    'cargo',

    'fecha_ingreso',

    'supervision_general',

    'role',

    'estado_cuenta'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $casts = [

        'email_verified_at' => 'datetime',

        'password' => 'hashed',

        'fecha_nacimiento' => 'date',

        'fecha_ingreso' => 'date'
    ];

    public function vacations()
    {
        return $this->hasMany(Vacation::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function laborDocuments()
    {
        return $this->hasMany(LaborDocument::class);
    }
}
