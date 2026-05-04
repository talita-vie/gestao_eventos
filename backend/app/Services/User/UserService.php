<?php

namespace App\Services\User;

use App\Models\Address;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function showUser(User $user)
    {
        $user->load('address');
        return $user;
    }

    public function updateUserInfo(array $data, User $user)
    {
        $user->update($data);

        return $user;
    }

    public function updateUserAddress(array $data, User $user)
    {
        DB::transaction(function() use($data, $user) {
            $data['street_zipcode'] = substr($data['street_zipcode'], 0, 5) . substr($data['street_zipcode'], 6, 3);
            
            $newAddress = Address::create($data);

            $addressOldId = $user->address_id;

            $user->update([
                'address_id' => $newAddress->id
            ]);

            if ($addressOldId) {
                $residents = User::where('address_id', $addressOldId)->count();
                //nesse caso, talvez fosse bom apagar de vez
                if($residents === 0) {
                    Address::findOrFail($addressOldId)->delete();
                }
            }
        });
        $user->load('address');
        return $user;
    }

    public function deleteUser(User $user) 
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
}
        