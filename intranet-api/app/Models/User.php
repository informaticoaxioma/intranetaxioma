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

#[Fillable(['name', 'email', 'password', 'rut'])]
#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, HasRoles, Notifiable;

  protected $fillable = [
    'name',

    'apellido',

    'rut',

    'email',

    'password',

    'telefono',

    'direccion',

    'fecha_nacimiento',

    'departamento',

    'cargo',

    'fecha_ingreso',

    'contrato',

    'foto_perfil',

    'path_foto_perfil',

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

    protected $appends = [
        'can_access_ticketera'
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

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Determina si el usuario pertenece al departamento de Tecnología / TI / Informática.
     */
    public function isTechDepartment(): bool
    {
        if (empty($this->departamento)) {
            return false;
        }

        $dept = mb_strtolower(trim($this->departamento));
        $unaccented = str_replace(
            ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú'],
            ['a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u'],
            $dept
        );

        return in_array($unaccented, ['tecnologia', 'ti', 'it', 'sistemas', 'informatica', 'tecnologia e informatica'])
            || str_contains($unaccented, 'tecnolog')
            || str_contains($unaccented, 'informatic')
            || $unaccented === 'ti';
    }

    /**
     * Determina si el usuario tiene acceso a la administración de la ticketera.
     * Solo los administradores del departamento de tecnología tienen acceso.
     */
    public function canAccessTicketera(): bool
    {
        return $this->role === 'admin' && $this->isTechDepartment();
    }

    /**
     * Atributo computado para serialización JSON automática.
     */
    public function getCanAccessTicketeraAttribute(): bool
    {
        return $this->canAccessTicketera();
    }
}
