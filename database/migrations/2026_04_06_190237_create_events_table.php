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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->text('description');
            $table->dateTime('start_date_time');
            $table->dateTime('end_date_time');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->dateTime('registration_deadline');
            $table->string('speaker', 100);
            $table->integer('capacity');
            $table->integer('hours');
            $table->decimal('price', 8, 2)->default(0.00);
            $table->boolean('is_external')->default(true);
            $table->foreignId('references_id')->nullable()->constrained('events')->onDelete('cascade');
            $table->foreignId('organizer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
