<?php

use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Event\EventMediaController;
use App\Http\Controllers\Event\EventStatusController;
use Illuminate\Support\Facades\Route;

Route::get('/', function() {
    return 'Olá Organizador';
});

/*
/event/dashboard
*/

Route::resource('event', EventController::class)->only(['update', 'destroy']);
Route::prefix('events')->group(function() {
    Route::get('/me', [EventController::class, 'myEvents'])->name('myEvents');
    Route::get('/trashed', [EventController::class, 'myDeletedEvents'])->name('myDeletedEvents');
    Route::patch('/{id}/restore', [EventStatusController::class, 'restoreEvent'])->name('restoreEvent');
    Route::patch('/{id}/publish', [EventStatusController::class, 'publishEvent'])->name('publishEvent');
    Route::patch('/{id}/paused', [EventStatusController::class, 'pausedEvent'])->name('pausedEvent');
    Route::patch('/{id}/canceled', [EventStatusController::class, 'canceledEvent'])->name('canceledEvent');
    //Essas 3 abaixo ainda não funcionam
    Route::post('/{id}/poster', [EventMediaController::class, 'posterEvent'])->name('posterEvent');
    Route::get('/{id}/participants', [EventStatusController::class, 'participantsEvent'])->name('participantsEvent');
    Route::post('/{id}/check-in', [EventStatusController::class, 'checkinEvent'])->name('checkinEvent');
});