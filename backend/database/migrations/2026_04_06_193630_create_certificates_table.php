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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('validation_code')->unique();
            $table->string('event_title_snapshot');
            $table->string('event_start_date_snapshot');
            $table->string('event_end_date_snapshot');
            $table->string('event_hours_snapshot');
            $table->string('participant_name_snapshot');
            $table->dateTime('issue_date');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
