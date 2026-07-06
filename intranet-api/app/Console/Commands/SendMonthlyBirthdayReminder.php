<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\MonthlyBirthdaysReminderMail;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

#[Signature('app:send-monthly-birthday-reminders')]
#[Description('Envía un correo mensual a todos los colaboradores activos con el listado de cumpleaños del mes actual.')]
class SendMonthlyBirthdayReminder extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = now();
        $months = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];
        $monthName = $months[$today->month];

        $this->info("Iniciando envío de recordatorios de cumpleaños para el mes de: {$monthName}");

        // Obtener colaboradores de cumpleaños en el mes actual (ordenados por día de cumpleaños)
        $birthdayUsers = User::whereNotNull('fecha_nacimiento')
            ->where('estado_cuenta', 'activo')
            ->whereMonth('fecha_nacimiento', $today->month)
            ->orderByRaw('DAY(fecha_nacimiento) ASC')
            ->get();

        $this->info("Se encontraron " . $birthdayUsers->count() . " cumpleaños en este mes.");

        // Obtener destinatarios (todos los usuarios activos)
        $recipients = User::where('estado_cuenta', 'activo')->get();

        if ($recipients->isEmpty()) {
            $this->info("No hay usuarios activos registrados para recibir el correo.");
            return Command::SUCCESS;
        }

        $this->info("Enviando correo a " . $recipients->count() . " destinatarios...");

        foreach ($recipients as $recipient) {
            try {
                Mail::to($recipient->email)->send(new MonthlyBirthdaysReminderMail($birthdayUsers, $monthName));
                Log::info("Monthly birthday reminder email successfully sent to {$recipient->email}");
            } catch (\Exception $e) {
                $this->error("Error al enviar recordatorio a {$recipient->email}: " . $e->getMessage());
                Log::error("Failed to send monthly birthday reminder to {$recipient->email}: " . $e->getMessage());
            }
        }

        $this->info("Proceso completado.");
        return Command::SUCCESS;
    }
}
