<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {

        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', ['commercial', 'public_service', 'special'])->default('commercial');
            $table->text('description')->nullable();


            $table->decimal('base_price', 15, 2);
            $table->integer('base_rent_income')->default(0);


            $table->integer('board_position')->nullable();

            $table->timestamps();
        });


        Schema::create('property_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->integer('level');

            $table->decimal('upgrade_cost', 15, 2);
            $table->decimal('revenue_per_turn', 15, 2)->nullable();
            $table->decimal('sell_price', 15, 2)->nullable();


            $table->integer('risk_Mitigation_fraud')->default(0);
            $table->integer('risk_increase_fatigue')->default(0);
            $table->integer('sdg_benefit')->default(0);

            $table->timestamps();
        });


        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('waiting');
            $table->foreignId('host_user_id')->constrained('users');
            $table->foreignId('winner_user_id')->nullable()->constrained('users');
            $table->timestamps();
        });


        Schema::create('game_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained();


            $table->decimal('cash', 15, 2)->default(500000000);
            $table->integer('fatigue')->default(0);
            $table->integer('sdg_score')->default(0);



            $table->json('risk_tokens')->nullable();

            $table->integer('position')->default(0);
            $table->boolean('is_bankrupt')->default(false);

            $table->timestamps();
        });


        Schema::create('player_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_player_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_id')->constrained();

            $table->integer('current_level')->default(0);

            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('player_assets');
        Schema::dropIfExists('game_players');
        Schema::dropIfExists('games');
        Schema::dropIfExists('property_levels');
        Schema::dropIfExists('properties');
    }
};
