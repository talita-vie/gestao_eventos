<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventRequest;
use App\Services\Event\EventService;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(protected EventService $eventService)
    {
        
    }

    public function index(Request $request) {
        try {
            $result = $this->eventService->index($request->user());
            return $this->sendResponse($result, 'Eventos recuperandos com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function myEvents(Request $request) {
        try {
            $result = $this->eventService->myEvents($request->user());
            return $this->sendResponse($result, 'Meus eventos recuperandos com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function myDeletedEvents(Request $request) {
        try {
            $result = $this->eventService->myDeletedEvents($request->user());
            return $this->sendResponse($result, 'Meus eventos apagados recuperandos com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function store(EventRequest $request) 
    {
        try {
            $data = $request->validated();
            $result = $this->eventService->eventStore($data);
            return $this->sendResponse($result, 'Evento criado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function show(string $id) {
        try {
            $result = $this->eventService->findEvent($id);
            return $this->sendResponse($result, 'Evento encontrado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function update(string $id, EventRequest $request) 
    {
        try {
            $data = $request->validated();
            $result = $this->eventService->updateEvent($id, $data);
            return $this->sendResponse($result, 'Evento atualizado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function destroy(string $id) 
    {
        try {
            $result = $this->eventService->deleteEvent($id);
            return $this->sendResponse($result, 'Evento excluido com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
