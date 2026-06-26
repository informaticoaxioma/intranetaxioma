<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserCredentialsMail;
use App\Mail\PasswordChangedMail;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::with('roles')->get()
        );
    }

    public function show(
        Request $request,
        User $user
    )
    {
        return response()->json(
            $user->load('roles')
        );
    }

    public function store(Request $request)
    {
        try {
        $validated = $request->validate([

            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'rut' => 'required|string|unique:users,rut|max:20',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'departamento' => 'nullable|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'fecha_ingreso' => 'nullable|date',
            'supervision_general' => 'nullable|string|max:255',
            'role' => 'required|in:admin,user',
            'estado_cuenta' => 'required|in:activo,inactivo,suspendido'
        ]);

        /*
        |--------------------------------------------------------------------------
        | CREATE USER
        |--------------------------------------------------------------------------
        */

        $user = User::create([

            'name' => $validated['name'],

            'apellido' => $validated['apellido'],

            'rut' => $validated['rut'],

            'email' => $validated['email'],

            'password' => Hash::make(
                $validated['password']
            ),

            'telefono' => $validated['telefono'] ?? null,

            'direccion' => $validated['direccion'] ?? null,

            'fecha_nacimiento' =>
                $validated['fecha_nacimiento'] ?? null,

            'departamento' =>
                $validated['departamento'] ?? null,

            'cargo' =>
                $validated['cargo'] ?? null,

            'fecha_ingreso' =>
                $validated['fecha_ingreso'] ?? null,

            'supervision_general' =>
                $validated['supervision_general'] ?? null,

            'role' => $validated['role'],

            'estado_cuenta' =>
                $validated['estado_cuenta']
        ]);

        /*
        |--------------------------------------------------------------------------
        | ASSIGN ROLE
        |--------------------------------------------------------------------------
        */

        $user->assignRole(
            $validated['role']
        );

        try {
            Mail::to($user->email)->send(new UserCredentialsMail($user, $validated['password']));
        } catch (\Exception $e) {
            Log::error("Failed to send user credentials email: " . $e->getMessage());
        }

        return response()->json([

            'message' => 'Usuario creado correctamente',

            'user' => $user

        ], 201);
        }
        catch (\Exception $e) {

        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE USER
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        User $user
    ) {

        $validated = $request->validate([

            'name' => 'required|string|max:255',

            'apellido' => 'required|string|max:255',

            'rut' => 'required|string|unique:users,rut,' . $user->id . '|max:20',

            'email' =>
                'required|email|unique:users,email,' . $user->id,

            'password' => 'nullable|min:6',

            'telefono' => 'nullable|string|max:50',

            'direccion' => 'nullable|string|max:255',

            'fecha_nacimiento' => 'nullable|date',

            'departamento' => 'nullable|string|max:255',

            'cargo' => 'nullable|string|max:255',

            'fecha_ingreso' => 'nullable|date',

            'contrato' => 'nullable|string|max:255',

            'foto_perfil' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'supervision_general' => 'nullable|string|max:255',

            'role' => 'required|in:admin,user',

            'estado_cuenta' => 'required|in:activo,inactivo,suspendido'
        ]);

        /*
        |--------------------------------------------------------------------------
        | UPDATE USER
        |--------------------------------------------------------------------------
        */

        $fotoName = $user->foto_perfil;
        $path = $user->path_foto_perfil;

        if ($request->hasFile('foto_perfil')) {

            if ($user->path_foto_perfil) {
                Storage::disk('public')->delete($user->path_foto_perfil);
            }

            $foto = $request->file('foto_perfil');
            $fotoName = $foto->getClientOriginalName();
            $path = $foto->store('profilephotos', 'public');
        }

        $user->update([

            'name' => $validated['name'],

            'apellido' => $validated['apellido'],

            'rut' => $validated['rut'],

            'email' => $validated['email'],

            'telefono' => $validated['telefono'] ?? null,

            'direccion' => $validated['direccion'] ?? null,

            'fecha_nacimiento' =>
                $validated['fecha_nacimiento'] ?? null,

            'departamento' =>
                $validated['departamento'] ?? null,

            'cargo' =>
                $validated['cargo'] ?? null,

            'fecha_ingreso' =>
                $validated['fecha_ingreso'] ?? null,

            'contrato' => $validated['contrato'] ?? null,

            'foto_perfil' => $fotoName,

            'path_foto_perfil' => $path,

            'supervision_general' =>
                $validated['supervision_general'] ?? null,

            'role' => $validated['role'],

            'estado_cuenta' =>
                $validated['estado_cuenta']
        ]);

        /*
        |--------------------------------------------------------------------------
        | UPDATE PASSWORD
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['password'])) {

            $user->update([
                'password' => Hash::make(
                    $validated['password']
                )
            ]);

            try {
                Mail::to($user->email)->send(new PasswordChangedMail($user, $validated['password']));
            } catch (\Exception $e) {
                Log::error("Failed to send password changed email: " . $e->getMessage());
            }
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE ROLE
        |--------------------------------------------------------------------------
        */

        $user->syncRoles([
            $validated['role']
        ]);

        return response()->json([

            'message' => 'Usuario actualizado correctamente',

            'user' => $user
        ]);
    }
    

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado'
        ]);
    }
}