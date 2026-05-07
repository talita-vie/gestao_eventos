<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\EmailRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\Auth\AuthService;

class PasswordController extends Controller
{
    public function __construct(protected AuthService $authService)
    {
    
    }
    public function sendResetLinkEmail(EmailRequest $request) {
        try {
            $email = $request->validated();
            $result = $this->authService->sendResetLinkEmail($email);
            return $this->sendResponse(null, 'Se email estiver cadastrado, um novo link de resetar senha foi enviado!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function resetPassword(ResetPasswordRequest $request) {
        try {
            $data = $request->validated();
            $result = $this->authService->resetPassword($data);
            return $this->sendResponse($result, 'Senha alterada com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
