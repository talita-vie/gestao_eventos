<?php

namespace App\Http\Middleware;

use App\Models\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExtendSanctumTokenLifeTime
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);

        if(auth('sanctum')->check()) {
            /**
             * @var PersonalAccessToken $token
             */
            $token = auth('sanctum')->user()->currentAccessToken();

            $expirationMinutes = config('sanctum.expiration', 60);

            $newExpirationMinutes = now()->addMinutes((int) $expirationMinutes);

            $token->update([
                'expires_at' => $newExpirationMinutes
            ]);

            $response->header('X-Token-Expires-At', $newExpirationMinutes->toIso8601String());

        }

        return $response;
    }
}
