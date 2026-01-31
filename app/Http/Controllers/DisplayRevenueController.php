<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DisplayRevenueController extends Controller
{
    public function index(): JsonResponse
    {

        $allRecords = DB::table('daily_record')
            ->orderBy('created_at', 'desc')
            ->get();

        $lastRecord = $allRecords->first();

        return response()->json([
            'latest' => $lastRecord,
            'history' => $allRecords,
        ]);
    }
}
