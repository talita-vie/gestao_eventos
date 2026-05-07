<?php

use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Event\EventMediaController;
use App\Http\Controllers\Event\EventStatusController;
use Illuminate\Support\Facades\Route;

/*
/event/dashboard
*/

Route::apiResource('event', EventController::class)->only(['update', 'destroy']);
Route::prefix('events')->group(function() {
    Route::get('/me', [EventController::class, 'myEvents'])->name('myEvents');
    Route::get('/trashed', [EventController::class, 'myDeletedEvents'])->name('myDeletedEvents');
    Route::patch('/{event}/restore', [EventStatusController::class, 'restoreEvent'])->name('restoreEvent')->withTrashed();
    Route::patch('/{event}/publish', [EventStatusController::class, 'publishEvent'])->name('publishEvent');
    Route::patch('/{event}/paused', [EventStatusController::class, 'pausedEvent'])->name('pausedEvent');
    Route::patch('/{event}/canceled', [EventStatusController::class, 'canceledEvent'])->name('canceledEvent');
    Route::post('/{event}/banner', [EventMediaController::class, 'bannerEvent'])->name('bannerEvent');
    Route::delete('/{event}/banner-delete', [EventMediaController::class, 'bannerDeleteEvent'])->name('bannerDeleteEvent');
    
    Route::get('/{event}/participants', [EventStatusController::class, 'participantsEvent'])->name('participantsEvent');
    Route::patch('/{registration}/check-in', [EventStatusController::class, 'checkinParticipants'])->name('checkinParticipants');
    Route::patch('/{registration}/check-in/delete', [EventStatusController::class, 'deleteCheckinParticipants'])->name('deleteCheckinParticipants');
    Route::get('/{event}/finish', [EventStatusController::class, 'finishEvent'])->name('finishEvent');
});