<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected $url)
    {
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Redefinição de Senha do Sistema de ' . env('APP_NAME'))
            ->success()
            ->greeting('Prezado (a),')
            ->line('Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha de sua conta.')
            ->action('REDEFINIR SENHA', $this->url)
            ->line('Este link de redefinição de senha expirará em 60 minutos. Se você não solicitou uma redefinição de senha, nenhuma ação adicional será necessária.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
