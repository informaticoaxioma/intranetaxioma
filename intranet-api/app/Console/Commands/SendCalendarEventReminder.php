<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Event;
use App\Mail\CalendarEventReminderMail;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

#[Signature('app:send-calendar-event-reminders')]
#[Description('Envía un correo recordatorio a todos los colaboradores activos con los eventos del calendario programados para mañana.')]
class SendCalendarEventReminder extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = now()->addDay();
        $tomorrowDateString = $tomorrow->toDateString();

        $this->info("Buscando eventos de calendario para la fecha: {$tomorrowDateString}");

        // Obtener eventos programados para mañana
        $events = Event::whereDate('fecha', $tomorrowDateString)->get();

        if ($events->isEmpty()) {
            $this->info("No hay eventos programados para mañana.");
            return Command::SUCCESS;
        }

        $this->info("Se encontraron " . $events->count() . " eventos para mañana.");

        // Obtener destinatarios (todos los usuarios activos)
        $recipients = User::where('estado_cuenta', 'activo')->get();

        if ($recipients->isEmpty()) {
            $this->info("No hay usuarios activos registrados para recibir el correo.");
            return Command::SUCCESS;
        }

        // Formatear la fecha en español para el asunto/cuerpo
        $months = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];
        $dateFormatted = $tomorrow->day . ' de ' . $months[$tomorrow->month] . ' de ' . $tomorrow->year;

        $this->info("Enviando correo a " . $recipients->count() . " destinatarios...");

        foreach ($recipients as $recipient) {
            try {
                Mail::to($recipient->email)->send(new CalendarEventReminderMail($events, $dateFormatted));
                Log::info("Calendar event reminder email successfully sent to {$recipient->email}");
            } catch (\Exception $e) {
                $this->error("Error al enviar recordatorio a {$recipient->email}: " . $e->getMessage());
                Log::error("Failed to send calendar event reminder to {$recipient->email}: " . $e->getMessage());
            }
        }

        $this->info("Proceso completado.");
        return Command::SUCCESS;
    }
}
