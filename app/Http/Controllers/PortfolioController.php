<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class PortfolioController extends Controller
{
    public function home(): View
    {
        return view('home');
    }

    public function admin(): View
    {
        return view('admin');
    }

    public function jsonGenerator(): View
    {
        return view('json-generator');
    }
}
