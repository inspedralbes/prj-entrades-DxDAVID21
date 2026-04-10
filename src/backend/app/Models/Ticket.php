<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    protected $fillable = [
        'order_id',
        'session_seat_id',
        'qr_code'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function sessionSeat(): BelongsTo
    {
        return $this->belongsTo(SessionSeat::class, 'session_seat_id');
    }
}
