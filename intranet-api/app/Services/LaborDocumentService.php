<?php

namespace App\Services;

use App\Models\LaborDocument;

class LaborDocumentService
{
    /**
     * Get all labor documents with their associated users.
     */
    public function getAll()
    {
        return LaborDocument::with('user')
            ->latest()
            ->get();
    }

    /**
     * Get labor documents for a specific user.
     */
    public function getByUser($userId)
    {
        return LaborDocument::where('user_id', $userId)
            ->latest()
            ->get();
    }

    /**
     * Create a new labor document.
     */
    public function create(array $data)
    {
        return LaborDocument::create($data);
    }

    /**
     * Update an existing labor document.
     */
    public function update(LaborDocument $laborDocument, array $data)
    {
        $laborDocument->update($data);

        return $laborDocument;
    }

    /**
     * Delete a labor document.
     */
    public function delete(LaborDocument $laborDocument)
    {
        return $laborDocument->delete();
    }
}
