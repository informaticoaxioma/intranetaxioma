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
            'email' => 'admin@intranet.cl',
            'password' => Hash::make('Admin123*')
        ]);

        $admin->assignRole('admin');
    }
}