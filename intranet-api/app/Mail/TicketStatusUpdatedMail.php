<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public string $oldStatus;
    public string $newStatus;
    public ?string $adminNotes;

    /**
     * Create a new message instance.
     */
    public function __construct(Ticket $ticket, string $oldStatus, string $newStatus, ?string $adminNotes = null)
    {
        $this->ticket = $ticket;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
        $this->adminNotes = $adminNotes;
    }

    /**
     * Helper to get a human-friendly status label.
     */
    public static function getStatusLabel(string $status): string
    {
        return match ($status) {
            'pendiente'  => 'Pendiente',
            'en_proceso' => 'En Proceso',
            'resuelto'   => 'Resuelto',
            'cerrado'    => 'Cerrado',
            default      => ucfirst(str_replace('_', ' ', $status)),
        };
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $statusLabel = self::getStatusLabel($this->newStatus);
        $subject = "[{$this->ticket->code}] Actualización de Estado: {$statusLabel} - {$this->ticket->title}";

        $replyTo = [];
        $supportEmail = config('mail.support_address', env('MAIL_SUPPORT_ADDRESS', 'soporte@axioma.cl'));
        if ($supportEmail) {
            $replyTo[] = new Address($supportEmail, 'Soporte Intranet Axioma');
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
            view: 'emails.ticket_status_updated',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
