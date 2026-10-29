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
        Schema::table('wall_posts', function (Blueprint $table) {
            $table->text('contenido')->nullable()->change();
            $table->json('imagenes')->nullable()->after('path_imagen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wall_posts', function (Blueprint $table) {
            $table->dropColumn('imagenes');
        });
    }
};

