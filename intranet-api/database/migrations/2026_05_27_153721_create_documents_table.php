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
        Schema::create('documents', function (Blueprint $table) {

            $table->id();

            $table->string('nombre');

            $table->string('categoria');

            $table->string('autor');

            $table->bigInteger('tamano_archivo');

            $table->timestamp('ultima_modificacion')->nullable();

            $table->string('archivo');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
