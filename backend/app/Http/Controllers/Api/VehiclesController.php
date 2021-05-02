<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle_type;
use App\Models\Vehicle_regdate;
use App\Models\Vehicle_gearbox;
use App\Models\Vehicle_fuel;
use App\Models\Vehicle_car_steering;
use App\Models\Vehicle_motorpower;
use App\Models\Vehicle_doors;
use App\Models\Vehicle_features;
use App\Models\Vehicle_carcolor;
use App\Models\Vehicle_exchange;
use App\Models\Vehicle_financial;
use App\Models\Vehicle_cubiccms;
use App\Models\Vehicle;

class VehiclesController extends Controller
{

    protected $user;

    public function __construct()
    {
       $this->user = Auth()->guard('api')->user();
    }

    private function getData()
    {
        return [
            'vehicle_types' => Vehicle_type::all(),
            'regdate' => Vehicle_regdate::orderBy('label', 'ASC'),
            'gearbox' => Vehicle_gearbox::all(),
            'fuel' => Vehicle_fuel::all(),
            'car_steering' => Vehicle_car_steering::all(),
            'motorpower' => Vehicle_motorpower::all(),
            'doors' => Vehicle_doors::all(),
            'features' => Vehicle_features::all(),
            'carcolor' => Vehicle_carcolor::all(),
            'exchange' => Vehicle_exchange::all(),
            'financial' => Vehicle_financial::all(),
            'cubiccms' => Vehicle_cubiccms::all(),
        ];
    }

    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        $vehicle = Vehicle::with('vehicle_photos')
                    ->firstOrCreate([
                        'user_id' => $this->user->id,
                        'status' => 0
                    ]);

        return array_merge(['vehicle' => $vehicle], $vehicle->getData());
    }

    public function show($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
