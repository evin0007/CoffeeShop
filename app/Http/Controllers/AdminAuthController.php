<?php

namespace App\Http\Controllers;

use App\Models\AdminAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $fields = $request->validate([
            'corporate_email' => 'required|email',
            'password' => 'required',
        ]);

        // Fixed: Use 'corporate_email' to match the validated field
        $admin = AdminAccount::where('corporate_email', $fields['corporate_email'])->first();

        if (! $admin || ! Hash::check($fields['password'], $admin->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'user' => $admin,
        ], 200);
    }
}
