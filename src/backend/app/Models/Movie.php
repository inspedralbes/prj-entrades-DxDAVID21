<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'description',
        'poster_url',
        'duration',
        'genre',
        'release_date',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(MovieSession::class);
    }
}
