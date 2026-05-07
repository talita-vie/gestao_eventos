<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\UploadBannerRequest;
use App\Models\Event;
use App\Services\Event\EventMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EventMediaController extends Controller
{

    public function __construct(protected EventMediaService $eventMediaService)
    {
        
    }

    public function bannerEvent(UploadBannerRequest $request, Event $event)
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $data = $request->validated();
            $result = $this->eventMediaService->bannerEvent($event, $data['banner']);
            return $this->sendResponse($result, 'Banner atualizado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendResponse('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function bannerDeleteEvent(Event $event)
    {
        Gate::authorize('lifeCycle', $event);
        
        try {
            $result = $this->eventMediaService->bannerDeleteEvent($event);
            return $this->sendResponse($result, 'Banner atualizado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendResponse('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
