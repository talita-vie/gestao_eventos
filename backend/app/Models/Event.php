<?php

namespace App\Models;

use App\Enums\ModerationEvent;
use App\Enums\StatusEvent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'banner_path',
        'start_date_time',
        'end_date_time',
        'category_id',
        'registration_deadline',
        'speaker',
        'capacity',
        'hours',
        'price',
        'status',
        'moderation_status',
        'moderation_reason',
        'published_at',
        'is_external',
        'references_id',
        'organizer_id',
        'address_id'
    ];

    protected function casts()
    {
        return [
            'start_date_time' => 'datetime',
            'end_date_time' => 'datetime',
            'registration_deadline' => 'datetime',
            'status' => StatusEvent::class,
            'moderation_status' => ModerationEvent::class
        ];
    }

    public function scopePublished(Builder $query)
    {
        return $query->where('status', StatusEvent::PUBLISHED->value)
                    ->where('moderation_status', ModerationEvent::APPROVED->value);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function certificates(): HasManyThrough
    {
        return $this->hasManyThrough(Certificate::class, Registration::class);
    }

    public function confirmedParticipants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, Registration::class)
                                    ->withPivot('status_checkin');
    }
}
