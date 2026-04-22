<?php

namespace App\Models;

use App\Enums\PaymenStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Registration extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'event_id',
        'status_checkin',
        'payment_status'
    ];

    protected function casts()
    {
        return [
            'payment_status' => PaymenStatus::class
        ];
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
