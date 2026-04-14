<?php

use App\Http\Controllers\Api\Admin\MovieController;
use App\Http\Controllers\Api\Admin\RoomController;
use App\Http\Controllers\Api\Admin\SessionController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\Routing\Loader\Configurator\Routes;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public Routes - Auth
Route::post('/auth/register', [AuthController::class,'register']);
Route::post('/auth/login', [AuthController::class,'login']);

// Protected Routes - Auth
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class,'logout']);
    Route::get('/auth/user', [AuthController::class,'user']);
});

// Admin Routes (auth + admin middleware)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Movie 
    Route::get('/movies', [MovieController::class, 'index']);
    Route::post('/movies', [MovieController::class, 'store']);
    Route::get('/movies/{id}', [MovieController::class,'show']);
    Route::put('/movies/{id}', [MovieController::class,'update']);
    Route::delete('/movies/{id}', [MovieController::class,'destroy']);
    
    // Room Management
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::get('/rooms/{room}', [RoomController::class,'show']);
    Route::put('/rooms/{room}', [RoomController::class,'update']);
    Route::delete('/rooms/{room}', [RoomController::class,'destroy']);

    // Session Management
    Route::get('/sessions', [SessionController::class,'index']);
    Route::post('/sessions', [SessionController::class,'store']);
    Route::get('/sessions/{session}', [SessionController::class,'show']);
    Route::put('/sessions/{session}', [SessionController::class,'update']);
    Route::delete('/sessions/{session}', [SessionController::class,'destroy']);

    // Users
    Route::get('/users', [UserController::class,'index']);
    Route::post('/users', [UserController::class,'store']);
    Route::get('/users/{user}', [UserController::class,'show']);
    Route::put('/users/{user}', [UserController::class,'update']);
    Route::delete('/users/{user}', [UserController::class,'destroy']);
});

// Protected Routes - Orders (auth only)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders/block-seats', [OrderController::class,'blockSeats']);
    Route::post('/orders/release-seats', [OrderController::class,'releaseSeats']);
    Route::post('/orders/create', [OrderController::class,'createOrder']);
    Route::post('/orders/simulate-payment', [OrderController::class,'simulatePayment']);
    Route::get('/orders/my-orders', [OrderController::class,'getUserOrders']);
});
