<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\AuthService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class RegisterController extends Controller
{
    public function create(RegisterRequest $request, AuthService $authService) {
        try {
            $data = $request->validated();
            $user = $authService->registerUser($data);
            return $this->sendResponse($user, 'Usuário criado com sucesso');
        } catch (ConflictHttpException $e){
            return $this->sendError($e->getMessage(), [], Response::HTTP_CONFLICT);
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
