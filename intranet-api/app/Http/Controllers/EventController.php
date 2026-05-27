<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\Request;

class EventController extends Controller
{
    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index()
    {
        return response()->json(
            $this->eventService->getAll()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'fecha' => 'required|date',
            'tipo' => 'required|string|max:255',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'ubicacion' => 'required|string|max:255',
            'descripcion' => 'required|string'
        ]);

        $event = $this->eventService->create($validated);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'fecha' => 'sometimes|date',
            'tipo' => 'sometimes|string|max:255',
            'hora_inicio' => 'sometimes',
            'hora_fin' => 'sometimes',
            'ubicacion' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string'
        ]);

        $updated = $this->eventService->update($event, $validated);

        return response()->json($updated);
    }

    public function destroy(Event $event)
    {
        $this->eventService->delete($event);

        return response()->json([
            'message' => 'Evento eliminado correctamente'
        ]);
    }
}