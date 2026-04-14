<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index()
    {
        return response()->json(Movie::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'poster_url' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'genre' => 'required|string|max:255',
            'release_date' => 'required|date',
        ]);

        $movie = Movie::create($request->all());
        return response()->json($movie, 201);
    }

    public function show($id)
    {
        $movie = Movie::findOrFail($id);

        if (!$movie) {
            return response()->json(['message'=> 'Movie not found'],404);
        }
        return response()->json($movie,200);

    }

    public function update(Request $request, $id)
    {


        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'poster_url' => 'nullable|string',
            'duration' => 'integer|min:1',
            'genre' => 'string|max:255',
            'release_date' => 'date',
        ]);
        $movie = Movie::findOrFail($id);

        if (!$movie) {
            return response()->json(['message'=> 'Movie not found'],404);
        }

        $movie->update($request->all());
        return response()->json($movie);
    }

    public function destroy($id)
    {
        $movie = Movie::findOrFail($id);
        $movie->delete();
        return response()->json(['message' => 'Movie deleted']);
    }
}
