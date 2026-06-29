<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['team', 'creator'])
            ->withCount('tasks')
            ->latest()
            ->get();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_id'     => 'required|exists:teams,id',
            'status'      => 'in:active,on_hold,completed',
            'deadline'    => 'nullable|date',
        ]);

        $project = Project::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return response()->json($project->load('team', 'creator'), 201);
    }

    public function show($id)
    {
        $project = Project::with(['team', 'creator', 'tasks.assignee'])
            ->findOrFail($id);

        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'in:active,on_hold,completed',
            'deadline'    => 'nullable|date',
        ]);

        $project->update($validated);

        return response()->json($project->load('team', 'creator'));
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }
}