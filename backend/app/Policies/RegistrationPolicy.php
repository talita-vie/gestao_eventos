<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    public function before(User $user)
    {
        if($user->role->value === UserRole::ADMIN->value) {
            return true;
        }

        return null;
    } 

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Registration $registration): bool
    {
        return ($user->id === $registration->user_id || $user->id === $registration->event->organizer_id);
    }

    public function checkin(User $user, Registration $registration): bool
    {
        return $user->id === $registration->event->organizer_id;
    }

    public function deleteCheckin(User $user, Registration $registration): bool
    {
        return $user->id === $registration->event->organizer_id;
    }


}
