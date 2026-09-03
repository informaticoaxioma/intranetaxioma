<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\PasswordChangedMail;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | STEP 1 - SEND RESET LINK
    |--------------------------------------------------------------------------
    | Validates the email, generates a secure token, stores it in the
    | password_reset_tokens table and sends the reset link via email.
    */

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Always return success to avoid user enumeration attacks
        if (!$user) {
            return response()->json([
                'message' => 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.'
            ]);
        }

        // Delete any previous tokens for this email
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Generate a secure random token
        $token = Str::random(64);

        // Store the token (hashed) in the database
        DB::table('password_reset_tokens')->insert([
            'email'      => $request->email,
            'token'      => Hash::make($token),
            'created_at' => Carbon::now(),
        ]);

        // Build the frontend reset URL
        $frontendUrl = config('app.url');
        $resetUrl = $frontendUrl . '/auth/reset-password?token=' . $token . '&email=' . urlencode($request->email);

        // Send the email
        try {
            Mail::to($user->email)->send(new PasswordResetMail($resetUrl, $user->name));
        } catch (\Exception $e) {
            Log::error('Failed to send password reset email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al enviar el correo. Por favor intenta más tarde o contacta al administrador.'
            ], 500);
        }

        return response()->json([
            'message' => 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | STEP 2 - RESET PASSWORD
    |--------------------------------------------------------------------------
    | Validates the token, updates the user's password and sends a
    | confirmation email with the new credentials.
    */

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        // Find the reset record
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        // Validate token existence and expiry (60 minutes)
        if (!$resetRecord) {
            return response()->json([
                'message' => 'El token de recuperación no es válido o ha expirado.'
            ], 422);
        }

        $tokenAge = Carbon::parse($resetRecord->created_at)->diffInMinutes(Carbon::now());
        if ($tokenAge > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'El enlace de recuperación ha expirado. Por favor solicita uno nuevo.'
            ], 422);
        }

        // Verify the token matches
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'El token de recuperación no es válido o ha expirado.'
            ], 422);
        }

        // Find the user
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'No se encontró una cuenta asociada a este correo.'
            ], 404);
        }

        // Update the password
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Delete the used token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Send confirmation email
        try {
            Mail::to($user->email)->send(new PasswordChangedMail($user, $request->password));
        } catch (\Exception $e) {
            Log::error('Failed to send password changed confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.'
        ]);
    }
}
