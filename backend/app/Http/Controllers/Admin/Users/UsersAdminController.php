<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\Admin\Users\UsersAdminService;
use Illuminate\Http\Request;

class UsersAdminController extends Controller
{

    public function __construct(protected UsersAdminService $usersAdminService)
    {
        
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $result = $this->usersAdminService->indexUserAdmin();
            return $this->sendResponse($result, 'Usuários encontrados com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RegisterRequest $request)
    {
        try {
            $data = $request->validated();
            $result = $this->usersAdminService->createUserAdmin($data);
            return $this->sendResponse($result, 'Usuário criado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        try {
            return $this->sendResponse($user, 'Usuário criado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RegisterRequest $request, User $user)
    {
        try {
            $data = $request->validated();
            $result = $this->usersAdminService->updateUserAdmin($data, $user);
            return $this->sendResponse($result, 'Usuário atualizado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $result = $this->usersAdminService->deleteUserAdmin($user);
            return $this->sendResponse($result, 'Usuário deletado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }
}
