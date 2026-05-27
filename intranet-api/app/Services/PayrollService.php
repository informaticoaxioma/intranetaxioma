<?php

namespace App\Services;

use App\Models\Payroll;

class PayrollService
{
    public function getAll()
    {
        return Payroll::with('user')
            ->latest()
            ->get();
    }

    public function getByUser($userId)
    {
        return Payroll::where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function create(array $data)
    {
        return Payroll::create($data);
    }

    public function update(Payroll $payroll, array $data)
    {
        $payroll->update($data);

        return $payroll;
    }

    public function delete(Payroll $payroll)
    {
        return $payroll->delete();
    }
}