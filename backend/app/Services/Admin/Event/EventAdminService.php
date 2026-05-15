<?php

namespace App\Services\Admin\Event;

use App\Models\Event;

class EventAdminService
{
    public function indexEventAdmin(array $data)
    {
        $query = Event::query();

        if(array_key_exists('status', $data)) {
            $query->where('status', $data['status']);
        }

        if(array_key_exists('moderation_status', $data)) {
            $query->where('moderation_status', $data['moderation_status']);
        }

        $events = $query->latest()->paginate(20);
        
        return $events;
    }

    public function moderateStatusAdmin(array $data, Event $event)
    {
        $event->update($data);

        return $event;
    }

}
        