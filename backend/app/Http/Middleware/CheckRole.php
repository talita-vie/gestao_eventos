<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userRole = $request->user()->role->value;
        if(in_array($userRole, $roles)) {
            return $next($request);
        }

        return response()->json([
                    'message' => 'Acesso negado. Você não tem permissão para executar essa ação!'
                ], 403);
    }
}
