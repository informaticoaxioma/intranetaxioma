<?php

namespace App\Mail;

use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class TicketMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public TicketMessage $ticketMessage;
    public bool $isForSupport;

    /**
     * Create a new message instance.
     */
    public function __construct(Ticket $ticket, TicketMessage $ticketMessage, bool $isForSupport = false)
    {
        $this->ticket = $ticket;
        $this->ticketMessage = $ticketMessage;
        $this->isForSupport = $isForSupport;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $senderName = $this->ticketMessage->user
            ? trim($this->ticketMessage->user->name . ' ' . ($this->ticketMessage->user->apellido ?? ''))
            : 'Usuario';

        $subject = $this->isForSupport
            ? "[{$this->ticket->code}] Nuevo mensaje del colaborador ({$senderName}) en ticket: {$this->ticket->title}"
            : "[{$this->ticket->code}] Nueva respuesta del equipo de soporte en tu ticket: {$this->ticket->title}";

        $replyTo = [];
        if ($this->ticketMessage->user && $this->ticketMessage->user->email) {
            $replyTo[] = new Address(
                $this->ticketMessage->user->email,
                $senderName
            );
        }

        return new Envelope(
            subject: $subject,
            replyTo: $replyTo,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_message',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if ($this->ticketMessage->attachment_path && Storage::disk('public')->exists($this->ticketMessage->attachment_path)) {
            $extension = pathinfo($this->ticketMessage->attachment_path, PATHINFO_EXTENSION) ?: 'jpg';
            return [
                Attachment::fromStorageDisk('public', $this->ticketMessage->attachment_path)
                    ->as('adjunto_mensaje_' . $this->ticket->code . '.' . $extension),
            ];
        }

        return [];
    }
}
