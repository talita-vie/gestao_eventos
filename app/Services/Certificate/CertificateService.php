<?php

namespace App\Services\Certificate;

use App\Models\Certificate;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateService
{
    public function allCertificates(User $user)
    {
        $certificates = $user->certificates()->latest()->paginate(15);

        return $certificates;
    }

    public function viewCertificate(Certificate $certificate)
    {
        $pdf = Pdf::loadView('certificates.template', ['certificate' => $certificate]);
        $pdf->setPaper('a4', 'landscape');

        $pdfPadrao = $pdf->output();
        $pdfBase64 = base64_encode($pdfPadrao);

        return [
            'file_name' => "certificado-{$certificate->validation_code}.pdf",
            'pdf_base64' => $pdfBase64
        ]; 
    }
}
        