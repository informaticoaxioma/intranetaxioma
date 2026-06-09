<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    public function index()
    {
        return response()->json(
            $this->documentService->getAll()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'archivo' => 'required|file|max:10240'
        ]);
        /*
        |--------------------------------------------------------------------------
        | FILE
        |--------------------------------------------------------------------------
        */
        $archivo = $request->file('archivo');
        $path = $archivo->store(
            'documents',
            'public'
        );
        $document = Document::create([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'categoria' => $validated['categoria'],
            'autor' => $validated['autor'],
            'archivo' => $archivo->getClientOriginalName(),
            'path' => $path,
            'tamano_archivo' => $archivo->getSize()
        ]);

        return response()->json([
            'message' =>'Documento creado correctamente',
            'document' => $document
        ], 201);
    }

    public function show(Document $document)
    {
        return response()->json($document);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'categoria' => 'sometimes|string|max:255',
            'autor' => 'sometimes|string|max:255',
            'tamano_archivo' => 'sometimes|integer',
            'ultima_modificacion' => 'nullable|date',
            'archivo' => 'sometimes|string'
        ]);

        $updated = $this->documentService->update($document, $validated);

        return response()->json($updated);
    }

    public function destroy(Document $document)
    {
        $this->documentService->delete($document);

        return response()->json([
            'message' => 'Documento eliminado correctamente'
        ]);

        
    }

    public function download(Document $document)
    {

        return response()->download(
            storage_path(
                'app/public/' .
                $document->path
            ),
            $document->archivo
        );
    }
}