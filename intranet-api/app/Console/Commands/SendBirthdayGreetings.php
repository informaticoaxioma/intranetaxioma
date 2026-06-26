<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\BirthdayGreetingMail;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

#[Signature('app:send-birthday-greetings')]
#[Description('Revisa la lista de usuarios y envía un correo de saludo de cumpleaños a quienes estén de cumpleaños hoy.')]
class SendBirthdayGreetings extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now();
        $this->info("Buscando usuarios que estén de cumpleaños hoy: " . $today->format('d-m'));

        $birthdayUsers = User::whereNotNull('fecha_nacimiento')
            ->whereMonth('fecha_nacimiento', $today->month)
            ->whereDay('fecha_nacimiento', $today->day)
            ->get();

        if ($birthdayUsers->isEmpty()) {
            $this->info("No hay usuarios de cumpleaños el día de hoy.");
            return Command::SUCCESS;
        }

        $this->info("Se encontraron " . $birthdayUsers->count() . " usuario(s) de cumpleaños.");

        foreach ($birthdayUsers as $user) {
            $this->info("Enviando saludo a: {$user->name} ({$user->email})");
            try {
                Mail::to($user->email)->send(new BirthdayGreetingMail($user));
                Log::info("Birthday greeting email successfully sent to {$user->email}");
            } catch (\Exception $e) {
                $this->error("Error al enviar saludo a {$user->email}: " . $e->getMessage());
                Log::error("Failed to send birthday greeting email to {$user->email}: " . $e->getMessage());
            }
        }

        $this->info("Proceso completado.");
        return Command::SUCCESS;
    }
}
