<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    public function logout(Request $request, AuthService $authService) {
        try {
            $authService->logoutUser($request->user());
            return $this->sendResponse(null, 'Usuário deslogado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro de logout: ', [$th->getMessage()]);
        }
    }
}
