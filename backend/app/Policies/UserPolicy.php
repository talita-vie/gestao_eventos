<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function before(User $authenticateUser)
    {
        if($authenticateUser->role->value === UserRole::ADMIN->value) {
            return true;
        }

        return null;
    } 
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $authenticateUser): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $authenticateUser, User $targetUser): bool
    {
        return $authenticateUser->id === $targetUser->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $authenticateUser): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $authenticateUser, User $targetUser): bool
    {
        return $authenticateUser->id === $targetUser->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $authenticateUser, User $targetUser): bool
    {
        return $authenticateUser->id === $targetUser->id;;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}
