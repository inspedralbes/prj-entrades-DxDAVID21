<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seat extends Model
{
    protected $fillable = [
        'room_id',
        'row_label',
        'number',
        'type',
        'price_modifier',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
