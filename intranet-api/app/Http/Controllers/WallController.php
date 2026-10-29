<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\WallPost;
use App\Models\WallComment;
use App\Models\User;
use App\Mail\WallPostPublishedMail;
use App\Services\WallService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class WallController extends Controller
{
    protected $wallService;

    public function __construct(WallService $wallService)
    {
        $this->wallService = $wallService;
    }

    public function index(Request $request)
    {
        $contract = $request->user()->contrato;

        if (!$contract) {
            return response()->json([
                'message' => 'No perteneces a ningún contrato activo y no puedes ver el muro.'
            ], 403);
        }

        return response()->json(
            $this->wallService->getPostsForContract($contract)
        );
    }

    public function storePost(Request $request)
    {
        $user = $request->user();
        if (!$user->contrato) {
            return response()->json(['message' => 'No perteneces a ningún contrato activo.'], 403);
        }

        $validated = $request->validate([
            'contenido' => 'nullable|string',
            'imagen' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi,webm,ogg,ogv|max:51200',
            'imagenes' => 'nullable|array',
            'imagenes.*' => 'file|mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi,webm,ogg,ogv|max:51200',
        ]);

        $contenido = isset($validated['contenido']) ? trim($validated['contenido']) : '';
        $hasMedia = $request->hasFile('imagen') || $request->hasFile('imagenes');

        if ($contenido === '' && !$hasMedia) {
            return response()->json([
                'message' => 'Debes escribir un contenido o adjuntar al menos una fotografía o video.'
            ], 422);
        }

        $paths = [];
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $file) {
                $paths[] = $file->store('wallphotos', 'public');
            }
        } elseif ($request->hasFile('imagen')) {
            $paths[] = $request->file('imagen')->store('wallphotos', 'public');
        }

        $post = $this->wallService->createPost([
            'user_id' => $user->id,
            'contrato' => $user->contrato,
            'contenido' => $contenido,
            'path_imagen' => $paths[0] ?? null,
            'imagenes' => !empty($paths) ? $paths : null,
        ]);

        // Notificar por correo a los miembros del contrato y administradores (excepto al autor)
        try {
            $recipients = User::where('id', '!=', $user->id)
                ->where(function ($q) {
                    $q->whereNull('estado_cuenta')
                      ->orWhere('estado_cuenta', '!=', 'inactivo');
                })
                ->where(function ($q) use ($user) {
                    $q->where('contrato', $user->contrato)
                      ->orWhere('role', 'admin');
                })
                ->get();

            foreach ($recipients as $recipient) {
                if ($recipient->email) {
                    try {
                        Mail::to($recipient->email)->send(new WallPostPublishedMail($post, $user));
                    } catch (\Exception $e) {
                        Log::error("Error enviando notificación de publicación en Muro a {$recipient->email}: " . $e->getMessage());
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Error procesando destinatarios de correo para publicación en Muro: " . $e->getMessage());
        }

        return response()->json(
            $post->load(['user', 'comments.user', 'reactions.user']),
            201
        );
    }

    public function destroyPost(Request $request, $id)
    {
        $post = WallPost::findOrFail($id);
        $user = $request->user();

        if ($post->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'No tienes permiso para eliminar esta publicación.'], 403);
        }

        $this->wallService->deletePost($post);

        return response()->json([
            'message' => 'Publicación eliminada correctamente'
        ]);
    }

    public function storeComment(Request $request, $postId)
    {
        $post = WallPost::findOrFail($postId);
        $user = $request->user();

        if ($post->contrato !== $user->contrato) {
            return response()->json(['message' => 'No puedes comentar en el muro de otro contrato.'], 403);
        }

        $validated = $request->validate([
            'contenido' => 'required|string',
        ]);

        $comment = $this->wallService->createComment($post, [
            'user_id' => $user->id,
            'contenido' => $validated['contenido'],
        ]);

        return response()->json(
            $comment->load('user'),
            201
        );
    }

    public function destroyComment(Request $request, $id)
    {
        $comment = WallComment::findOrFail($id);
        $user = $request->user();

        if ($comment->user_id !== $user->id && $comment->post->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'No tienes permiso para eliminar este comentario.'], 403);
        }

        $this->wallService->deleteComment($comment);

        return response()->json([
            'message' => 'Comentario eliminado correctamente'
        ]);
    }

    public function react(Request $request, $postId)
    {
        $post = WallPost::findOrFail($postId);
        $user = $request->user();

        if ($post->contrato !== $user->contrato) {
            return response()->json(['message' => 'No puedes reaccionar en el muro de otro contrato.'], 403);
        }

        $validated = $request->validate([
            'tipo' => 'required|string|in:like,sorpresa,desaprobar',
        ]);

        $this->wallService->reactToPost($post, $user->id, $validated['tipo']);

        return response()->json(
            $post->load(['user', 'comments.user', 'reactions.user'])
        );
    }
}
