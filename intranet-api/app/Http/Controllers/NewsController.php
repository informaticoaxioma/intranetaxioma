<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;

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
            'imagen' => 'nullable|string'
        ]);

        $news = $this->newsService->create($validated);

        return response()->json($news, 201);
    }

    public function show(News $news)
    {
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
            'imagen' => 'nullable|string'
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