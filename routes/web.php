<?php

use Illuminate\Support\Facades\Route;

// Ito ay magsisilbing "catch-all" route
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');
