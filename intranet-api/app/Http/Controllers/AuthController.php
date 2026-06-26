<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Document;
use App\Models\Event;
use App\Models\News;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserCredentialsMail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validated = $request->validate([

            'name' => 'required|string|max:255',

            'apellido' => 'required|string|max:255',

            'rut' => 'required|string|unique:users,rut|max:20',

            'email' => 'required|email|unique:users,email',

            'password' => 'required|string|min:6',

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

            'estado_cuenta' => 'nullable|in:activo,inactivo,suspendido'
        ]);

        $fotoName = null;
        $path = null;

        if ($request->hasFile('foto_perfil')) {

            $foto = $request->file('foto_perfil');
            $fotoName = $foto->getClientOriginalName();

            $path = $foto->store(
                'profilephotos',
                'public'
            );
        }

        $user = User::create([

            'name' => $validated['name'],

            'apellido' => $validated['apellido'],

            'rut' => $validated['rut'],

            'email' => $validated['email'],

            'password' => bcrypt($validated['password']),

            'telefono' => $validated['telefono'] ?? null,

            'direccion' => $validated['direccion'] ?? null,

            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,

            'departamento' => $validated['departamento'] ?? null,

            'cargo' => $validated['cargo'] ?? null,

            'fecha_ingreso' => $validated['fecha_ingreso'] ?? now(),

            'contrato' => $validated['contrato'] ?? null,

            'foto_perfil' => $fotoName,

            'path_foto_perfil' => $path,

            'supervision_general' => $validated['supervision_general'] ?? null,

            'role' => $validated['role'],

            'estado_cuenta' => $validated['estado_cuenta'] ?? 'activo'
        ]);

        $user->assignRole($validated['role']);

        try {
            Mail::to($user->email)->send(new UserCredentialsMail($user, $validated['password']));
        } catch (\Exception $e) {
            Log::error("Failed to send user credentials email: " . $e->getMessage());
        }

        $token = $user->createToken(
            'auth_token'
        )->plainTextToken;

        return response()->json([

            'message' => 'Usuario creado correctamente',

            'token' => $token,

            'user' => $user,

            'roles' => $user->getRoleNames()

        ], 201);
    }
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
            'roles' => $user->getRoleNames()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesión cerrada'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }

    public function stats()
    {
        return response()->json([

            'documents' =>
                Document::count(),

            'events' =>
                Event::count(),

            'news' =>
                News::count(),

            'payrolls' =>
                Payroll::count()
        ]);
    }
}