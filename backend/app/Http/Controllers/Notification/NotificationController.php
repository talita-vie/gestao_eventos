<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{

    public function __construct(protected NotificationService $notificationService)
    {

    }

    public function index(Request $request)
    {
        try {
            $result = $this->notificationService->indexNotification($request);
            return $this->sendResponse($result, 'Notificações encontradas com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function markAsRead(Request $request, string $id)
    {
        try {
            $user = $request->user();
            $result = $this->notificationService->markAsReadNotification($user, $id);
            return $this->sendResponse($result, 'Notificação lida com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            $result = $this->notificationService->markAllAsReadNotification($user);
            return $this->sendResponse($result, 'Notificações lidas com sucesso!');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
