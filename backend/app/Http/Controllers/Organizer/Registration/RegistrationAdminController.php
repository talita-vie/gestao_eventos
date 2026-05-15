<?php

namespace App\Http\Controllers\Organizer\Registration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RegistrationUserAdminRequest;
use App\Models\Event;
use App\Services\Organizer\Registration\RegistrationAdminService;
use Illuminate\Support\Facades\Gate;

class RegistrationAdminController extends Controller
{
    public function storeAdmin(RegistrationUserAdminRequest $request, Event $event, RegistrationAdminService $registrationAdminService)
    {
        Gate::authorize('create', $event);
        
        try {
            $data = $request->validated();
            $result = $registrationAdminService->storeAdminRegistration($data, $event);
            return $this->sendResponse($result, 'Inscrição realizada com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
