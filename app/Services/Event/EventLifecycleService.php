<?php

namespace App\Services\Event;

use App\Enums\StatusEvent;
use App\Models\Event;
use App\Models\Registration;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventLifecycleService
{
    public function restoreEvent(string $id) 
    {
        $event = Event::withTrashed()->findOrFail($id);
        $event->restore();
        return $event;
    }

    public function publishEvent(string $id) 
    {
        $event = Event::findOrFail($id);

        if($event->status->value === StatusEvent::PUBLISHED->value) {
            throw new Exception('Esse evento já está publicado.');
        }

        if($event->end_date_time && Carbon::parse($event->end_date_time)->isPast()) {
            throw new Exception('Não é possível publicar um evento que já aconteceu. Atualize as datas antes de publicar.');
        }

        if($event->registration_deadline && Carbon::parse($event->registration_deadline)->isPast()) {
            throw new Exception('O prazo de inscrição para esse evento já está encerrado. Atualize as datas antes de publicar.');
        }

        $event->update([
            'status' => StatusEvent::PUBLISHED->value,
            'published_at' => now()
        ]);
        
        return $event;
    }

    public function pausedEvent(string $id) 
    {
        $event = Event::findOrFail($id);

        if(in_array($event->status->value, [StatusEvent::DRAFT->value, StatusEvent::CANCELED->value])) {
            throw new Exception('Não é possível pausar um evento que não foi publicado ou foi cancelado.');
        }

        if($event->status->value === StatusEvent::PAUSED->value) {
            throw new Exception('Esse evento foi temporariamente suspensas pelo organizador.');
        }

        if($event->end_date_time && Carbon::parse($event->end_date_time)->isPast()) {
            throw new Exception('Não é possível pausar um evento que já aconteceu.');
        }

        $event->update([
            'status' => StatusEvent::PAUSED->value,
        ]);
        
        return $event;
    }

    public function canceledEvent(string $id) 
    {
        $event = Event::findOrFail($id);

        if($event->status->value === StatusEvent::DRAFT->value) {
            throw new Exception('Não é possível cancelar um evento que não foi publicado');
        }

        if($event->status->value === StatusEvent::CANCELED->value) {
            throw new Exception('Esse evento já foi cancelado pelo organizador.');
        }

        if($event->end_date_time && Carbon::parse($event->end_date_time)->isPast()) {
            throw new Exception('Não é possível cancelar um evento que já aconteceu.');
        }

        $event->update([
            'status' => StatusEvent::CANCELED->value,
        ]);
        
        return $event;
    }

    public function participantsEvent(Event $event)
    {
        $participants = $event->registrations()
                        ->with('user:id,name,email')
                        ->latest()
                        ->paginate(20);

        return $participants;
    }

    public function checkinParticipants(Registration $registration)
    {
        if ($registration->event->status->value !== StatusEvent::PUBLISHED->value) {
            throw new Exception('Não é possível fazer o check-in do participante de um evento que não está publicado.');
        }

        if ($registration->status_checkin === true) {
            throw new Exception('Esse partipante já fez o check-in.');
        }

        $registration->update([
            'status_checkin' => true
        ]);

        return $registration;
    }

    public function deleteCheckinParticipants(Registration $registration)
    {

        if ($registration->status_checkin === false) {
            throw new Exception('Esse partipante já desfez o check-in.');
        }

        $registration->update([
            'status_checkin' => false
        ]);

        return $registration;
    }

    public function finishEvent(Event $event)
    {
        if ($event->status->value === StatusEvent::FINISHED->value) {
            throw new Exception('Esse evento já foi finalizado pelo organizador.');
        }

        if (Carbon::parse($event->end_date_time)->isFuture()) {
            throw new Exception('Não é possível finalizar um evento que ainda não acabou.');
        }

        return DB::transaction(function() use($event) {

            $event->update([
                'status' => StatusEvent::FINISHED->value
            ]);
            
            $participants = $event->registrations()->where('status_checkin', true)->get();
            
            foreach ($participants as $registration) {
                
                $registration->certificate()->firstOrCreate(
                    ['registration_id' => $registration->id],
                    [
                        'validation_code' => Str::random(16),
                        'event_title_snapshot' => $event->name,
                        'event_start_date_snapshot' => $event->start_date_time->format('d/m/Y'),
                        'event_end_date_snapshot' => $event->end_date_time->format('d/m/Y'),
                        'event_hours_snapshot' => $event->hours,
                        'participant_name_snapshot' => $registration->user->name,
                        'issue_date' => now()
                    ]
                );
            }

            return $participants;
        });
    }
}
        