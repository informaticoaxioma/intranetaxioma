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
        Schema::table('payrolls', function ( Blueprint $table) {

            $table->string('path')
                ->after('archivo');

            $table->bigInteger(
                'tamano_archivo'
            )->nullable()->after('path');

            $table->timestamp(
                'ultima_modificacion'
            )->nullable()->after('tamano_archivo');
        });

        /*
        |--------------------------------------------------------------------------
        | CAMBIAR PERIODO A DATE
        |--------------------------------------------------------------------------
        */

        Schema::table('payrolls', function (Blueprint $table) {

            $table->date('periodo')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (
            Blueprint $table
        ) {

            $table->dropColumn([
                'path',
                'tamano_archivo',
                'ultima_modificacion'
            ]);
        });
    }
};
