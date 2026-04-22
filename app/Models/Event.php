<?php

namespace App\Models;

use App\Enums\StatusEvent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'start_date_time',
        'end_date_time',
        'category_id',
        'registration_deadline',
        'speaker',
        'capacity',
        'hours',
        'price',
        'status',
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
            'status' => StatusEvent::class
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('status', StatusEvent::PUBLISHED->value);
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
}
