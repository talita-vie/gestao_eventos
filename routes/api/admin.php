<?php

use App\Http\Controllers\Admin\Users\UsersAdminController;
use App\Http\Controllers\Category\CategoryController;
use Illuminate\Support\Facades\Route;

Route::apiResource('users', UsersAdminController::class);

Route::apiResource('category', CategoryController::class); 
Route::prefix('categories')->group(function() {
    Route::patch('/{id}/restore', [CategoryController::class, 'restoreCategory'])->name('restoreCategory');
    Route::get('/trashed', [CategoryController::class, 'DeletedCategory'])->name('DeletedCategory');
});