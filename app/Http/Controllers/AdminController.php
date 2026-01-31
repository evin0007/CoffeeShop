<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // 1. Get current info
    public function getProfile(): JsonResponse
    {
        $admin = DB::table('admin_accounts')->first();

        return response()->json($admin);
    }

    // 2. Unlock with password
    public function verifyPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required', 'password' => 'required']);
        $admin = DB::table('admin_accounts')->where('corporate_email', $request->email)->first();

        if ($admin && Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Unlocked'], 200);
        }

        return response()->json(['message' => 'Invalid password'], 401);
    }

    // 3. Save changes (including optional new password)
    public function updateProfile(Request $request): JsonResponse
    {
        $data = [
            'legal_name' => $request->legal_name,
            'corporate_email' => $request->corporate_email,
            'phone' => $request->phone,
            'primary_hub' => $request->primary_hub,
            'timezone' => $request->timezone,
            'access_level' => $request->access_level,
            'updated_at' => now(),
        ];

        if ($request->filled('new_password')) {
            $data['password'] = Hash::make($request->new_password);
        }

        DB::table('admin_accounts')
            ->where('id', $request->id)
            ->update($data);

        return response()->json(['message' => 'Profile Updated Successfully']);
    }
}
