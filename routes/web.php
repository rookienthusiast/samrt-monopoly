<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\GameController::class, 'dashboard'])
    ->name('dashboard');


Route::post('/game/room/create', [\App\Http\Controllers\GameController::class, 'createRoom']);
Route::post('/game/room/join', [\App\Http\Controllers\GameController::class, 'joinRoom']);
Route::post('/game/room/update', [\App\Http\Controllers\GameController::class, 'updateState']);
Route::get('/game/rooms', [\App\Http\Controllers\GameController::class, 'getRooms']);
Route::post('/game/room/delete', [\App\Http\Controllers\GameController::class, 'deleteRoom']);
Route::post('/game/rooms/delete-all', [\App\Http\Controllers\GameController::class, 'deleteAllRooms']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
