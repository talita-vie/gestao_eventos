<?php

namespace App\Services\Address;

use App\Models\Address;
use App\Models\User;

class AddressService
{
    
    public function myAddress(User $user) 
    {
        try {
            $user->load('events.address');
            $addresses_events = Address::whereHas('events', function($query) use($user) {
                $query->where('organizer_id', $user->id);
            })->get();

            return $addresses_events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myDeletedAddress(User $user) 
    {
        try {
            $user->load('events.address');
            $addresses_events = Address::whereHas('events', function($query) use($user) {
                $query->where('organizer_id', $user->id);
            })->onlyTrashed()->get();


            return $addresses_events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function StoreAddress(array $data) 
    {
        try {
            $cep = $data['street_zipcode'];
            $data['street_zipcode'] = substr($cep, 0, 5) . substr($cep, 6, 3);
            $address = Address::create($data);
            return $address;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function findAddress(string $id) 
    {
        try {
            $address = Address::findOrFail($id);

            $cep = $address->street_zipcode;
            $address->street_zipcode = substr($cep, 0, 5) . '-' . substr($cep, 5, 3);

            return $address;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateAddress(string $id, array $data) 
    {
        try {
            $cep = $data['street_zipcode'];
            $data['street_zipcode'] = substr($cep, 0, 5) . substr($cep, 6, 3);
            $address = Address::findOrFail($id);
            $address->update($data);

            return $address;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function deleteAddress(string $id) 
    {
        try {
            $address = Address::findOrFail($id);
            $address->delete();

            return $address;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function restoreAddress(string $id) 
    {
        try {
            $address = Address::withTrashed()->findOrFail($id);
            $address->restore();

            return $address;
            
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
        