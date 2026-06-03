<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrganizerModerationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Event $event, public string $moderationStatus)
    {
        $this->event = $event;
        $this->moderationStatus = $moderationStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $reason = $this->event->moderation_reason ? "Motivo: '{$this->event->moderation_reason}'" : "";

        $message = match($this->event) {
            'suspended' => "Seu evento '{$this->event->title}' foi SUSPENSO pelo administrador. " . $reason,
            'banned' => "Seu evento '{$this->event->title}' foi BANIDO pelo administrador por violações dos termos. " . $reason,
            'approved' => "Seu evento '{$this->event->title}' foi APROVADO pelo administrador e já está publicado. " . $reason,
            default => "O status de moderação do seu evento mudou"
        };

        return [
            'event_id' => $this->event->id,
            'title' => 'Aviso de Moderação',
            'message' => $message,
            'type' => 'moderation_alert',
            'status' => $this->moderationStatus
        ];
    }
}
