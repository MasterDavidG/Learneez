<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        // Check if user is authenticated and role matches
        if (Auth::check() && Auth::user()->role === $role) {
            return $next($request);
        }

        return redirect('/')->withErrors(['Unauthorized access.']); // Redirect if unauthorized
    }
}
