<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function __construct(
        private NewsService $newsService
    ) {}

    public function index()
    {
        return response()->json(
            $this->newsService->getAll()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $validated['user_id'] = auth()->id();

        return response()->json(
            $this->newsService->create($validated)
        );
    }

    public function show(News $news)
    {
        return response()->json($news);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        return response()->json(
            $this->newsService->update($news, $validated)
        );
    }

    public function destroy(News $news)
    {
        $this->newsService->delete($news);

        return response()->json([
            'message' => 'Noticia eliminada'
        ]);
    }
}