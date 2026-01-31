<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransferOrderController extends Controller
{
    public function store(Request $request)
    {
        $randomCode = Str::upper(Str::random(10));
        $newPrice = $request->total_price ?? 0;

        $validated = $request->validate([
            'code' => 'required',
            'staff' => 'required',
            'all_order' => 'required',
            'status' => 'required',
            'total_price' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated, $randomCode, $newPrice) {
            $dataToInsert = array_merge($validated, [
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $inserted = DB::table('order_list')->insert($dataToInsert);
            DB::table('online')->where('code', $validated['code'])->delete();

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

            return response()->json(['message' => 'Order successfully transferred!'], 201);
        });
    }
}
