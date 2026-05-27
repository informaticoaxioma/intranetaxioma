<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vacations', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->date('fecha_inicio');

            $table->date('fecha_fin');

            $table->integer('dias_solicitados');

            $table->text('comentario')->nullable();

            $table->enum('estado', [
                'pendiente',
                'aprobado',
                'rechazado'
            ])->default('pendiente');

            $table->foreignId('aprobado_por')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamp('fecha_aprobacion')
                  ->nullable();

            $table->text('comentario_admin')
                  ->nullable();

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacations');
    }
};
