<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
     use HasApiTokens, HasFactory, Notifiable;
 
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];


       protected $casts = [
        'password' => 'hashed',
    ];
   
   
      // User belongs to many teams
    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    // Tasks assigned to user
    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // Projects created by user
    public function projects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    // User notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // User comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

}
