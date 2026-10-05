<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\FeedbackMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
    /**
     * Recibe el formulario de comentarios/recomendaciones
     * y lo envía al correo del Comité Paritario.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'message'    => 'required|string|min:10|max:2000',
        ]);

        // Datos del usuario autenticado
        $user = $request->user();

        try {
            Mail::to('comiteparitario@axioma.cl')
                ->send(new FeedbackMail(
                    senderName:       $user->name . ' ' . $user->apellido,
                    senderEmail:      $user->email,
                    senderDepartment: $user->departamento ?? '',
                    feedbackMessage:  $validated['message'],
                ));
        } catch (\Exception $e) {
            Log::error('Error al enviar feedback del Comité Paritario: ' . $e->getMessage());
            return response()->json([
                'message' => 'Ocurrió un error al enviar tu mensaje. Por favor intenta más tarde.'
            ], 500);
        }

        return response()->json([
            'message' => '¡Tu mensaje fue enviado correctamente! El Comité Paritario lo revisará pronto.'
        ]);
    }
}
