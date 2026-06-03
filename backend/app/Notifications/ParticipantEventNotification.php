<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ParticipantEventNotification extends Notification
{
    use Queueable;
    public Event $event;
    public string $status;

    /**
     * Create a new notification instance.
     */
    public function __construct(Event $event, string $status)
    {
        $this->event = $event;
        $this->status = $status;
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
        $message = match($this->status) {
            'paused' => "Atenção: O evento '{$this->event->title}' foi pausado temporariamente pelo organizador.",
            'published' => "Boa notícia! O evento '{$this->event->title}' voltou a atividade.",
            'canceled' => "Infelizmente, o evento '{$this->event->title}' foi cancelado. Aguarde instruções de reembolso se aplicável.",
            'finished' => "O evento '{$this->event->title}' foi finalizado. Verifique a página de certificados se você realizou o check-in no evento.",
            default => "Houve uma atualização no evento '{$this->event->title}'."
        };

        return [
            'event_id' => $this->event->id,
            'title' => 'Atualização do Evento',
            'message' => $message,
            'type' => 'participant_alert',
            'status' => $this->status
        ];
    }
}
