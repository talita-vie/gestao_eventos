<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\EmailRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmailController extends Controller
{

    public function resend(EmailRequest $request) {
        $email = $request->validated();

        $user = User::where('email', $email)->first();
        

        if($user && !$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }

        return $this->sendResponse(null, 'Se email estiver cadastrado, um novo link de verificação foi enviado!');
    }

    public function verify(Request $request, string $id, string $hash) {
        $user = User::findOrFail($id);

        if(!$user) {
            return $this->sendError('Usuário não encontrado.', [], Response::HTTP_NOT_FOUND);
        }
        
        if(!$request->hasValidSignature()) {
            return $this->sendError('Link inválido ou já expirou. Reenvio o link.', [], Response::HTTP_FORBIDDEN);
        }

        if(!hash_equals((string) $hash, hash('sha256', $user->getEmailForVerification()))) {
            return $this->sendError('Link inválido ou corrompido.', [], Response::HTTP_FORBIDDEN);
        }

        if($user->hasVerifiedEmail()) {
            return $this->sendResponse(null, 'Este email já foi verificado. Pode fazer login');
        }

        $user->markEmailAsVerified();

        return $this->sendResponse(null, 'Conta verificada com sucesso! Bem-vindo ao sistema de eventos.');
    }
}
