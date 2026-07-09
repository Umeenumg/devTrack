<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $team = Team::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        // Add creator as admin member
        $team->members()->attach(auth()->id(), ['role' => 'admin']);

        return response()->json($team->load('creator', 'members'), 201);
    }

    public function show($id)
    {
        $team = Team::with(['members', 'creator', 'projects'])
            ->findOrFail($id);
        return response()->json($team);
    }

    public function addMember(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role'    => 'in:admin,member',
        ]);

        $team = Team::findOrFail($id);

        // Check if already member
        if ($team->members()->where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['message' => 'User already in team.'], 422);
        }

        $team->members()->attach($validated['user_id'], [
            'role' => $validated['role'] ?? 'member'
        ]);

        return response()->json(['message' => 'Member added.']);
    }

    public function removeMember(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $team = Team::findOrFail($id);
        $team->members()->detach($validated['user_id']);

        return response()->json(['message' => 'Member removed.']);
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message' => 'Team deleted.']);
    }
}
