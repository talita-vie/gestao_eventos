<?php

namespace App\Http\Controllers\Organizer\Certificate;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\Organizer\Certificate\CertificateAdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CertificateAdminController extends Controller
{
    public function indexAdmin(Event $event, CertificateAdminService $certificateAdminService)
    {
        Gate::authorize('view', $event);
        
        try {
            $result = $certificateAdminService->indexAdminCertificate($event);
            return $this->sendResponse($result, 'Certificados do evento listados com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
