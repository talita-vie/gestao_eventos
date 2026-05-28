<?php

namespace App\Services\Event;

use App\Enums\ModerationEvent;
use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Event;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EventService
{
    public function index(User $user) {
        try {
            $events = Event::published()->where('organizer_id', '!=', $user['id'])
                            ->with('address')
                            ->with('user')
                            ->get();

            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myEvents(User $user, array $data) {
        try {
            $query = $user->events();

            if (array_key_exists('status', $data)) {
                $query->with('address')->where('status', $data['status']);
            }

            if (array_key_exists('moderation_status', $data)) {
                $query->with('address')->where('moderation_status', $data['moderation_status']);
            }

            $events = $query->with('user')->latest()->paginate(12);

            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myDeletedEvents(User $user) {
        try {
            $events = Event::onlyTrashed()
                            ->where('organizer_id', $user->id)
                            ->paginate(15);
            
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
            $event = Event::with(['address', 'user'])->withTrashed()->findOrFail($id);
            $userId = Auth::id();
            $subscribed = $event->registrations()->where('user_id', $userId)->first();

            if ($subscribed) {
                $event->is_subscribed = $subscribed->exists;
                $event->registration_id = $subscribed->id;
                }
                
                $count = $event->registrations()->count();
                $event->available_vacancies = $event->capacity - $count;

            return $event;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateEvent(Event $event, array $dataEvent, array $dataAddress) {

        return DB::Transaction(function() use($dataEvent, $dataAddress, $event) {

        $cep = $dataAddress['street_zipcode'];
         $dataAddress['street_zipcode'] = substr($cep, 0, 5) . substr($cep, 6, 3);

        if(!$event->address_id) {
            $address = Address::create($dataAddress);
            $dataEvent['address_id'] = $address->id;
        } else {
            $address = Address::findOrFail($event->address_id);
            $address->update($dataAddress);
        }

        $event->update($dataEvent);

        return $event->load('address');
    });

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
        