<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {

            $table->string('titulo');

            $table->text('resumen');

            $table->longText('texto_noticia');

            $table->string('categoria');

            $table->string('autor');

            $table->string('imagen')->nullable();

        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {

            $table->dropColumn([
                'titulo',
                'resumen',
                'texto_noticia',
                'categoria',
                'autor',
                'imagen'
            ]);

        });
    }
};