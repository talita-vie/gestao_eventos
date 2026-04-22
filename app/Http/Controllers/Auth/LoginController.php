<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class LoginController extends Controller
{
    public function login(LoginRequest $request, AuthService $authService) {
        try {
            $data = $request->validated();     
            $user = $authService->loginUser($data);
            return $this->sendResponse($user, 'Login realizado com sucesso');
        } catch(ConflictHttpException $e){
            return $this->sendError($e, [], Response::HTTP_CONFLICT);
        }catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
    }
}
