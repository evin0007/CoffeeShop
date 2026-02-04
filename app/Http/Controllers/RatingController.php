<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function index()
    {
        try {
            $data = Rating::all();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'rate' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        DB::table('rating')->insert([
            'rate' => $request->rate,
            'comment' => $request->comment,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Rating saved successfully!'], 201);
    }

    public function destroy($id)
    {
        try {
            // Delete directly from the 'rating' table
            $deleted = DB::table('rating')->where('id', $id)->delete();

            if ($deleted) {
                return response()->json(['message' => 'Rating deleted successfully'], 200);
            }

            return response()->json(['message' => 'Rating not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
