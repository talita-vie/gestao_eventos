<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisterController::class, 'create'])->name('register');
Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify'])->name('verification.verify');
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/email/resend-email', [VerifyEmailController::class, 'resend'])->name('resend.email')->middleware('throttle:send-email');
Route::post('/forgot-password', [PasswordController::class, 'sendResetLinkEmail'])->name('password.email')->middleware('throttle:forgot-password');
Route::post('/reset-password', [PasswordController::class, 'resetPassword'])->name('password.update');
