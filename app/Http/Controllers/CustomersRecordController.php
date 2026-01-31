<?php

namespace App\Http\Controllers;

use App\Models\TransferOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CustomersRecordController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = TransferOrder::orderBy('id', 'desc')->get();

        return response()->json($orders);
    }

    public function destroy($id): JsonResponse
    {
        $order = TransferOrder::findOrFail($id);
        $orderDate = date('Y-m-d', strtotime($order->created_at));
        DB::transaction(function () use ($order, $orderDate) {
            $dailyRecord = DB::table('daily_record')
                ->whereDate('created_at', $orderDate)
                ->first();
            if ($dailyRecord) {
                DB::table('daily_record')
                    ->where('id', $dailyRecord->id)
                    ->update([
                        'total_price' => $dailyRecord->total_price - $order->total_price,
                        'quantity' => $dailyRecord->quantity - 1,
                    ]);
            }
            $order->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Order deleted. Daily price and quantity updated.',
        ]);
    }
}
