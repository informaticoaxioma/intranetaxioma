<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\VacationController;
use App\Http\Controllers\LaborDocumentController;
use App\Http\Controllers\WallController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me/avatar', [AuthController::class, 'updateAvatar']);
    Route::get('/stats', [AuthController::class, 'stats']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Usuarios normales

    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::get('/documents/{document}/download',[DocumentController::class, 'download']);
    Route::get('/documents/{document}/preview',[DocumentController::class, 'preview']);

    Route::get('/payrolls', [PayrollController::class, 'index']);
    Route::get('/payrolls/{payroll}', [PayrollController::class, 'show']);
    Route::get('/payrolls/{payroll}/download',[PayrollController::class, 'download']);
    Route::get('/payrolls/{payroll}/preview',[PayrollController::class, 'preview']);
    Route::get('/my-payrolls', [PayrollController::class, 'myPayrolls']);

    Route::get('/labor-documents', [LaborDocumentController::class, 'index']);
    Route::get('/labor-documents/{laborDocument}', [LaborDocumentController::class, 'show']);
    Route::get('/labor-documents/{laborDocument}/download',[LaborDocumentController::class, 'download']);
    Route::get('/labor-documents/{laborDocument}/preview',[LaborDocumentController::class, 'preview']);
    Route::get('/my-labor-documents', [LaborDocumentController::class, 'myLaborDocuments']);

    Route::get('/vacations', [VacationController::class, 'index']);
    Route::post('/vacations', [VacationController::class, 'store']);
    Route::get('/my-vacations', [VacationController::class, 'myVacations']);

    // MURO (WALL)
    Route::get('/wall', [WallController::class, 'index']);
    Route::post('/wall/posts', [WallController::class, 'storePost']);
    Route::delete('/wall/posts/{id}', [WallController::class, 'destroyPost']);
    Route::post('/wall/posts/{id}/comments', [WallController::class, 'storeComment']);
    Route::delete('/wall/comments/{id}', [WallController::class, 'destroyComment']);
    Route::post('/wall/posts/{id}/react', [WallController::class, 'react']);

    // SOLO ADMIN
    Route::middleware('role:admin')->group(function () {

        Route::apiResource('users', UserController::class);

        Route::apiResource('news', NewsController::class)
            ->except(['index', 'show']);

        Route::apiResource('events', EventController::class)
            ->except(['index', 'show']);

        Route::apiResource('documents', DocumentController::class)
            ->except(['index', 'show']);

        Route::apiResource('payrolls', PayrollController::class)
            ->except(['index', 'show']);

        Route::apiResource('labor-documents', LaborDocumentController::class)
            ->except(['index', 'show']);

        Route::apiResource('vacations', VacationController::class)
            ->except(['store']);

        // Aprobar vacaciones
        Route::patch('/vacations/{vacation}/approve', [
            VacationController::class,
            'approve'
        ]);

        // Rechazar vacaciones
        Route::patch('/vacations/{vacation}/reject', [
            VacationController::class,
            'reject'
        ]);

    });
});