<?php

use App\Http\Controllers\Category\CategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', function() {
    return 'Ola Admin';
});

Route::resource('category', CategoryController::class);
Route::prefix('categories')->group(function() {
    Route::patch('/{id}/restore', [CategoryController::class, 'restoreCategory'])->name('restoreCategory');
    Route::get('/trashed', [CategoryController::class, 'DeletedCategory'])->name('DeletedCategory');
});