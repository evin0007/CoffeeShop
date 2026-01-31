<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $randomCode = Str::upper(Str::random(10));
        $newPrice = $request->total_price ?? 0;

        $data = [
            'code' => $request->code,
            'staff' => $request->staff,
            'all_order' => $request->all_order,
            'total_price' => $newPrice,
            'status' => $request->status,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        $inserted = DB::table('order_list')->insert($data);

        if ($inserted) {
            $today = date('Y-m-d');
            $existingRecord = DB::table('daily_record')
                ->whereDate('created_at', $today)
                ->first();

            if ($existingRecord) {
                DB::table('daily_record')
                    ->where('id', $existingRecord->id)
                    ->update([
                        'total_price' => (float) $existingRecord->total_price + (float) $newPrice,
                        'quantity' => (int) $existingRecord->quantity + 1,
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('daily_record')->insert([
                    'total_price' => (float) $newPrice,
                    'quantity' => 1,
                    'code' => $randomCode,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Order successfully inserted',
                'code' => $randomCode,
            ], 201);
        }

        return response()->json(['message' => 'Error inserting order'], 500);
    }
}
