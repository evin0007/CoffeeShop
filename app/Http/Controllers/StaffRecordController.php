<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;

class StaffRecordController extends Controller
{
    public function index()
    {
        return response()->json(Staff::latest()->get());
    }

    // New: Find staff by their unique code
    public function search(Request $request)
    {
        $code = $request->query('code');
        $staff = Staff::where('staff_code', $code)->first();

        if (! $staff) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:staff,email',
            'phone_number' => 'nullable',
            'role' => 'required',
            'gender' => 'nullable',
            'age' => 'nullable|integer',
        ]);

        $validated['staff_code'] = (string) random_int(100000, 999999);
        $staff = Staff::create($validated);

        return response()->json($staff, 201);
    }

    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);
        $staff->update($request->all());

        return response()->json($staff);
    }

    public function destroy($id)
    {
        Staff::destroy($id);

        return response()->json(['message' => 'Deleted']);
    }
}
