<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Notification;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::with(['assignee', 'creator', 'project'])
            ->when($request->project_id, fn($q) => $q->where('project_id', $request->project_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id'  => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status'      => 'in:todo,in_progress,done',
            'priority'    => 'in:low,medium,high',
            'progress'    => 'integer|min:0|max:100',
            'due_date'    => 'nullable|date',
        ]);

        $task = Task::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        // Notify assigned user
        if ($task->assigned_to && $task->assigned_to !== auth()->id()) {
            Notification::create([
                'user_id' => $task->assigned_to,
                'type'    => 'task_assigned',
                'message' => 'You have been assigned to task: ' . $task->title,
            ]);
        }

        return response()->json($task->load('assignee', 'creator', 'project'), 201);
    }

    public function show($id)
    {
        $task = Task::with(['assignee', 'creator', 'project', 'comments.user'])
            ->findOrFail($id);

        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status'      => 'in:todo,in_progress,done',
            'priority'    => 'in:low,medium,high',
            'progress'    => 'integer|min:0|max:100',
            'due_date'    => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json($task->load('assignee', 'creator', 'project'));
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted.']);
    }
}