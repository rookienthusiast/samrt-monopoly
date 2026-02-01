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
        // 1. Master Data: Properties (The Board Config)
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // e.g., 'hotel-budget', 'laundry'
            $table->enum('type', ['commercial', 'public_service', 'special'])->default('commercial');
            $table->text('description')->nullable();
            
            // Initial purchase info
            $table->decimal('base_price', 15, 2); // Harga beli tanah/L0
            $table->integer('base_rent_income')->default(0); 
            
            // Coordinate/Position on board (0-40) if needed
            $table->integer('board_position')->nullable();
            
            $table->timestamps();
        });

        // 2. Master Data: Property Upgrades/Fatigue Config (From Excel)
        Schema::create('property_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->integer('level'); // 1-5
            
            $table->decimal('upgrade_cost', 15, 2);
            $table->decimal('revenue_per_turn', 15, 2)->nullable();
            $table->decimal('sell_price', 15, 2)->nullable(); // Forced exit price
            
            // Strategic Effects
            $table->integer('risk_Mitigation_fraud')->default(0); // e.g. -2 Fraud risk
            $table->integer('risk_increase_fatigue')->default(0);
            $table->integer('sdg_benefit')->default(0); // e.g. +1 SDG Score
            
            $table->timestamps();
        });

        // 3. Active Game Sessions
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('waiting'); // waiting, active, completed
            $table->foreignId('host_user_id')->constrained('users');
            $table->foreignId('winner_user_id')->nullable()->constrained('users');
            $table->timestamps();
        });

        // 4. Player State in a specific game
        Schema::create('game_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained();
            
            // Resources
            $table->decimal('cash', 15, 2)->default(500000000); // Start 500jt (from Excel)
            $table->integer('fatigue')->default(0);
            $table->integer('sdg_score')->default(0);
            
            // Risk Tokens (Stored as JSON because types might increase)
            // Example: {"fraud": 1, "ethics": 0, "operational": 2}
            $table->json('risk_tokens')->nullable();
            
            $table->integer('position')->default(0); // 0 = Start
            $table->boolean('is_bankrupt')->default(false);
            
            $table->timestamps();
        });

        // 5. Assets owned by players in a game
        Schema::create('player_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_id')->constrained();
            
            $table->integer('current_level')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_assets');
        Schema::dropIfExists('game_players');
        Schema::dropIfExists('games');
        Schema::dropIfExists('property_levels');
        Schema::dropIfExists('properties');
    }
};
