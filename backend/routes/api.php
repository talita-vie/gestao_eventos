<?php

use App\Enums\UserRole;
use Illuminate\Support\Facades\Route;

Route::get('/user/{userRole}', function (UserRole $userRole) {
    return $userRole->value;
});

Route::middleware(['throttle:api', 'guest'])->group(function() {
    require __DIR__.'/api/guest.php';
});

Route::middleware(['auth:sanctum', 'extend-sanctum-token-life'])->group(function() {
    
    Route::middleware('throttle:user')->group(function() {
        require __DIR__.'/api/user.php';
    });

    Route::middleware(['throttle:organizer', 'role:admin,organizer'])->prefix('organizer')->group(function() {
        require __DIR__.'/api/organizer.php';
    });

    Route::middleware(['throttle:admin', 'role:admin'])->prefix('admin')->group(function() {
        require __DIR__.'/api/admin.php';
    });
});