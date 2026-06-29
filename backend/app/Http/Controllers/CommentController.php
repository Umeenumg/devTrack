<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Notification;
use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($taskId)
    {
        $comments = Comment::with('user')
            ->where('task_id', $taskId)
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $taskId)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $task = Task::findOrFail($taskId);

        $comment = Comment::create([
            'task_id' => $taskId,
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        // Notify task creator if different
        if ($task->created_by !== auth()->id()) {
            Notification::create([
                'user_id' => $task->created_by,
                'type'    => 'comment_added',
                'message' => auth()->user()->name . ' commented on: ' . $task->title,
            ]);
        }

        return response()->json($comment->load('user'), 201);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted.']);
    }
}