<?php

namespace App\Services\Organizer\Certificate;

use App\Models\Event;

class CertificateAdminService
{
    public function indexAdminCertificate(Event $event)
    {
        $certificates = $event->certificates()->latest()->paginate(20);

        return $certificates;
    }
}
        