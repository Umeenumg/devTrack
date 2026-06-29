<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];


    // Team has many members
    public function members()
    {
        return $this->belongsToMany(User::class, 'team_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    // Team has many projects
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Team creator
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
