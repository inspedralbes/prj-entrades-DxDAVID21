<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionSeat extends Model
{

    protected $table = "sessions_seats";
    protected $fillable = [
        'session_id',
        'seat_id',
        'status',
        'blocked_by',
        'blocked_at',
        'lock_expires_at',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(MovieSession::class, 'session_id');
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    public function ticket()
    {
        return $this->hasOne(Ticket::class, 'session_seat_id');
    }
}
