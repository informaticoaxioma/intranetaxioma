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
    Schema::table('users', function (Blueprint $table) {

        $table->string('contrato')
            ->nullable()
            ->after('fecha_ingreso');

        // Nombre del archivo
        $table->string('foto_perfil')
            ->nullable()
            ->after('contrato');

        // Ruta en storage
        $table->string('path_foto_perfil')
            ->nullable()
            ->after('foto_perfil');

    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'contrato',
            'foto_perfil',
            'path_foto_perfil',
        ]);
    });
    }
};
