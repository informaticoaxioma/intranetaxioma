<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\TicketCreatedMail;
use App\Mail\TicketStatusUpdatedMail;
use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TicketController extends Controller
{
    /**
     * Listar todos los tickets (Admin) con filtros y búsqueda.
     */
    public function index(Request $request)
    {
        if (!$request->user()->canAccessTicketera()) {
            return response()->json([
                'message' => 'Acceso denegado. Solo los administradores del departamento de tecnología pueden acceder a la gestión de tickets.'
            ], 403);
        }

        $currentUserId = $request->user()->id;

        $query = Ticket::with([
            'user:id,name,apellido,email,departamento,foto_perfil,path_foto_perfil',
            'assignedUser:id,name,apellido,email,departamento,cargo,foto_perfil,path_foto_perfil'
        ])->withCount([
            'messages',
            'messages as unread_messages_count' => function ($q) use ($currentUserId) {
                // Para admin: mensajes recibidos del colaborador que no hayan sido leídos
                $q->where('user_id', '!=', $currentUserId)
                  ->where('is_admin_reply', false)
                  ->whereNull('read_at');
            }
        ]);

        // Filtro por Estado
        if ($request->filled('status') && $request->status !== 'todos') {
            $query->where('status', $request->status);
        }

        // Filtro por Prioridad
        if ($request->filled('priority') && $request->priority !== 'todas') {
            $query->where('priority', $request->priority);
        }

        // Filtro por Categoría
        if ($request->filled('category') && $request->category !== 'todas') {
            $query->where('category', $request->category);
        }

        // Filtro por Responsable
        if ($request->filled('assigned_to') && $request->assigned_to !== 'todos') {
            if ($request->assigned_to === 'sin_asignar' || $request->assigned_to === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $request->assigned_to);
            }
        }

        // Búsqueda libre
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('apellido', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $tickets = $query->orderByDesc('created_at')->get();

        return response()->json($tickets);
    }

    /**
     * Resumen estadístico de tickets para KPIs de admin.
     */
    public function stats(Request $request)
    {
        if (!$request->user()->canAccessTicketera()) {
            return response()->json([
                'message' => 'Acceso denegado. Solo los administradores del departamento de tecnología pueden acceder a las estadísticas de la ticketera.'
            ], 403);
        }

        $currentUserId = $request->user()->id;

        return response()->json([
            'total'               => Ticket::count(),
            'pendientes'          => Ticket::where('status', 'pendiente')->count(),
            'en_proceso'          => Ticket::where('status', 'en_proceso')->count(),
            'resueltos'           => Ticket::whereIn('status', ['resuelto', 'cerrado'])->count(),
            'urgentes'            => Ticket::where('priority', 'urgente')->whereIn('status', ['pendiente', 'en_proceso'])->count(),
            'con_mensajes_nuevos' => Ticket::whereHas('messages', function ($q) use ($currentUserId) {
                $q->where('user_id', '!=', $currentUserId)
                  ->where('is_admin_reply', false)
                  ->whereNull('read_at');
            })->count(),
        ]);
    }

    /**
     * Listar tickets del usuario autenticado.
     */
    public function myTickets(Request $request)
    {
        $currentUserId = $request->user()->id;

        $tickets = Ticket::with(['assignedUser:id,name,apellido,email,departamento,cargo,foto_perfil,path_foto_perfil'])
            ->withCount([
                'messages',
                'messages as unread_messages_count' => function ($q) use ($currentUserId) {
                    // Para el solicitante: mensajes recibidos (no escritos por él) que no ha leído
                    $q->where('user_id', '!=', $currentUserId)->whereNull('read_at');
                }
            ])
            ->where('user_id', $currentUserId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($tickets);
    }

    /**
     * Crear un nuevo ticket (Cualquier usuario autenticado).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|min:4|max:200',
            'category'    => 'required|string|max:100',
            'priority'    => 'required|in:baja,media,alta,urgente',
            'description' => 'required|string|min:10|max:5000',
            'imagen'      => 'nullable|file|image|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $user = $request->user();

        $path = null;
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('ticketphotos', 'public');
        }

        $ticket = Ticket::create([
            'user_id'     => $user->id,
            'title'       => $validated['title'],
            'category'    => $validated['category'],
            'priority'    => $validated['priority'],
            'description' => $validated['description'],
            'path_imagen' => $path,
            'status'      => 'pendiente',
            'assigned_to' => $validated['assigned_to'] ?? null,
        ]);

        $ticket->load([
            'user',
            'assignedUser:id,name,apellido,email,departamento,cargo,foto_perfil,path_foto_perfil'
        ]);

        // Envío de correo de confirmación al usuario
        try {
            if ($user->email) {
                Mail::to($user->email)->send(new TicketCreatedMail($ticket, false));
            }
        } catch (\Exception $e) {
            Log::error('Error enviando correo de confirmación de ticket al usuario: ' . $e->getMessage(), [
                'ticket_id' => $ticket->id,
                'user_id'   => $user->id,
            ]);
        }

        // Envío de copia/alerta a la casilla de soporte
        try {
            $supportEmail = config('mail.support_address', env('MAIL_SUPPORT_ADDRESS', 'soporte@axioma.cl'));
            if ($supportEmail && $supportEmail !== $user->email) {
                Mail::to($supportEmail)->send(new TicketCreatedMail($ticket, true));
            }
        } catch (\Exception $e) {
            Log::error('Error enviando notificación de ticket a casilla de soporte: ' . $e->getMessage(), [
                'ticket_id' => $ticket->id,
            ]);
        }

        return response()->json([
            'message' => "Ticket {$ticket->code} creado exitosamente. Se ha enviado un correo con la confirmación y se le atenderá durante el día.",
            'ticket'  => $ticket,
        ], 201);
    }

    /**
     * Ver un ticket específico.
     */
    public function show(Request $request, $id)
    {
        $ticket = Ticket::with([
            'user:id,name,apellido,email,departamento,foto_perfil,path_foto_perfil',
            'assignedUser:id,name,apellido,email,departamento,cargo,foto_perfil,path_foto_perfil'
        ])->findOrFail($id);

        $currentUser = $request->user();
        if (!$currentUser->canAccessTicketera() && $ticket->user_id !== $currentUser->id) {
            return response()->json(['message' => 'Acceso denegado. No autorizado para ver este ticket.'], 403);
        }

        return response()->json($ticket);
    }

    /**
     * Actualizar estado, notas o asignación de un ticket (Admin de Tecnología).
     */
    public function update(Request $request, $id)
    {
        if (!$request->user()->canAccessTicketera()) {
            return response()->json([
                'message' => 'Acceso denegado. Solo los administradores del departamento de tecnología pueden gestionar tickets.'
            ], 403);
        }

        $ticket = Ticket::findOrFail($id);

        $validated = $request->validate([
            'status'      => 'sometimes|in:pendiente,en_proceso,resuelto,cerrado',
            'priority'    => 'sometimes|in:baja,media,alta,urgente',
            'admin_notes' => 'nullable|string|max:5000',
            'assigned_to' => 'nullable',
        ]);

        $oldStatus = $ticket->status;
        $statusChanged = false;

        if (isset($validated['status'])) {
            if ($ticket->status !== $validated['status']) {
                $statusChanged = true;
            }
            $ticket->status = $validated['status'];
            if (in_array($validated['status'], ['resuelto', 'cerrado']) && !$ticket->resolved_at) {
                $ticket->resolved_at = now();
            } elseif ($validated['status'] === 'pendiente' || $validated['status'] === 'en_proceso') {
                $ticket->resolved_at = null;
            }
        }

        if (isset($validated['priority'])) {
            $ticket->priority = $validated['priority'];
        }

        if (array_key_exists('admin_notes', $validated)) {
            $ticket->admin_notes = $validated['admin_notes'];
        }

        if (array_key_exists('assigned_to', $validated)) {
            $val = $validated['assigned_to'];
            $ticket->assigned_to = (!empty($val) && $val !== 'sin_asignar' && is_numeric($val)) ? (int)$val : null;
        }

        $ticket->save();
        $ticket->load([
            'user:id,name,apellido,email,departamento,foto_perfil,path_foto_perfil',
            'assignedUser:id,name,apellido,email,departamento,cargo,foto_perfil,path_foto_perfil'
        ]);

        // Si cambió el estado, enviar correo de actualización de avance al solicitante
        if ($statusChanged && $ticket->user && $ticket->user->email) {
            try {
                Mail::to($ticket->user->email)->send(
                    new TicketStatusUpdatedMail($ticket, $oldStatus, $ticket->status, $ticket->admin_notes)
                );
            } catch (\Exception $e) {
                Log::error('Error enviando correo de actualización de estado de ticket: ' . $e->getMessage(), [
                    'ticket_id'  => $ticket->id,
                    'user_id'    => $ticket->user->id,
                    'old_status' => $oldStatus,
                    'new_status' => $ticket->status,
                ]);
            }
        }

        return response()->json([
            'message' => 'Ticket actualizado correctamente.',
            'ticket'  => $ticket,
        ]);
    }

    /**
     * Listar los mensajes de seguimiento / chat de un ticket.
     */
    public function getMessages(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $currentUser = $request->user();
        $isTechAdmin = $currentUser->canAccessTicketera();

        if (!$isTechAdmin && $ticket->user_id !== $currentUser->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Marcar como leídos todos los mensajes recibidos (no escritos por el usuario actual)
        $ticket->messages()
            ->where('user_id', '!=', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $ticket->messages()
            ->with('user:id,name,apellido,email,foto_perfil,path_foto_perfil,role')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Marcar explícitamente mensajes como leídos.
     */
    public function markMessagesAsRead(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $currentUser = $request->user();
        $isTechAdmin = $currentUser->canAccessTicketera();

        if (!$isTechAdmin && $ticket->user_id !== $currentUser->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Marcar como leídos todos los mensajes recibidos (no escritos por el usuario actual)
        $ticket->messages()
            ->where('user_id', '!=', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Mensajes marcados como leídos.',
            'unread_messages_count' => 0,
        ]);
    }

    /**
     * Registrar un nuevo mensaje u observación en el ticket.
     */
    public function storeMessage(Request $request, $id)
    {
        $ticket = Ticket::with('user')->findOrFail($id);
        $currentUser = $request->user();
        $isTechAdmin = $currentUser->canAccessTicketera();

        if (!$isTechAdmin && $ticket->user_id !== $currentUser->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'message'    => 'required|string|min:1|max:5000',
            'attachment' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('ticket_attachments', 'public');
        }

        // Si el usuario actual es el creador del ticket, actúa como solicitante (is_admin_reply = false).
        // Si no es el creador y tiene permisos de administración tech, responde como soporte (is_admin_reply = true).
        $isAdmin = $isTechAdmin && ($ticket->user_id !== $currentUser->id);

        $ticketMessage = $ticket->messages()->create([
            'user_id'         => $currentUser->id,
            'message'         => $validated['message'],
            'attachment_path' => $attachmentPath,
            'is_admin_reply'  => $isAdmin,
        ]);

        $ticket->touch();

        $ticketMessage->load('user:id,name,apellido,email,foto_perfil,path_foto_perfil,role');

        // Notificación por correo
        try {
            if ($isAdmin) {
                // Notificar al solicitante
                if ($ticket->user && $ticket->user->email) {
                    Mail::to($ticket->user->email)->send(new \App\Mail\TicketMessageMail($ticket, $ticketMessage, false));
                }
            } else {
                // Notificar a la casilla de soporte / admin
                $supportEmail = config('mail.support_address', env('MAIL_SUPPORT_ADDRESS', 'soporte@axioma.cl'));
                if ($supportEmail && $supportEmail !== $currentUser->email) {
                    Mail::to($supportEmail)->send(new \App\Mail\TicketMessageMail($ticket, $ticketMessage, true));
                }
            }
        } catch (\Exception $e) {
            Log::error('Error enviando notificación de mensaje de ticket: ' . $e->getMessage(), [
                'ticket_id'  => $ticket->id,
                'message_id' => $ticketMessage->id,
            ]);
        }

        return response()->json([
            'message'        => 'Mensaje enviado correctamente.',
            'ticket_message' => $ticketMessage,
        ], 201);
    }

    /**
     * Listar usuarios del departamento de tecnología para asignar como responsables.
     */
    public function techUsers(Request $request)
    {
        $users = \App\Models\User::select('id', 'name', 'apellido', 'email', 'departamento', 'cargo', 'foto_perfil', 'path_foto_perfil')
            ->orderBy('name')
            ->get()
            ->filter(fn($u) => $u->isTechDepartment())
            ->values();

        return response()->json($users);
    }
}
