<?php

namespace App\Services;

use App\Models\News;

class NewsService
{
    public function getAll()
    {
        return News::latest()->get();
    }

    public function create(array $data)
    {
        return News::create($data);
    }

    public function update(News $news, array $data)
    {
        $news->update($data);

        return $news;
    }

    public function delete(News $news)
    {
        return $news->delete();
    }
}