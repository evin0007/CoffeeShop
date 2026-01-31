<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Products::all());
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'product_name' => 'required|string',
                'price' => 'required|numeric',
                'notes' => 'required|string',
                'category' => 'required|string',
                'picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            do {
                $code = Str::upper(Str::random(15));
            } while (Products::where('code', $code)->exists());
            $data['code'] = $code;
            if ($request->hasFile('picture')) {
                $path = $request->file('picture')->store('products', 'public');
                $data['picture'] = $path;
            }
            $data['status'] = 'active';
            $product = Products::create($data);

            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);
        $data = $request->validate([
            'product_name' => 'required|string',
            'price' => 'required|numeric',
            'notes' => 'required|string',
            'status' => 'required|string',
            'category' => 'required|string',
            'picture' => 'nullable',
        ]);
        if ($request->hasFile('picture')) {
            if ($product->picture) {
                Storage::disk('public')->delete($product->picture);
            }
            $data['picture'] = $request->file('picture')->store('products', 'public');
        }
        $product->update($data);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Products::findOrFail($id);
        if ($product->picture) {
            Storage::disk('public')->delete($product->picture);
        }
        $product->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
