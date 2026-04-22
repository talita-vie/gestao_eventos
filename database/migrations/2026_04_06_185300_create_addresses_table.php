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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('street_name', 100);
            $table->string('neighborhood', 100);
            $table->string('city_name', 100);
            $table->char('state', 2);
            $table->string('house_number', 20);
            $table->string('street_zipcode', 8);
            $table->string('complement', 100);
            $table->text('reference_point')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
