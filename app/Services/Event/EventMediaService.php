<?php

namespace App\Services\Event;

use App\Models\Event;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EventMediaService
{
    public function bannerEvent(Event $event, UploadedFile $data)
    {
        if($event->banner_path) {
            Storage::disk('public')->delete($event->banner_path);
        }

        $path = $data->store('events/banners', 'public');

        $event->update([
            'banner_path' => $path
        ]);

        return $event;
    }

    public function bannerDeleteEvent(Event $event)
    {
        if($event->banner_path) {
            Storage::disk('public')->delete($event->banner_path);
        }

        $event->update([
            'banner_path' => null
        ]);

        return $event;
    }
}
        