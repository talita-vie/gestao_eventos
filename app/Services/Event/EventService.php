<?php

namespace App\Services\Event;

use App\Enums\UserRole;
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

    public function eventStore(array $data) 
    {
        // mudar logica, não mandar o organizer_id pela requisição, mas usar o request
        return DB::Transaction(function() use($data) {
            $user = User::findOrFail($data['organizer_id']);
            $user->update([
                'role' => UserRole::ORGANIZER->value
            ]);

            $event = Event::create($data);

            return $event;
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

    public function updateEvent(string $id, array $data) {
        try {
            $event = Event::findOrFail($id);
            $event->update($data);
            return $event;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function deleteEvent(string $id) {
        try {
            $event = Event::findOrFail($id);
            $event->delete();
            return $event;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

}
        