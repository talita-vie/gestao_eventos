<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use SoftDeletes;
    
    protected $table = 'addresses';

    protected $fillable = [
        'street_name',
        'neighborhood',
        'city_name',
        'state',
        'house_number',
        'street_zipcode',
        'complement',
        'reference_point'
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
