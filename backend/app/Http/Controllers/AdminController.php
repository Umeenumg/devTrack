<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Global stats
    public function stats()
    {
        return response()->json([
            'total_users'    => User::count(),
            'total_teams'    => Team::count(),
            'total_projects' => Project::count(),
            'total_tasks'    => Task::count(),
            'tasks_done'     => Task::where('status', 'done')->count(),
            'tasks_progress' => Task::where('status', 'in_progress')->count(),
            'tasks_todo'     => Task::where('status', 'todo')->count(),
        ]);
    }

    // All users
    public function users()
    {
        $users = User::withCount(['tasks', 'projects'])
            ->latest()
            ->get();

        return response()->json($users);
    }

    // All projects
    public function projects()
    {
        $projects = Project::with(['team', 'creator'])
            ->withCount('tasks')
            ->latest()
            ->get();

        return response()->json($projects);
    }

    // All teams
    public function teams()
    {
        $teams = Team::with(['creator'])
            ->withCount('members')
            ->latest()
            ->get();

        return response()->json($teams);
    }

    // Update user role
    public function updateUserRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,member',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $validated['role']]);

        return response()->json($user);
    }

    // Delete user
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }
}