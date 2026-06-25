<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\WallPost;
use App\Models\WallComment;
use App\Services\WallService;
use Illuminate\Http\Request;

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
            'contenido' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:4096',
        ]);

        $path = null;
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('wallphotos', 'public');
        }

        $post = $this->wallService->createPost([
            'user_id' => $user->id,
            'contrato' => $user->contrato,
            'contenido' => $validated['contenido'],
            'path_imagen' => $path,
        ]);

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
