<?php

namespace App\Services\Organizer\Registration;

use App\Models\Event;
use Exception;

class RegistrationAdminService
{
    public function storeAdminRegistration(array $data, Event $event)
    {
        $registrationWithTrash = $event->registrations()
                                ->withTrashed()
                                ->where('user_id', $data['user_id'])
                                ->first();
        
        if ($registrationWithTrash) {
            if ($registrationWithTrash->trashed()) {
                $registrationWithTrash->restore();
                return $registrationWithTrash;
            } else {
                throw new Exception('Esse usuário já está inscrito nesse evento.');
            }
        }

        // fazer logica se o evento é interno ou não -> dd('User: ', $user->institution);

        // fazer logica se o evento foi pago

        $registration = $event->registrations()->create([
            'user_id' => $data['user_id']
        ]);

        return $registration;
    }
}
        