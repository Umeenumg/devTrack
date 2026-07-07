<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
// ─────────────────────────────────────────
// PUBLIC ROUTES — no token needed
// ─────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);


// ─────────────────────────────────────────
// PROTECTED ROUTES — token required
// ─────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

  // Auth
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/me',      [AuthController::class, 'me']);
  // Profile
  Route::put('/profile', [ProfileController::class, 'update']);
  Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

  // Teams
  Route::post('/teams', [TeamController::class, 'store']);
  Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
  // Projects
  Route::get('/projects',        [ProjectController::class, 'index']);
  Route::post('/projects',       [ProjectController::class, 'store']);
  Route::get('/projects/{id}',   [ProjectController::class, 'show']);
  Route::put('/projects/{id}',   [ProjectController::class, 'update']);
  Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

  // Tasks
  Route::get('/tasks',        [TaskController::class, 'index']);
  Route::post('/tasks',       [TaskController::class, 'store']);
  Route::get('/tasks/{id}',   [TaskController::class, 'show']);
  Route::put('/tasks/{id}',   [TaskController::class, 'update']);
  Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

  // Comments
  Route::get('/tasks/{taskId}/comments',    [CommentController::class, 'index']);
  Route::post('/tasks/{taskId}/comments',   [CommentController::class, 'store']);
  Route::delete('/comments/{id}',           [CommentController::class, 'destroy']);

  // Notifications
  Route::get('/notifications',            [NotificationController::class, 'index']);
  Route::put('/notifications/{id}/read',  [NotificationController::class, 'markRead']);
  Route::put('/notifications/read-all',   [NotificationController::class, 'markAll']);
});
// ─────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
  Route::get('/stats',             [AdminController::class, 'stats']);
  Route::get('/users',             [AdminController::class, 'users']);
  Route::get('/projects',          [AdminController::class, 'projects']);
  Route::get('/teams',             [AdminController::class, 'teams']);
  Route::put('/users/{id}/role',   [AdminController::class, 'updateUserRole']);
  Route::delete('/users/{id}',     [AdminController::class, 'deleteUser']);
});
