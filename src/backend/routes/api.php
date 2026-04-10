<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/api/auth/register', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/api/auth/login', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/api/auth/logout', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('api/auth/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Movies (admin)
Route::get('/api/admin/movies', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/api/admin/movies', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/api/admin/movies/{id}', function (Request $request, $id) {
    return $request->user();
})->middleware('auth:sanctum');
