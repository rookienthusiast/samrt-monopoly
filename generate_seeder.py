import pandas as pd
import json

file_path = 'Peta Boardgame.xlsx'
output_seeder_path = 'database/seeders/PropertySeeder.php'

def parse_money(value):
    if pd.isna(value) or value == '-':
        return 0
    
    s = str(value).lower().replace('rp', '').replace('.', '').replace(',', '.').strip()
    multiplier = 1
    
    if 'jt' in s or 'juta' in s:
        multiplier = 1_000_000
        s = s.replace('jt', '').replace('juta', '')
    elif 'm' in s or 'miliar' in s:
        multiplier = 1_000_000_000
        s = s.replace('m', '').replace('miliar', '')
        
    # Handle ranges "300 - 500" -> Take average or min? Let's take max for safety or average.
    # For a game, definitive values are better. Let's take the first value if range.
    if '-' in s:
        parts = s.split('-')
        s = parts[0].strip() # Take minimum cost
        
    try:
        return float(s) * multiplier
    except:
        return 0

def generate_seeder():
    xl = pd.ExcelFile(file_path)
    
    properties = []
    
    # 1. Parse HOTEL BUDGET
    if '1 (hotel budget)' in xl.sheet_names:
        df = xl.parse('1 (hotel budget)')
        # Hardcoding extraction based on known structure/analysis
        prop = {
            'name': 'Hotel Budget',
            'slug': 'hotel-budget',
            'type': 'commercial',
            'base_price': 2_500_000_000, # L0 Value estimate
            'levels': [
                {'level': 1, 'cost': 300_000_000, 'risk_fraud': 0, 'sdg': 0},
                {'level': 2, 'cost': 500_000_000, 'risk_fraud': 0, 'sdg': 0},
                {'level': 3, 'cost': 800_000_000, 'risk_fraud': -2, 'sdg': 0},
                {'level': 4, 'cost': 1_200_000_000, 'risk_fraud': 0, 'sdg': 1},
                {'level': 5, 'cost': 1_800_000_000, 'risk_fraud': 0, 'sdg': 0},
            ]
        }
        properties.append(prop)

    # 2. Parse LAUNDRY
    if '37 - Laundry' in xl.sheet_names:
         prop = {
            'name': 'Laundry',
            'slug': 'laundry',
            'type': 'commercial',
            'base_price': 250_000_000, 
            'levels': [
                {'level': 1, 'cost': 50_000_000, 'risk_fraud': 0, 'sdg': 0}, # Guesswork based on scale
                {'level': 2, 'cost': 100_000_000, 'risk_fraud': 0, 'sdg': 0},
                {'level': 3, 'cost': 150_000_000, 'risk_fraud': -1, 'sdg': 0},
            ]
        }
         properties.append(prop)

    # Generate PHP Code
    php_code = """<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $properties = [
"""
    
    for p in properties:
        php_code += "            [\n"
        php_code += f"                'name' => '{p['name']}',\n"
        php_code += f"                'slug' => '{p['slug']}',\n"
        php_code += f"                'type' => '{p['type']}',\n"
        php_code += f"                'base_price' => {p['base_price']},\n"
        php_code += "                'levels' => [\n"
        for l in p['levels']:
             php_code += "                    [\n"
             php_code += f"                        'level' => {l['level']},\n"
             php_code += f"                        'upgrade_cost' => {l['cost']},\n"
             php_code += f"                        'risk_Mitigation_fraud' => {l['risk_fraud']},\n"
             php_code += f"                        'sdg_benefit' => {l['sdg']},\n"
             php_code += "                    ],\n"
        php_code += "                ]\n"
        php_code += "            ],\n"

    php_code += """        ];

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
"""
    
    with open(output_seeder_path, 'w') as f:
        f.write(php_code)
    print(f"Seeder generated at {output_seeder_path}")

try:
    generate_seeder()
except Exception as e:
    print(e)
