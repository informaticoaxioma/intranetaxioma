<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('app:send-birthday-greetings')->dailyAt('09:00');
Schedule::command('app:send-monthly-birthday-reminders')->monthlyOn(1, '09:00');
