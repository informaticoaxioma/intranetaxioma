<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\VacationController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    // Usuarios normales
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/payslips', [PayrollController::class, 'index']);
    Route::get('/vacations', [VacationController::class, 'index']);

    // SOLO ADMIN
    Route::middleware('role:admin')->group(function () {

        Route::apiResource('users', UserController::class)
            ->except(['show']);

        Route::apiResource('news', NewsController::class)
            ->except(['index', 'show']);

        Route::apiResource('events', EventController::class)
            ->except(['index', 'show']);

        Route::apiResource('documents', DocumentController::class)
            ->except(['index', 'show']);

        Route::apiResource('payslips', PayrollController::class)
            ->except(['index', 'show']);

        Route::apiResource('vacations', VacationController::class)
            ->except(['index', 'show']);
    });
});