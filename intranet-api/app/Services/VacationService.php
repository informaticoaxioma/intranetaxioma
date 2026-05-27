<?php

namespace App\Services;

use App\Models\Vacation;

class VacationService
{
    /*
    |--------------------------------------------------------------------------
    | GET ALL VACATIONS
    |--------------------------------------------------------------------------
    */

    public function getAll()
    {
        return Vacation::with([
            'user',
            'approvedBy'
        ])
        ->latest()
        ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | GET VACATION BY ID
    |--------------------------------------------------------------------------
    */

    public function getById($id)
    {
        return Vacation::with([
            'user',
            'approvedBy'
        ])->findOrFail($id);
    }

    /*
    |--------------------------------------------------------------------------
    | GET USER VACATIONS
    |--------------------------------------------------------------------------
    */

    public function getByUser($userId)
    {
        return Vacation::with([
            'approvedBy'
        ])
        ->where('user_id', $userId)
        ->latest()
        ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE VACATION
    |--------------------------------------------------------------------------
    */

    public function create(array $data)
    {
        return Vacation::create($data);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE VACATION
    |--------------------------------------------------------------------------
    */

    public function update(Vacation $vacation, array $data)
    {
        $vacation->update($data);

        return $vacation->fresh();
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE VACATION
    |--------------------------------------------------------------------------
    */

    public function delete(Vacation $vacation)
    {
        return $vacation->delete();
    }

    /*
    |--------------------------------------------------------------------------
    | APPROVE VACATION
    |--------------------------------------------------------------------------
    */

    public function approve(
        Vacation $vacation,
        $adminId,
        $comment = null
    ) {

        $vacation->update([
            'estado' => 'aprobado',
            'aprobado_por' => $adminId,
            'fecha_aprobacion' => now(),
            'comentario_admin' => $comment
        ]);

        return $vacation->fresh();
    }

    /*
    |--------------------------------------------------------------------------
    | REJECT VACATION
    |--------------------------------------------------------------------------
    */

    public function reject(
        Vacation $vacation,
        $adminId,
        $comment = null
    ) {

        $vacation->update([
            'estado' => 'rechazado',
            'aprobado_por' => $adminId,
            'fecha_aprobacion' => now(),
            'comentario_admin' => $comment
        ]);

        return $vacation->fresh();
    }
}