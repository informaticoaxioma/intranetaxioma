<?php

namespace App\Services;

use App\Models\WallPost;
use App\Models\WallComment;
use App\Models\WallReaction;
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
        return WallPost::create($data);
    }

    public function deletePost(WallPost $post)
    {
        if ($post->path_imagen) {
            Storage::disk('public')->delete($post->path_imagen);
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
