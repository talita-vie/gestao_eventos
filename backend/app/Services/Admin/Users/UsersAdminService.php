<?php

namespace App\Services\Admin\Users;

use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class UsersAdminService
{
    public function indexUserAdmin()
    {
        $users = User::all();

        return $users;
    }

    public function createUserAdmin(array $data) 
    {
        if (User::where('email', $data['email'])->exists()) {
            throw new Exception('Esse email já está em uso no momento.');
        }

        if (User::where('cpf', $data['cpf'])->exists()) {
            throw new Exception('Esse cpf já está em uso no momento.');
        }

        $user = User::create($data);
        return $user;
    }

    public function updateUserAdmin(array $data, User $user)
    {
        $user->update($data);

        return $user;
    }

    public function deleteUserAdmin(User $user)
    {
        DB::transaction(function() use($user) {
            $timestamp = Carbon::now()->timestamp;

            $user->update([
                'name' => 'Usuário Excluido',
                'email' => 'deleted_' . $timestamp . '_' . $user->email,
                'phone' => null,
                'cpf' => null,
                'password' => bcrypt(str()->random(16))
            ]);
        });

        $user->tokens()->delete();
        $user->delete();

        return $user;
    }

    //Criar função para enviar email de verificação
    //Criar função de enviar link para resetar senha
}
        