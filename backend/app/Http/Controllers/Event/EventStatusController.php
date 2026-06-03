<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Services\Event\EventLifecycleService;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Gate;

class EventStatusController extends Controller
{

    public function __construct(protected EventLifecycleService $eventLifecycleService)
    {
        
    }

    public function restoreEvent(Event $event) 
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $result = $this->eventLifecycleService->restoreEvent($event);
            return $this->sendResponse($result, 'Evento restaurado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function publishEvent(Event $event) 
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $result = $this->eventLifecycleService->publishEvent($event);

            return $this->sendResponse($result, 'Evento publicado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function pausedEvent(Event $event) 
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $result = $this->eventLifecycleService->pausedEvent($event);
            return $this->sendResponse($result, 'Evento pausado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function canceledEvent(Event $event) 
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $result = $this->eventLifecycleService->canceledEvent($event);
            return $this->sendResponse($result, 'Evento cancelado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function participantsEvent(Event $event) 
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $result = $this->eventLifecycleService->participantsEvent($event);
            return $this->sendResponse($result, 'Usuários do evento encontrados com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function checkinParticipants(Registration $registration) 
    {
        Gate::authorize('checkin', $registration);

        try {
            $result = $this->eventLifecycleService->checkinParticipants($registration);
            return $this->sendResponse($result, 'Check-in do participante feito com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function deleteCheckinParticipants(Registration $registration) 
    {
        Gate::authorize('deleteCheckin', $registration);

        try {
            $result = $this->eventLifecycleService->deleteCheckinParticipants($registration);
            return $this->sendResponse($result, 'Check-in do participante excluido com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function finishEvent(Event $event)
    {
        Gate::authorize('lifeCycle', $event);

        try {
            $result = $this->eventLifecycleService->finishEvent($event);
            return $this->sendResponse($result, 'Evento finalizado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
