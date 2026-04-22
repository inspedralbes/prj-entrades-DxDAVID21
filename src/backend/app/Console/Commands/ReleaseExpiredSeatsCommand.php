<?php

namespace App\Console\Commands;

use App\Models\SessionSeat;
use Illuminate\Console\Command;

class ReleaseExpiredSeatsCommand extends Command
{
    protected $signature = 'seats:release-expired';
    protected $description = 'Release seats that have expired their blocking time';

    public function handle(): int
    {
        $this->info('Checking for expired seat reservations...');

        $expiredSeats = SessionSeat::where('status', 'blocked')
            ->whereNotNull('lock_expires_at')
            ->where('lock_expires_at', '<', now())
            ->get();

        if ($expiredSeats->isEmpty()) {
            $this->info('No expired seats found.');
            return Command::SUCCESS;
        }

        $count = $expiredSeats->count();
        $this->info("Found {$count} expired seat(s).");

        foreach ($expiredSeats as $seat) {
            $seat->update([
                'status' => 'available',
                'blocked_by' => null,
                'blocked_at' => null,
                'lock_expires_at' => null,
            ]);

            $this->line("Released seat ID: {$seat->id} (Session: {$seat->session_id})");
        }

        $this->info('Expired seats have been released successfully.');

        return Command::SUCCESS;
    }
}