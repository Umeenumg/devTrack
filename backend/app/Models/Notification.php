<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'message',
        'is_read',
        'notifiable_id',
        'notifiable_type',
    ];

    // Notification belongs to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}  