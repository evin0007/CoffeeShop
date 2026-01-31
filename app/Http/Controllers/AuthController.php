<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|email',
            'staff_code' => 'required',
        ]);

        $staff = Staff::where('email', $fields['email'])->first();

        if (! $staff || (string) $fields['staff_code'] !== (string) $staff->staff_code) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Email or Staff Code',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'user' => [
                'first_name' => $staff->first_name,
                'last_name' => $staff->last_name,
                'email' => $staff->email,
            ],
        ], 200);
    }
}
