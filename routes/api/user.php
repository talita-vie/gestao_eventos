<?php

use App\Http\Controllers\Address\AddressController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\User\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return User::all();
});

Route::get('/logout', [LogoutController::class, 'logout'])->name('logout');

Route::resource('events', EventController::class)->only(['index', 'show', 'store']);

Route::resource('address', AddressController::class)->except(['index']);
Route::prefix('addresses')->group(function() {
    Route::get('/me', [AddressController::class, 'myAddress'])->name('myAddress');
    Route::patch('/{id}/restore', [AddressController::class, 'restoreAddress'])->name('restoreAddress');
    Route::get('/trashed', [AddressController::class, 'myDeletedAddress'])->name('myDeletedAddress');
});

Route::prefix('profile')->group(function () {
    Route::get('/me', [UserController::class, 'show'])->name('profile.show');
    Route::put('/update-info', [UserController::class, 'updateInfo'])->name('profile.updateInfo');
    Route::put('/update-address', [UserController::class, 'updateAddress'])->name('profile.updateAddress');
    Route::delete('/delete', [UserController::class, 'destroy'])->name('profile.destroy');
});