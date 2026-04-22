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
        'file_path',
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
