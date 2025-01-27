<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Console\View\Components\Alert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\Mailer\Exception\TransportException;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\alert;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        try {
            $request->user()->sendEmailVerificationNotification();
            return back()->with('status', 'verification-link-sent');
        } catch (TransportException $e) {
            // Log the error for debugging purposes
            Log::error('Failed to send email verification notification: ' . $e->getMessage());
            // Optionally, you can provide feedback to the user
            return back()->withErrors([
                'email' => 'There was an error sending the verification email. Please try again later.',
            ]);
        }
    }
}
