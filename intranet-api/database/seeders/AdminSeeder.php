<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\User;

use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([

            'name' => 'Administrador',

            'apellido' => 'Sistema',

            'email' => 'admin@intranet.cl',

            'password' => Hash::make(
                'Admin123*'
            ),

            'telefono' => '+56911111111',

            'direccion' => 'Casa Matriz',

            'fecha_nacimiento' => '1990-01-01',

            'departamento' => 'TI',

            'cargo' => 'Administrador General',

            'fecha_ingreso' => now(),

            'supervision_general' => 'Gerencia General',

            'role' => 'admin',

            'estado_cuenta' => 'activo'
        ]);

        /*
        |--------------------------------------------------------------------------
        | ASSIGN ROLE
        |--------------------------------------------------------------------------
        */

        $admin->assignRole('admin');
    }
}