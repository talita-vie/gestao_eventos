<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certificate extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'registration_id',
        'validation_code',
        'event_title_snapshot',
        'event_start_date_snapshot',
        'event_end_date_snapshot',
        'event_hours_snapshot',
        'participant_name_snapshot',
        'issue_date'
    ];

    protected function casts()
    {
        return [
            'issue_date' => 'datetime'
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
