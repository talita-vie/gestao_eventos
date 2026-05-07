<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function(Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('user', function(Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('organizer', function(Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('admin', function(Request $request) {
            return Limit::perMinute(90)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('send-email', function(Request $request) {
            $email = $request->input('email');
            return Limit::perMinute(1)->by($email ?: $request->ip());
        });

        RateLimiter::for('forgot-password', function(Request $request) {
            $email = $request->input('email');
            return Limit::perMinute(1)->by($email ?: $request->ip());
        });
    }
}
