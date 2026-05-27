<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Vacation;
use App\Services\VacationService;
use Illuminate\Http\Request;

class VacationController extends Controller
{
    protected $vacationService;

    public function __construct(
        VacationService $vacationService
    ) {
        $this->vacationService = $vacationService;
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN - ALL VACATIONS
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        return response()->json(
            $this->vacationService->getAll()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | USER - MY VACATIONS
    |--------------------------------------------------------------------------
    */

    public function myVacations(Request $request)
    {
        return response()->json(
            $this->vacationService->getByUser(
                $request->user()->id
            )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW VACATION
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        return response()->json(
            $this->vacationService->getById($id)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE VACATION
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'dias_solicitados' => 'required|integer',
            'comentario' => 'nullable|string'
        ]);

        $validated['user_id'] = $request->user()->id;

        $vacation = $this->vacationService->create(
            $validated
        );

        return response()->json($vacation, 201);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE VACATION
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Vacation $vacation
    ) {

        $validated = $request->validate([
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin' => 'sometimes|date',
            'dias_solicitados' => 'sometimes|integer',
            'comentario' => 'nullable|string'
        ]);

        $updated = $this->vacationService->update(
            $vacation,
            $validated
        );

        return response()->json($updated);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE VACATION
    |--------------------------------------------------------------------------
    */

    public function destroy(Vacation $vacation)
    {
        $this->vacationService->delete($vacation);

        return response()->json([
            'message' => 'Vacación eliminada correctamente'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | APPROVE VACATION
    |--------------------------------------------------------------------------
    */

    public function approve(
        Request $request,
        Vacation $vacation
    ) {

        $vacation = $this->vacationService->approve(
            $vacation,
            $request->user()->id,
            $request->comentario_admin
        );

        return response()->json($vacation);
    }

    /*
    |--------------------------------------------------------------------------
    | REJECT VACATION
    |--------------------------------------------------------------------------
    */

    public function reject(
        Request $request,
        Vacation $vacation
    ) {

        $vacation = $this->vacationService->reject(
            $vacation,
            $request->user()->id,
            $request->comentario_admin
        );

        return response()->json($vacation);
    }
}