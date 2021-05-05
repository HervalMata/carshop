<?php

namespace App\Models;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $casts = [
        'vehicle_features' => Json::class,
        'vehicle_financial' => Json::class,
    ];

    protected $guarded = ['id'];

    static $rules = [
        'zipCode' => 'required',
        'city' => 'required',
        'uf' => 'required',
        'vehicle_type' => 'required',
        'vehicle_brand' => 'required',
        'vehicle_model' => 'required',
        'vehicle_version' => 'required',
        'vehicle_regdate' => 'required',
        'vehicle_fuel' => 'required',
        'vehicle_price' => 'required',
        'vehicle_photos' => 'exists:vehicle_photos,vehicle_id'
    ];

    protected $fillable = ['user_id', 'tag_id', 'zipCode', 'city',
                'city_url', 'uf', 'uf_url', 'vehicle_type',
                'vehicle_brand', 'vehicle_model', 'vehicle_version',
                'vehicle_regdate', 'vehicle_gearbox', 'vehicle_fuel',
                'vehicle_steering', 'vehicle_motorpower', 'vehicle_doors', 
                'vehicle_color', 'vehicle_cubiccms', 'vehicle_owner',
                'vehicle_mileage', 'vehicle_features', 'vehicle_moto_features',
                'vehicle_financial', 'vehicle_price', 'title', 'description', 'vehicle_photos',
                'status'];


    public function cover()
    {
        return $this->hasOne(Vehicle_photos::class, 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }  
    
    public function vehicle_brand()
    {
        return $this->hasOne(Vehicle_brand::class, 'value', 'vehicle_brand');
    }  

    public function vehicle_color()
    {
        return $this->hasOne(Vehicle_carcolor::class, 'value', 'vehicle_color');
    }  

    public function vehicle_fuel()
    {
        return $this->hasOne(Vehicle_fuel::class, 'value', 'vehicle_fuel');
    }  

    public function vehicle_gearbox()
    {
        return $this->hasOne(Vehicle_gearbox::class, 'value', 'vehicle_gearbox');
    }  

    public function vehicle_model()
    {
        return Vehicle_model::where('value', $this->vehicle_model)
                            ->where('brand_id', $this->vehicle_brand)
                            ->first();
    } 

    public function vehicle_version()
    {
        return Vehicle_version::where('value', $this->vehicle_version)
                            ->where('brand_id', $this->vehicle_brand)
                            ->where('model_id', $this->vehicle_model->value)->first();
    }  

    public function vehicle_photos()
    {
        return $this->hasMany(Vehicle_photos::class, 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }
}
