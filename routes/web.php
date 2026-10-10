<?php

use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'home'])->name('home');
Route::get('/admin', [PortfolioController::class, 'admin'])->name('admin');
Route::get('/json-generator', [PortfolioController::class, 'jsonGenerator'])->name('json-generator');
