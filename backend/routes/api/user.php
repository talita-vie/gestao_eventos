<?php

use App\Http\Controllers\Address\AddressController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Certificate\CertificateController;
use App\Http\Controllers\Event\EventController;
use App\Http\Controllers\Registration\RegistrationController;
use App\Http\Controllers\User\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/logout', [LogoutController::class, 'logout'])->name('logout');

Route::apiResource('events', EventController::class)->only(['index', 'show', 'store']);

Route::apiResource('address', AddressController::class)->except(['index', 'store']);
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

Route::apiResource('events.registrations', RegistrationController::class)
                                            ->except(['update', 'show'])
                                            ->shallow()
                                            ->withTrashed(['destroy']);

Route::prefix('certificate')->group(function() {
    Route::get('/me', [CertificateController::class, 'allCertificates'])->name('allCertificates');
    Route::get('/{certificate}/view', [CertificateController::class, 'viewCertificate'])->name('viewCertificate');
});