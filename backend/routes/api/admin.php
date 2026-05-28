<?php

use App\Http\Controllers\Admin\Event\EventAdminController;
use App\Http\Controllers\Admin\Registration\RegistrationAdminController;
use App\Http\Controllers\Admin\Users\UsersAdminController;
use App\Http\Controllers\Category\CategoryController;
use Illuminate\Support\Facades\Route;

Route::apiResource('users', UsersAdminController::class);

Route::prefix('events')->group(function() {
    Route::get('/', [EventAdminController::class, 'index']);
    Route::patch('/{event}/moderate', [EventAdminController::class, 'moderateStatus']);
});


Route::apiResource('category', CategoryController::class)->except('index'); 
Route::prefix('categories')->group(function() {
    Route::patch('/{id}/restore', [CategoryController::class, 'restoreCategory'])->name('restoreCategory');
    Route::get('/trashed', [CategoryController::class, 'deletedCategory'])->name('deletedCategory');
});