<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'team_id',
        'created_by',
        'status',
        'deadline',
    ];

    // Project belongs to a team
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    // Project has many tasks
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Project creator
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}