<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends BaseVerifyEmail
{

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Confirme seu cadastro no Evento')
            ->greeting('Olá, ' . $notifiable->name . '!')
            ->line('Falta pouco! Clique no botão abaixo para liberar seu acesso.')
            ->action('Confirmar Email', $url)
            ->salutation('Diego Dias');
    }

    protected function verificationUrl($notifiable) {
        $expiration = Carbon::now()->addMinutes((int) config('auth.verification.expire'));

        $apiUrl = URL::temporarySignedRoute(
            'verification.verify',
            $expiration,
            [
                'id' => $notifiable->getKey(),
                'hash' => hash('sha256', $notifiable->getEmailForVerification())
            ]
        );

        //return str_replace(env('APP_URL'), env('FRONTEND_URl'), $apiUrl);
        return $apiUrl;
    }
}
