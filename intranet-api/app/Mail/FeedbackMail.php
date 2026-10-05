<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FeedbackMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $senderName;
    public string $senderEmail;
    public string $senderDepartment;
    public string $feedbackMessage;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $senderName,
        string $senderEmail,
        string $senderDepartment,
        string $feedbackMessage
    ) {
        $this->senderName       = $senderName;
        $this->senderEmail      = $senderEmail;
        $this->senderDepartment = $senderDepartment;
        $this->feedbackMessage  = $feedbackMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nuevo Comentario/Recomendación - Intranet Axioma',
            replyTo: [
                new \Illuminate\Mail\Mailables\Address(
                    $this->senderEmail,
                    $this->senderName
                ),
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.feedback',
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
