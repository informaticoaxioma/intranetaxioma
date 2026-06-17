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
            'periodo' => 'required|date',
            'user_id' => 'required|exists:users,id',
            'archivo' => 'required|file|mimes:pdf|max:10240'
        ]);

        $archivo = $request->file('archivo');

        $path = $archivo->store(
            'payrolls',
            'public'
        );
        $validated['archivo'] = $archivo->getClientOriginalName();
        $validated['path'] = $path;
        $validated['tamano_archivo'] = $archivo->getSize();

        $payroll = $this->payrollService->create($validated);

        return response()->json($payroll, 201);
    }

    public function show(Payroll $payroll)
    {
        return response()->json($payroll);
    }

    public function update(Request $request, Payroll $payroll)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'periodo' => 'required|date',
            'user_id' => 'required|exists:users,id',
            'archivo' => 'nullable|file|mimes:pdf|max:10240'
        ]);

        /*
        |--------------------------------------------------------------------------
        | UPDATE DATA
        |--------------------------------------------------------------------------
        */

        $payroll->update([
            'titulo' => $validated['titulo'],
            'periodo' => $validated['periodo'],
            'user_id' => $validated['user_id']
        ]);

        if ( $request->hasFile('archivo')) {
            $archivo = $request->file('archivo');
            $path = $archivo->store(
                'payrolls',
                'public'
            );

            $payroll->update([
                'archivo' =>
                    $archivo
                        ->getClientOriginalName(),
                'path' =>
                    $path,
                'tamano_archivo' =>
                    $archivo->getSize()
            ]);
        }

        return response()->json([
            'message' => 'Liquidación actualizada correctamente',
            'payroll' => $payroll
        ]);
    }

    public function destroy(Payroll $payroll)
    {
        $this->payrollService->delete($payroll);

        return response()->json([
            'message' => 'Liquidación eliminada correctamente'
        ]);
    }

    public function preview(Payroll $payroll)
    {
        $filePath = storage_path(
            'app/public/' .
            $payroll->path
        );

        if (!file_exists($filePath)) {

            abort(404);
        }

        return response()->file(
            $filePath,
            [
                'Content-Type' =>
                    'application/pdf'
            ]
        );
    }

    public function download(Payroll $payroll)
    {

        return response()->download(
            storage_path(
                'app/public/' .
                $payroll->path
            ),
            $payroll->archivo
        );
    }
}