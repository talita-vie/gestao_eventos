<?php

namespace App\Http\Controllers\User;

use AddressInfo;
use App\Http\Controllers\Controller;
use App\Http\Requests\Address\AddressRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\User\DeleteAccountRequest;
use App\Services\User\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function __construct(protected UserService $userService)
    {
 
    }
    public function show(Request $request) 
    {
        try {
            $result = $this->userService->showUser($request->user());
            return $this->sendResponse($result, 'Usuário encontrado com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }

    }

    public function updateInfo(RegisterRequest $request) 
    {
        try {
            $data = $request->validated();
            $result = $this->userService->updateUserInfo($data, $request->user());
            return $this->sendResponse($result, 'Informações do usuário atualizadas com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function updateAddress(AddressRequest $request) 
    {
        try {
            $data = $request->validated();
            $result = $this->userService->updateUserAddress($data, $request->user());
            return $this->sendResponse($result, 'Endereço do usuário atualizado com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function destroy(DeleteAccountRequest $request) 
    {
        try {
            $result = $this->userService->deleteUser($request->user());
            return $this->sendResponse($result, 'Usuário deletado com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
