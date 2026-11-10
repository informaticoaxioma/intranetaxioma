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
        Schema::table('wall_comments', function (Blueprint $table) {
            $table->text('contenido')->nullable()->change();
            $table->string('path_imagen')->nullable()->after('contenido');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wall_comments', function (Blueprint $table) {
            $table->dropColumn('path_imagen');
        });
    }
};

