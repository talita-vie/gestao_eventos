<?php

namespace App\Http\Controllers\Admin\Event;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ModerateRequest;
use App\Http\Requests\Event\StatusEventRequest;
use App\Models\Event;
use App\Services\Admin\Event\EventAdminService;
use Illuminate\Http\Request;

class EventAdminController extends Controller
{

    public function __construct(protected EventAdminService $eventAdminService)
    {
        
    }
    public function index(StatusEventRequest $request)
    {
        try {
            $data = $request->validated();
            $result = $this->eventAdminService->indexEventAdmin($data);
            return $this->sendResponse($result, 'Eventos encontrados com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }

    public function moderateStatus(ModerateRequest $request, Event $event)
    {
        try {
            $data = $request->validated();
            $result = $this->eventAdminService->moderateStatusAdmin($data, $event);
            return $this->sendResponse($result, 'Status do evento alterado com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [$th->getMessage()]);
        }
    }
}
