<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'assigned_to',
        'created_by',
        'status',
        'priority',
        'progress',
        'due_date',
    ];

    // Task belongs to a project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Task assigned to user
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Task created by user
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Task has many comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}