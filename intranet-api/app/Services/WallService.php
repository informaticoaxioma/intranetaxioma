<?php

namespace App\Services;

use App\Models\WallPost;
use App\Models\WallComment;
use App\Models\WallReaction;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class WallService
{
    public function getPostsForContract(string $contract)
    {
        return WallPost::with(['user', 'comments.user', 'reactions.user'])
            ->where('contrato', $contract)
            ->latest()
            ->get();
    }

    public function createPost(array $data)
    {
        if ( array_key_exists('imagenes', $data) && !Schema::hasColumn('wall_posts', 'imagenes') ) {
            if (!empty($data['imagenes'])) {
                $data['imagen'] = json_encode($data['imagenes']);
            }
            unset($data['imagenes']);
        }

        return WallPost::create($data);
    }

    public function deletePost(WallPost $post)
    {
        $pathsToDelete = [];

        if (!empty($post->imagenes) && is_array($post->imagenes)) {
            $pathsToDelete = array_merge($pathsToDelete, $post->imagenes);
        } elseif (!empty($post->imagen) && is_string($post->imagen) && str_starts_with(trim($post->imagen), '[')) {
            $decoded = json_decode($post->imagen, true);
            if (is_array($decoded)) {
                $pathsToDelete = array_merge($pathsToDelete, $decoded);
            }
        }

        if ($post->path_imagen && !in_array($post->path_imagen, $pathsToDelete, true)) {
            $pathsToDelete[] = $post->path_imagen;
        }

        foreach ($pathsToDelete as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }

        return $post->delete();
    }

    public function createComment(WallPost $post, array $data)
    {
        return $post->comments()->create($data);
    }

    public function deleteComment(WallComment $comment)
    {
        return $comment->delete();
    }

    public function reactToPost(WallPost $post, int $userId, string $type)
    {
        $existingReaction = $post->reactions()->where('user_id', $userId)->first();

        if ($existingReaction) {
            if ($existingReaction->tipo === $type) {
                // Toggle off
                $existingReaction->delete();
                return ['status' => 'removed', 'reaction' => null];
            } else {
                // Update type
                $existingReaction->update(['tipo' => $type]);
                return ['status' => 'updated', 'reaction' => $existingReaction];
            }
        } else {
            // Create new reaction
            $newReaction = $post->reactions()->create([
                'user_id' => $userId,
                'tipo' => $type,
            ]);
            return ['status' => 'created', 'reaction' => $newReaction];
        }
    }
}
