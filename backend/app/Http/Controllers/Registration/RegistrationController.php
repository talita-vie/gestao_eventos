<?php

namespace App\Http\Controllers\Registration;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Registration;
use App\Services\Registration\RegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RegistrationController extends Controller
{

    public function __construct(protected RegistrationService $registrationService)
    {

    }
    /**
     * Display a listing of the resource.
     */
    public function index(Event $event)
    {
        Gate::authorize('view', $event);
        try {
            $result = $this->registrationService->indexRegistration($event);
            return $this->sendResponse($result, 'Inscrições encontradas com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Event $event)
    {
        try {
            $user = $request->user();
            $result = $this->registrationService->storeRegistration($user, $event);
            return $this->sendResponse($result, 'Inscrição realizada com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Registration $registration)
    {
        Gate::authorize('delete', $registration);
        try {
            $result = $this->registrationService->deleteRegistration($registration);
            return $this->sendResponse($result, 'Inscrição deletada com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
