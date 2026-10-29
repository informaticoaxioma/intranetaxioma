<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class TicketCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public bool $isForSupport;

    /**
     * Create a new message instance.
     */
    public function __construct(Ticket $ticket, bool $isForSupport = false)
    {
        $this->ticket = $ticket;
        $this->isForSupport = $isForSupport;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->isForSupport
            ? "[{$this->ticket->code}] Nuevo ticket ingresado: {$this->ticket->title}"
            : "[{$this->ticket->code}] Confirmación de Ticket Asignado - Intranet Axioma";

        $replyTo = [];
        if ($this->ticket->user && $this->ticket->user->email) {
            $replyTo[] = new Address(
                $this->ticket->user->email,
                trim($this->ticket->user->name . ' ' . ($this->ticket->user->apellido ?? ''))
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
            view: 'emails.ticket_created',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if ($this->ticket->path_imagen && Storage::disk('public')->exists($this->ticket->path_imagen)) {
            $extension = pathinfo($this->ticket->path_imagen, PATHINFO_EXTENSION) ?: 'jpg';
            return [
                Attachment::fromStorageDisk('public', $this->ticket->path_imagen)
                    ->as('fotografia_' . $this->ticket->code . '.' . $extension),
            ];
        }

        return [];
    }
}
