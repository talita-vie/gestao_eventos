<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Services\Event\EventLifecycleService;
use Illuminate\Http\Request;

class EventStatusController extends Controller
{

    public function __construct(protected EventLifecycleService $eventLifecycleService)
    {
        
    }

    public function restoreEvent(string $id) {
        try {
            $result = $this->eventLifecycleService->restoreEvent($id);
            return $this->sendResponse($result, 'Evento restaurado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function publishEvent(string $id) {
        try {
            $result = $this->eventLifecycleService->publishEvent($id);
            return $this->sendResponse($result, 'Evento publicado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function pausedEvent(string $id) {
        try {
            $result = $this->eventLifecycleService->pausedEvent($id);
            return $this->sendResponse($result, 'Evento pausado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function canceledEvent(string $id) {
        try {
            $result = $this->eventLifecycleService->canceledEvent($id);
            return $this->sendResponse($result, 'Evento cancelado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
