<?php

namespace App\Services\Event;

use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Event;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class EventService
{
    public function index(User $user) {
        try {
            $events = Event::published()->where('organizer_id', '!=', $user['id'])
                            ->with('address')
                            ->paginate(10);

            if($events->count() === 0) {
                throw new Exception('No momento não há eventos disponíveis.');
            }
            
            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myEvents(User $user) {
        try {
            $events = Event::with('address')->where('organizer_id', $user->id)->get();
            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myDeletedEvents(User $user) {
        try {
            $events = Event::onlyTrashed()
                            ->where('organizer_id', $user->id)
                            ->get();
            
            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function eventStore(array $dataEvent, array $dataAddress, User $user) 
    {
        return DB::Transaction(function() use($dataEvent, $dataAddress, $user) {
            if($user->role->value !== UserRole::ADMIN->value) {
                $user->update([
                    'role' => UserRole::ORGANIZER->value
                ]);
            }

            $dataEvent['organizer_id'] = $user->id;
            $cep = $dataAddress['street_zipcode'];
            $dataAddress['street_zipcode'] = substr($cep, 0, 5) . substr($cep, 6, 3);
            $address = Address::create($dataAddress);

            $dataEvent['address_id'] = $address->id;

            $event = Event::create($dataEvent);

            return $event->load('address');
        });

    }

    public function findEvent(string $id) {
        try {
            $event = Event::findOrFail($id);
            return $event;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateEvent(Event $event, array $data) {
        try {
            $event->update($data);
            return $event;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function deleteEvent(Event $event) {
        try {
            $event->delete();
            return $event;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

}
        