<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->string('row_label');
            $table->integer('number');
            $table->enum('type', ['standard','vip'])->default('standard');
            $table->decimal('price_modifier', 3, 2)->default(1.00);
            $table->timestamp('last_expires_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            // $table->index('blocked_by');
            // $table->index('lock_expires_at');

            $table->unique(['room_id', 'row_label', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
