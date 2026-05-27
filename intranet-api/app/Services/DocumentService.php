<?php

namespace App\Services;

use App\Models\Document;

class DocumentService
{
    public function getAll()
    {
        return Document::latest()->get();
    }

    public function create(array $data)
    {
        return Document::create($data);
    }

    public function update(Document $document, array $data)
    {
        $document->update($data);

        return $document;
    }

    public function delete(Document $document)
    {
        return $document->delete();
    }
}