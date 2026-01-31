<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Online_orderController extends Controller
{
    public function store(Request $request)
    {
        try {
            $orderCode = strtoupper(Str::random(5));

            DB::table('online')->insert([
                'code' => $orderCode,
                'staff' => $request->staff ?? 'Customer App',
                'all_order' => $request->all_order,
                'total_price' => $request->total_price,
                'status' => $request->status,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'code' => $orderCode,
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
