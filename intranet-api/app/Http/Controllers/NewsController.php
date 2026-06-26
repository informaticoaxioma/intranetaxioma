<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewsPublishedMail;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index()
    {
        return response()->json(
            $this->newsService->getAll()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'resumen' => 'required|string',
            'texto_noticia' => 'required|string',
            'categoria' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'imagen' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);
        /*
        |--------------------------------------------------------------------------
        | FILE
        |--------------------------------------------------------------------------
        */

        $imagen = $request->file('imagen');
        $path = $imagen->store(
            'newsphotos',
            'public'
        );
        $news = News::create([
            'titulo' => $validated['titulo'],
            'resumen' => $validated['resumen'],
            'texto_noticia' => $validated['texto_noticia'],
            'categoria' => $validated['categoria'],
            'autor' => $validated['autor'],
            'imagen' => $imagen,
            'path_imagen' => $path,
            'fecha' => now()->toDateString(),
        ]);

        $users = User::all();
        foreach ($users as $user) {
            try {
                Mail::to($user->email)->send(new NewsPublishedMail($news));
            } catch (\Exception $e) {
                Log::error("Failed to send news notification email to {$user->email}: " . $e->getMessage());
            }
        }

        return response()->json([
            'message' =>'Noticia creada correctamente',
            'news' => $news
        ], 201);
    }

    public function show($id)
    {
        $news = News::findOrFail($id);

        return response()->json($news);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'resumen' => 'sometimes|string',
            'texto_noticia' => 'sometimes|string',
            'categoria' => 'sometimes|string|max:255',
            'autor' => 'sometimes|string|max:255',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $updated = $this->newsService->update($news, $validated);

        return response()->json($updated);
    }

    public function destroy(News $news)
    {
        $this->newsService->delete($news);

        return response()->json([
            'message' => 'Noticia eliminada correctamente'
        ]);
    }
}