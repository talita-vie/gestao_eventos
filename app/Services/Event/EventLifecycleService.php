<?php

namespace App\Services\Event;

use App\Enums\StatusEvent;
use App\Models\Event;
use Exception;
use Illuminate\Support\Carbon;

class EventLifecycleService
{
    public function restoreEvent(string $id) {
        $event = Event::withTrashed()->findOrFail($id);
        $event->restore();
        return $event;
    }

    public function publishEvent(string $id) {
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

    public function pausedEvent(string $id) {
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

    public function canceledEvent(string $id) {
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
}
        