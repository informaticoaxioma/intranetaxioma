<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:send-birthday-greetings')->dailyAt('09:00');
Schedule::command('app:send-monthly-birthday-reminders')->monthlyOn(1, '09:00');

// Recordatorios de eventos de calendario:
// 1. Recordatorio del mismo día a primera hora (08:30)
Schedule::command('app:send-calendar-event-reminders --day=today')->dailyAt('08:30');

// 2. Recordatorio del día siguiente (10:00)
Schedule::command('app:send-calendar-event-reminders --day=tomorrow')->dailyAt('10:00');
