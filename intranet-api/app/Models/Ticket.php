<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'user_id',
        'title',
        'category',
        'priority',
        'status',
        'description',
        'path_imagen',
        'admin_notes',
        'assigned_to',
        'resolved_at',
    ];

    protected $appends = ['imagen_url'];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function getImagenUrlAttribute(): ?string
    {
        if (!$this->path_imagen) {
            return null;
        }

        return asset('storage/' . $this->path_imagen);
    }

    protected static function booted(): void
    {
        static::created(function (Ticket $ticket) {
            if (empty($ticket->code)) {
                $ticket->code = 'AXM-' . str_pad((string) $ticket->id, 4, '0', STR_PAD_LEFT);
                $ticket->saveQuietly();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class)->orderBy('created_at', 'asc');
    }
}
