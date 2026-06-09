<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\VacationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    // Usuarios normales
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{id}', [NewsController::class, 'show']);

    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::get('/documents/{document}/download',[DocumentController::class, 'download']);

    Route::get('/payrolls', [PayrollController::class, 'index']);
    Route::get('/my-payrolls', [PayrollController::class, 'myPayrolls']);

    Route::get('/vacations', [VacationController::class, 'index']);

    // SOLO ADMIN
    Route::middleware('role:admin')->group(function () {

        Route::apiResource('users', UserController::class);

        Route::apiResource('news', NewsController::class)
            ->except(['index', 'show']);

        Route::apiResource('events', EventController::class)
            ->except(['index', 'show']);

        Route::apiResource('documents', DocumentController::class)
            ->except(['index', 'show']);

        Route::apiResource('payroll', PayrollController::class)
            ->except(['index', 'show']);

        Route::apiResource('vacations', VacationController::class)
            ->except(['index', 'show']);

        // Aprobar vacaciones
        Route::post('/vacations/{vacation}/approve', [
            VacationController::class,
            'approve'
        ]);

        // Rechazar vacaciones
        Route::post('/vacations/{vacation}/reject', [
            VacationController::class,
            'reject'
        ]);

    });
});