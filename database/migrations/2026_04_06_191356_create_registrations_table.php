<?php

use App\Enums\PaymenStatus;
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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('event_id')->constrained();
            $table->unique(['user_id', 'event_id']);
            $table->boolean('status_checkin')->default(false);
            $table->enum('payment_status', array_column(PaymenStatus::cases(), 'value'))->default(PaymenStatus::FREE->value);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
