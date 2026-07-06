<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class MonthlyBirthdaysReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public Collection $birthdayUsers;
    public string $monthName;

    /**
     * Create a new message instance.
     *
     * @param Collection $birthdayUsers
     * @param string $monthName
     */
    public function __construct(Collection $birthdayUsers, string $monthName)
    {
        $this->birthdayUsers = $birthdayUsers;
        $this->monthName = $monthName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🎂 Cumpleaños de {$this->monthName} - ¡Acompáñanos a celebrar! 🎉",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.monthly_birthdays_reminder',
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
