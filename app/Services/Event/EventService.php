<?php

namespace App\Services\Event;

use App\Enums\UserRole;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\DB;

use function Symfony\Component\Clock\now;

class EventService
{
    public function index($user) {
        try {
            $events = Event::where('organizer_id', '!=', $user['id'])
                            ->published()
                            ->paginate(10);
            
            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myEvents($user) {
        try {
            $events = Event::where('organizer_id', $user['id'])->get();
            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function myDeletedEvents($user) {
        try {
            $events = Event::onlyTrashed()
                            ->where('organizer_id', $user['id'])
                            ->get();
            return $events;
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function eventStore(array $data) 
    {
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
        