<?php

use App\Enums\ModerationEvent;
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
        Schema::table('events', function (Blueprint $table) {
            $table->enum('moderation_status', array_column(ModerationEvent::cases(), 'value'))->default(ModerationEvent::APPROVED->value)->after('status');
            $table->text('moderation_reason')->nullable()->after('moderation_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['moderation_status', 'moderation_reason']);
        });
    }
};
