<?php

namespace App\Services\Auth;

use App\Models\PersonalAccessToken;
use App\Models\User;
use ErrorException;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class AuthService
{

    public function registerUser(array $data) {
        $data['password'] = Hash::make($data['password']);

        $verifiedUser = User::where('email', $data['email'])->whereNotNull('email_verified_at')->first();
        if($verifiedUser) {
            throw new ConflictHttpException('Credenciais inválidas');
        }

        $verifiedUserCpf = User::where('cpf', $data['cpf'])->whereNotNull('email_verified_at')->first();
        if($verifiedUserCpf) {
            throw new ConflictHttpException('Credenciais inválidas');
        }

        $userExists = User::where('email', $data['email'])
                        ->orWhere('cpf', $data['cpf'])
                        ->first();
        
        DB::beginTransaction();
            try {
                if($userExists) {
                    $this->checkVerificationUser($userExists);

                    throw new ConflictHttpException('Credenciais inválidas');
                }

                $user = User::create($data);

                $user->sendEmailVerificationNotification();

                $sucess['message'] = 'Usuário criado com sucesso!';
                $sucess['user'] = $user;

            DB::commit();
            return $sucess;

            } catch (Throwable $th) {
                DB::rollBack();
                throw $th;
            }
        
    }

    public function loginUser(array $data) {
        $user = User::where('email', $data['email'])->first();

        if(!$user || !Hash::check($data['password'], $user->password)) {
            throw new AccessDeniedHttpException('Email ou Senha inválidos!');
        }

        $this->checkVerificationUser($user);

        $sucess['token'] = $user->createToken('auth_token')->plainTextToken;
        $sucess['user'] = $user;

        return $sucess;

    }

    /**
     * Summary of logoutUser
     * @param User $user
     * @return void
     */
    public function logoutUser(User $user) {
        /** @var PersonalAccessToken $token */
        $token = $user->currentAccessToken();

        $token->delete();
    }

    public function sendResetLinkEmail(array $data) {
        $status = Password::sendResetLink($data);

        if ($status !== Password::ResetLinkSent) {
            throw new ErrorException('Se email estiver cadastrado, um novo link de resetar senha foi enviado!');
        }
        
        return response()->json([
            'message' => __($status)
        ], 200);

    }

    public function resetPassword(array $data) {
        DB::beginTransaction();
            $status = Password::reset(
                $data,
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();
                    $user->tokens()->delete();
                    
                    event(new PasswordReset($user));
                }
            );
            
        if ($status == Password::PasswordReset) {
            DB::commit();
            return response()->json([
                'message' => __($status)
            ]);
        }

        DB::rollBack();
        throw new Exception(429, __($status));
            
    }

    private function checkVerificationUser(User $user) {
        if(!$user->hasVerifiedEmail()) {
             throw new AccessDeniedHttpException('Acesso negado. Por favor, verifique o seu email para acessar o sistema.');
        }
    }
}
        