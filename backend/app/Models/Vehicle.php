<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    public function vehicle_photos()
    {
        return $this->hasMany(vehicle_photos::class, 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }
}
