<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LaborDocument;
use App\Services\LaborDocumentService;
use Illuminate\Http\Request;

class LaborDocumentController extends Controller
{
    protected $laborDocumentService;

    public function __construct(LaborDocumentService $laborDocumentService)
    {
        $this->laborDocumentService = $laborDocumentService;
    }

    /**
     * Display a listing of all labor documents.
     */
    public function index()
    {
        return response()->json(
            $this->laborDocumentService->getAll()
        );
    }

    /**
     * Display a listing of labor documents for the authenticated user.
     */
    public function myLaborDocuments(Request $request)
    {
        return response()->json(
            $this->laborDocumentService->getByUser(
                $request->user()->id
            )
        );
    }

    /**
     * Store a newly created labor document in storage.
     */
    public function store(Request $request)
    {
        if ($request->hasFile('archivo')) {

            dd([
                'nombre' => $request->file('archivo')->getClientOriginalName(),
                'size' => $request->file('archivo')->getSize(),
                'error' => $request->file('archivo')->getError(),
                'errorMessage' => $request->file('archivo')->getErrorMessage(),
            ]);

        } else {

            dd($request->all(), $request->file('archivo'));

        }
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tipo_documento' => 'required|string|max:255',
            'archivo' => 'required|file|max:10240',
            'fecha_emision' => 'nullable|date',
            'fecha_vencimiento' => 'nullable|date',
            'observaciones' => 'nullable|string'
        ]);

        $archivo = $request->file('archivo');
        $path = $archivo->store(
            'labor_documents',
            'public'
        );

        $validated['archivo'] = $archivo->getClientOriginalName();
        $validated['path'] = $path;

        $laborDocument = $this->laborDocumentService->create($validated);

        return response()->json([
            'message' => 'Documento laboral creado correctamente',
            'labor_document' => $laborDocument
        ], 201);
    }

    /**
     * Display the specified labor document.
     */
    public function show(LaborDocument $laborDocument)
    {
        return response()->json($laborDocument);
    }

    /**
     * Update the specified labor document in storage.
     */
    public function update(Request $request, LaborDocument $laborDocument)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tipo_documento' => 'required|string|max:255',
            'archivo' => 'nullable|file|max:10240',
            'fecha_emision' => 'nullable|date',
            'fecha_vencimiento' => 'nullable|date',
            'observaciones' => 'nullable|string'
        ]);

        $updateData = [
            'user_id' => $validated['user_id'],
            'tipo_documento' => $validated['tipo_documento'],
            'fecha_emision' => $validated['fecha_emision'] ?? null,
            'fecha_vencimiento' => $validated['fecha_vencimiento'] ?? null,
            'observaciones' => $validated['observaciones'] ?? null,
        ];

        if ($request->hasFile('archivo')) {
            $archivo = $request->file('archivo');
            $path = $archivo->store(
                'labor_documents',
                'public'
            );

            $updateData['archivo'] = $archivo->getClientOriginalName();
            $updateData['path'] = $path;
        }

        $updated = $this->laborDocumentService->update($laborDocument, $updateData);

        return response()->json([
            'message' => 'Documento laboral actualizado correctamente',
            'labor_document' => $updated
        ]);
    }

    /**
     * Remove the specified labor document from storage.
     */
    public function destroy(LaborDocument $laborDocument)
    {
        $this->laborDocumentService->delete($laborDocument);

        return response()->json([
            'message' => 'Documento laboral eliminado correctamente'
        ]);
    }

    /**
     * Preview the specified labor document.
     */
    public function preview(LaborDocument $laborDocument)
    {
        $filePath = storage_path(
            'app/public/' .
            $laborDocument->path
        );

        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->file(
            $filePath,
            [
                'Content-Type' => 'application/pdf'
            ]
        );
    }

    /**
     * Download the specified labor document.
     */
    public function download(LaborDocument $laborDocument)
    {
        return response()->download(
            storage_path(
                'app/public/' .
                $laborDocument->path
            ),
            $laborDocument->archivo
        );
    }
}
