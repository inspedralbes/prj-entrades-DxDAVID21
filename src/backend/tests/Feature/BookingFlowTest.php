<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\Room;
use App\Models\Seat;
use App\Models\MovieSession;
use App\Models\SessionSeat;
use App\Models\User;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $admin;
    protected Movie $movie;
    protected Room $room;
    protected MovieSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
        ]);

        // Create regular user
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        // Create movie
        $this->movie = Movie::create([
            'title' => 'Test Movie',
            'description' => 'A test movie description',
            'duration' => 120,
            'poster_url' => 'https://example.com/poster.jpg',
            'genre' => 'Action',
            'release_date' => now()
        ]);

        // Create room
        $this->room = Room::create([
            'name' => 'Test Room',
            'rows' => 5,
            'seats_per_row' => 8
        ]);

        // Create seats for the room
        for ($row = 1; $row <= 5; $row++) {
            for ($seat = 1; $seat <= 8; $seat++) {
                Seat::create([
                    'room_id' => $this->room->id,
                    'row_label' => chr(64 + $row),
                    'number' => $seat,
                    'type' => 'standard',
                    'price_modifier' => 1.0
                ]);
            }
        }

        // Create session
        $this->session = MovieSession::create([
            'movie_id' => $this->movie->id,
            'room_id' => $this->room->id,
            'start_time' => now()->addDays(1),
            'price' => 12.00,
            'end_time'=> now()->addDays(1)->addHours(2),
        ]);

        // Create session seats
        $seats = Seat::where('room_id', $this->room->id)->get();
        foreach ($seats as $seat) {
            SessionSeat::create([
                'session_id' => $this->session->id,
                'seat_id' => $seat->id,
                'status' => 'available'
            ]);
        }
    }

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'user',
            'token'
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@test.com'
        ]);
    }

    public function test_user_can_login(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user',
            'token'
        ]);
    }

    public function test_user_can_block_seats(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/orders/block-seats', [
                'session_id' => $this->session->id,
                'seats_ids' => [1, 2, 3]
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'session_seats',
            'total',
            'expires_at'
        ]);

        // Verify seats are blocked in database
        $this->assertDatabaseHas('sessions_seats', [
            'seat_id' => 1,
            'status' => 'blocked',
            'blocked_by' => $this->user->id
        ]);
    }

    public function test_user_cannot_block_already_blocked_seats(): void
    {
        // Block seats as user 1
        $this->actingAs($this->user)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        // Try to block same seats as user 2
        $user2 = User::create([
            'name' => 'User 2',
            'email' => 'user2@test.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        $response = $this->actingAs($user2)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'message' => 'Some seats are not available'
        ]);
    }

    public function test_user_can_release_blocked_seats(): void
    {
        // Block seats
        $this->actingAs($this->user)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        // Release seats
        $response = $this->actingAs($this->user)->postJson('/api/orders/release-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $response->assertStatus(200);

        // Verify seats are available again
        $this->assertDatabaseHas('sessions_seats', [
            'seat_id' => 1,
            'status' => 'available',
            'blocked_by' => null
        ]);
    }

    public function test_user_can_create_order_after_blocking(): void
    {
        // Block seats
        $this->actingAs($this->user)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        // Create order
        $response = $this->actingAs($this->user)->postJson('/api/orders/create', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'order',
            'expires_at'
        ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'session_id' => $this->session->id,
            'status' => 'PENDING'
        ]);
    }

    public function test_user_can_complete_payment(): void
    {
        // Block seats
        $this->actingAs($this->user)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        // Create order
        $orderResponse = $this->actingAs($this->user)->postJson('/api/orders/create', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $order = $orderResponse->json('order');

        // Simulate payment
        $response = $this->actingAs($this->user)->postJson('/api/orders/simulate-payment', [
            'order_id' => $order['id']
        ]);

        $response->assertStatus(200);

        // Verify order is completed
        $this->assertDatabaseHas('orders', [
            'id' => $order['id'],
            'status' => 'COMPLETED'
        ]);

        // Verify tickets were created
        $this->assertDatabaseHas('tickets', [
            'order_id' => $order['id']
        ]);

        // Verify seats are marked as purchased
        $this->assertDatabaseHas('sessions_seats', [
            'seat_id' => 1,
            'status' => 'purchased'
        ]);
    }

    public function test_concurrency_two_users_cannot_buy_same_seat(): void
    {
        // User 1 blocks seats
        $this->actingAs($this->user)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        // User 1 creates order
        $orderResponse = $this->actingAs($this->user)->postJson('/api/orders/create', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $order = $orderResponse->json('order');

        // User 1 completes payment
        $paymentResponse = $this->actingAs($this->user)->postJson('/api/orders/simulate-payment', [
            'order_id' => $order['id']
        ]);

        $paymentResponse->assertStatus(200);

        // Create user 2
        $user2 = User::create([
            'name' => 'User 2',
            'email' => 'user2@test.com',
            'password' => bcrypt('password123'),
            'role' => 'user'
        ]);

        // User 2 tries to block already purchased seats - should fail
        $response = $this->actingAs($user2)->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'message' => 'Some seats are not available'
        ]);

        // Verify seats are still purchased by user 1
        $this->assertDatabaseHas('sessions_seats', [
            'seat_id' => 1,
            'status' => 'purchased'
        ]);
    }

    public function test_unauthenticated_user_cannot_block_seats(): void
    {
        $response = $this->postJson('/api/orders/block-seats', [
            'session_id' => $this->session->id,
            'seats_ids' => [1, 2]
        ]);

        $response->assertStatus(401);
    }

    public function test_expired_seats_are_released(): void
    {
        // Block seats with past expiration
        $sessionSeat = SessionSeat::where('seat_id', 1)->first();
        $sessionSeat->update([
            'status' => 'blocked',
            'blocked_by' => $this->user->id,
            'blocked_at' => now()->subMinutes(20),
            'lock_expires_at' => now()->subMinutes(5)
        ]);

        // Run the release command
        $this->artisan('seats:release-expired');

        // Verify seat is now available
        $sessionSeat->refresh();
        $this->assertEquals('available', $sessionSeat->status);
        $this->assertNull($sessionSeat->blocked_by);
    }
}