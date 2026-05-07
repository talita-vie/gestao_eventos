<?php

namespace App\Services\Registration;

use App\Enums\StatusEvent;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Exception;

class RegistrationService
{
    public function indexRegistration(Event $event)
    {
        $registrations = $event->registrations;

        return $registrations;
    }

    public function storeRegistration(User $user, Event $event)
    {
        $registrationWithTrash = $event->registrations()
                                ->withTrashed()
                                ->where('user_id', $user->id)
                                ->first();
        
        if ($registrationWithTrash) {
            if ($registrationWithTrash->trashed()) {
                $registrationWithTrash->restore();
                return $registrationWithTrash;
            } else {
                throw new Exception('Você já está inscrito nesse evento.');
            }
        }

        if ($event->status->value !== StatusEvent::PUBLISHED->value) {
            throw new Exception('As inscrições não estão disponíveis para este evento no momento.');
        }

        if ($event->registrations()->count() >= $event->capacity) {
            throw new Exception('As vagas para esse evento já estão esgotadas.');
        }

        if($event->registration_deadline->isPast()) {
            throw new Exception('O período de inscrição nesse evento acabou.');
        }

        

        // fazer logica se o evento é interno ou não -> dd('User: ', $user->institution);

        // fazer logica se o evento foi pago

        // verificar se o evento é seu

        $registration = $event->registrations()->create([
            'user_id' => $user->id
        ]);

        return $registration;
    }

    public function deleteRegistration(User $user, Registration $registration)
    {
        if ($registration->trashed()) {
            throw new Exception('Essa inscrição já foi cancelada.');
        }

        if ($registration->user_id !== $user->id) {
            throw new Exception('Você não tem permissão para cancelar essa inscrição.');
        }

        if($registration->event->start_date_time->isPast()) {
            throw new Exception('Não é posível cancelar a inscrição de um evento que já começou.');
        }

        $registration->delete();

        return $registration;
    }
}
        