<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use App\Services\PayrollService;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index()
    {
        return response()->json(
            $this->payrollService->getAll()
        );
    }

    public function myPayrolls(Request $request)
    {
        return response()->json(
            $this->payrollService->getByUser(
                $request->user()->id
            )
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'periodo' => 'required|string|max:100',
            'user_id' => 'required|exists:users,id',
            'archivo' => 'required|string'
        ]);

        $payroll = $this->payrollService->create($validated);

        return response()->json($payroll, 201);
    }

    public function show(Payroll $payroll)
    {
        return response()->json($payroll);
    }

    public function destroy(Payroll $payroll)
    {
        $this->payrollService->delete($payroll);

        return response()->json([
            'message' => 'Liquidación eliminada correctamente'
        ]);
    }
}