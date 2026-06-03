<?php

namespace App\Services\Notification;

use App\Models\User;
use Illuminate\Http\Request;

class NotificationService
{
    public function indexNotification(Request $data)
    {
        $user = $data->user();

        $query = $data->query('unread_only')
        ? $user->unreadNotifications()
        : $user->notifications();

        $notifications = $query->paginate(20);
        
        return $notifications;
    }

    public function markAsReadNotification(User $user, string $id)
    {
        $notification = $user->notifications()->findOrFail($id);
        $notification->markAsRead();

        return $notification;
    }

    public function markAllAsReadNotification(User $user)
    {
        $notification = $user->unreadNotifications->markAsRead();

        return $notification;
    }
}
        