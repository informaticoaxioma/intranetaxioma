<?php

namespace App\Mail;

use App\Models\User;
use App\Models\WallPost;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WallPostPublishedMail extends Mailable
{
    use Queueable, SerializesModels;

    public WallPost $post;
    public User $author;

    /**
     * Create a new message instance.
     */
    public function __construct(WallPost $post, User $author)
    {
        $this->post = $post;
        $this->author = $author;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $authorName = trim($this->author->name . ' ' . ($this->author->apellido ?? ''));
        if (empty($authorName)) {
            $authorName = $this->author->email;
        }

        return new Envelope(
            subject: "Mira lo que el usuario {$authorName} publicó en el Muro",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.wall_post_published',
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
