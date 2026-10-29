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

#[Signature('app:send-calendar-event-reminders {--day=all : Día a procesar: "today" (hoy), "tomorrow" (mañana) o "all" (ambos)}')]
#[Description('Envía un correo recordatorio a todos los colaboradores activos con los eventos del calendario programados para hoy y/o para mañana.')]
class SendCalendarEventReminder extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Obtener destinatarios (todos los usuarios activos)
        $recipients = User::where('estado_cuenta', 'activo')->get();

        if ($recipients->isEmpty()) {
            $this->info("No hay usuarios activos registrados para recibir el correo.");
            return Command::SUCCESS;
        }

        $dayOption = strtolower((string) ($this->option('day') ?? 'all'));

        // Procesar eventos de HOY
        if (in_array($dayOption, ['today', 'all'])) {
            $this->sendRemindersForDate(now(), true, $recipients);
        }

        // Procesar eventos de MAÑANA
        if (in_array($dayOption, ['tomorrow', 'all'])) {
            $this->sendRemindersForDate(now()->addDay(), false, $recipients);
        }

        $this->info("Proceso de recordatorio de eventos completado.");
        return Command::SUCCESS;
    }

    /**
     * Envía los recordatorios de eventos para una fecha específica.
     */
    private function sendRemindersForDate($date, bool $isToday, $recipients): void
    {
        $dateString = $date->toDateString();
        $dayLabel = $isToday ? 'hoy' : 'mañana';

        $this->info("Buscando eventos de calendario para {$dayLabel} ({$dateString})...");

        // Obtener eventos programados para la fecha
        $events = Event::whereDate('fecha', $dateString)
            ->orderBy('hora_inicio')
            ->get();

        if ($events->isEmpty()) {
            $this->info("No hay eventos programados para {$dayLabel}.");
            return;
        }

        $this->info("Se encontraron {$events->count()} eventos para {$dayLabel}.");

        // Formatear la fecha en español
        $months = [
            1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
            5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
            9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
        ];
        $dateFormatted = $date->day . ' de ' . $months[$date->month] . ' de ' . $date->year;

        $this->info("Enviando recordatorio de {$dayLabel} a {$recipients->count()} colaboradores activos...");

        $sentCount = 0;
        foreach ($recipients as $recipient) {
            if (empty($recipient->email)) {
                continue;
            }

            try {
                Mail::to($recipient->email)->send(
                    new CalendarEventReminderMail($events, $dateFormatted, $isToday)
                );
                $sentCount++;
                Log::info("Calendar event reminder ({$dayLabel}) sent to {$recipient->email}");
            } catch (\Exception $e) {
                $this->error("Error al enviar recordatorio a {$recipient->email}: " . $e->getMessage());
                Log::error("Failed to send calendar event reminder ({$dayLabel}) to {$recipient->email}: " . $e->getMessage());
            }
        }

        $this->info("Recordatorios de {$dayLabel} enviados con éxito ({$sentCount}/{$recipients->count()}).");
    }
}
