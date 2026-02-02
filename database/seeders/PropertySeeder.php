<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $properties = [
            [
                'name' => 'Hotel Budget',
                'slug' => 'hotel-budget',
                'type' => 'commercial',
                'base_price' => 2500000000,
                'levels' => [
                    [
                        'level' => 1,
                        'upgrade_cost' => 300000000,
                        'risk_Mitigation_fraud' => 0,
                        'sdg_benefit' => 0,
                    ],
                    [
                        'level' => 2,
                        'upgrade_cost' => 500000000,
                        'risk_Mitigation_fraud' => 0,
                        'sdg_benefit' => 0,
                    ],
                    [
                        'level' => 3,
                        'upgrade_cost' => 800000000,
                        'risk_Mitigation_fraud' => -2,
                        'sdg_benefit' => 0,
                    ],
                    [
                        'level' => 4,
                        'upgrade_cost' => 1200000000,
                        'risk_Mitigation_fraud' => 0,
                        'sdg_benefit' => 1,
                    ],
                    [
                        'level' => 5,
                        'upgrade_cost' => 1800000000,
                        'risk_Mitigation_fraud' => 0,
                        'sdg_benefit' => 0,
                    ],
                ]
            ],
            [
                'name' => 'Laundry',
                'slug' => 'laundry',
                'type' => 'commercial',
                'base_price' => 250000000,
                'levels' => [
                    [
                        'level' => 1,
                        'upgrade_cost' => 50000000,
                        'risk_Mitigation_fraud' => 0,
                        'sdg_benefit' => 0,
                    ],
                    [
                        'level' => 2,
                        'upgrade_cost' => 100000000,
                        'risk_Mitigation_fraud' => 0,
                        'sdg_benefit' => 0,
                    ],
                    [
                        'level' => 3,
                        'upgrade_cost' => 150000000,
                        'risk_Mitigation_fraud' => -1,
                        'sdg_benefit' => 0,
                    ],
                ]
            ],
        ];

        foreach ($properties as $propData) {
            $propId = DB::table('properties')->insertGetId([
                'name' => $propData['name'],
                'slug' => $propData['slug'],
                'type' => $propData['type'],
                'base_price' => $propData['base_price'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($propData['levels'] as $level) {
                DB::table('property_levels')->insert([
                    'property_id' => $propId,
                    'level' => $level['level'],
                    'upgrade_cost' => $level['upgrade_cost'],
                    'risk_Mitigation_fraud' => $level['risk_Mitigation_fraud'],
                    'sdg_benefit' => $level['sdg_benefit'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
