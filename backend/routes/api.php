<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\VehiclesController;
use App\Http\Controllers\webservice\WebServiceController;
use App\Http\Controllers\Api\Upload\VehicleUploadController;
use App\Http\Controllers\ImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResources([
    'vehicles' => VehiclesController::class
]);

Route::prefix('upload')->group(function () {
    Route::resource('vehicle', VehicleUploadController::class)->only(['store', 'update', 'destroy']);
});

Route::get('/thumb/{path}/{img}', [ImageController::class, 'thumb']);

Route::get('vehicles/{vehicle_type}/brand', [VehiclesController::class, 'brand']);
Route::get('vehicles/{vehicle_type}/{vehicle_brand}/model', [VehiclesController::class, 'model']);
Route::get('vehicles/{vehicle_brand}/{vehicle_model}/version', [VehiclesController::class, 'version']);

Route::prefix('webservice')->group(function () {
    Route::post('cep', [WebServiceController::class, 'cep']);
});

Route::post('/register', [AuthController::class, 'store']);
