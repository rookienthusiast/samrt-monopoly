<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameRoom extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'players' => 'array',
        'board_state' => 'array',
        'logs' => 'array',
    ];
    //
}
