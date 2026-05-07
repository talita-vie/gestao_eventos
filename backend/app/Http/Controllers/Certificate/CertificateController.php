<?php

namespace App\Http\Controllers\Certificate;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Services\Certificate\CertificateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CertificateController extends Controller
{
    public function __construct(protected CertificateService $certificateService)
    {

    }

    public function allCertificates(Request $request)
    {
        try {
            $result = $this->certificateService->allCertificates($request->user());
            return $this->sendResponse($result, 'Certificados do participante encontrados com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function viewCertificate(Certificate $certificate)
    {
        Gate::authorize('view', $certificate);
        try {
            $result = $this->certificateService->viewCertificate($certificate);
            return $this->sendResponse($result, 'Certificado encontrado com sucesso.');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
