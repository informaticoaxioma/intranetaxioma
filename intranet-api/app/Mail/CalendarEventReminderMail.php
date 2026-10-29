<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CalendarEventReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $events;
    public string $date;
    public bool $isToday;

    /**
     * Create a new message instance.
     */
    public function __construct($events, string $date, bool $isToday = false)
    {
        $this->events = $events;
        $this->date = $date;
        $this->isToday = $isToday;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $dayWord = $this->isToday ? 'hoy' : 'mañana';
        return new Envelope(
            subject: "Recordatorio: Eventos programados para {$dayWord} ({$this->date})",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.calendar_event_reminder',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
