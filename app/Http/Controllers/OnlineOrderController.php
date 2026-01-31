<?php

namespace App\Http\Controllers;

use App\Models\OnlineOrder;
use Illuminate\Http\Request;

class OnlineOrderController extends Controller
{
    public function index()
    {
        return response()->json(OnlineOrder::all());
    }

    public function search(Request $request, $code)
    {
        $order = OnlineOrder::where('code', $code)->first();

        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $firstName = $request->query('first_name', 'Unknown');
        $lastName = $request->query('last_name', 'Staff');

        $order->name = $firstName.' '.$lastName;

        return response()->json($order);
    }
}
