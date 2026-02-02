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
        Schema::create('game_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('status')->default('LOBBY'); // LOBBY, PLAYING, FINISHED
            $table->json('players')->nullable(); // Stores array of player objects
            $table->json('board_state')->nullable(); // Stores ownership, houses, etc.
            $table->json('logs')->nullable(); // Stores game logs
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_rooms');
    }
};
