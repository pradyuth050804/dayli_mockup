import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newProducts = [
    {
        name: 'POSHAN™ GROWING CHAMPS',
        slug: 'poshan-growing-champs',
        tagline: 'Smarter Growth. Stronger Immunity. Sharper Focus.',
        description: 'One daily system. Built for real growth years.',
        long_description: 'Built for growing bodies and developing brains, Poshan Kids delivers essential protein, fiber, nano vitamins & minerals, postbiotics, electrolytes, and cognitive nutrients in the right balance - not a generic adult mix diluted for children.',
        category: 'Core Nutrition',
        target_group: 'Children (5-14yrs)',
        price_monthly: 69.00,
        price_one_time: 82.00,
        price_quarterly: 199.00,
        badge: 'Kids 5-14yrs',
        is_featured: true,
        layers: ['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'],
        benefits: ['Height & muscle growth', 'Iron & micronutrient sufficiency', 'Gut health & immunity', 'Brain development & focus', 'Daily energy without sugar spikes']
    },
    {
        name: 'POSHAN™ TEEN QUEENS',
        slug: 'poshan-teen-queens',
        tagline: 'Confidence. Clarity. Hormone Balance.',
        description: 'Built for stronger bodies and sharper minds during critical years.',
        long_description: 'Poshan Girls is designed for teenage girls navigating growth, hormonal shifts, academic pressure, and lifestyle stress. It supports iron balance, energy metabolism, skin health, gut resilience, and cognitive performance.',
        category: 'Core Nutrition',
        target_group: 'Teen Girls (13-18yrs)',
        price_monthly: 74.00,
        price_one_time: 89.00,
        price_quarterly: 209.00,
        badge: 'Girls 13-18yrs',
        is_featured: true,
        layers: ['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'],
        benefits: ['Iron & hemoglobin balance', 'Hormonal stability', 'Energy & stamina', 'Skin & collagen building', 'Focus & emotional resilience']
    },
    {
        name: 'POSHAN™ MOM STRONG',
        slug: 'poshan-mom-strong',
        tagline: 'Energy That Lasts. Immunity That Protects. Strength That Sustains.',
        description: 'Designed for women who carry everything - and still show up strong.',
        long_description: 'Poshan Moms is engineered for working women balancing career, family, stress, and recovery. It combines protein, collagen building blocks, postbiotics, essential micronutrients, and cognitive support compounds.',
        category: 'Core Nutrition',
        target_group: 'Working Moms',
        price_monthly: 89.00,
        price_one_time: 105.00,
        price_quarterly: 249.00,
        badge: 'For Moms',
        is_featured: true,
        layers: ['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'],
        benefits: ['Sustained daily energy', 'Stress & burnout resilience', 'Gut & immunity health', 'Collagen & structural support', 'Cognitive clarity']
    },
    {
        name: 'POSHAN™ GLP Support',
        slug: 'poshan-glp-support',
        tagline: 'Build. Recover. Perform. Repeat.',
        description: 'Not just nutrients. A full performance architecture.',
        long_description: 'Poshan Macro is a complete daily support system with high-dose protein & fiber, EAAs, BCAAs, electrolytes, nano minerals, postbiotics, and performance compounds.',
        category: 'Metabolic',
        target_group: 'Performance & Recovery',
        price_monthly: 94.00,
        price_one_time: 110.00,
        price_quarterly: 264.00,
        badge: 'Performance',
        is_featured: true,
        layers: ['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'],
        benefits: ['Lean muscle building', 'Recovery & endurance', 'Electrolyte balance', 'Metabolic efficiency', 'Focus & performance']
    }
];

async function updateDb() {
    console.log("Fetching existing products...");
    const { data: existingProducts, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

    if (fetchError) {
        console.error("Error fetching products:", fetchError);
        return;
    }

    // Update exactly the first 4 products
    for (let i = 0; i < 4; i++) {
        if (existingProducts[i]) {
            const { error } = await supabase
                .from('products')
                .update(newProducts[i])
                .eq('id', existingProducts[i].id);

            if (error) console.error("Error updating product", i, error);
            else console.log(`Updated product ${i + 1} to ${newProducts[i].name}`);
        } else {
            const { error } = await supabase
                .from('products')
                .insert(newProducts[i]);
            if (error) console.error("Error inserting product", i, error);
            else console.log(`Inserted new product ${i + 1}: ${newProducts[i].name}`);
        }
    }

    // Make sure other products are not featured
    for (let i = 4; i < existingProducts.length; i++) {
        if (existingProducts[i].is_featured) {
            const { error } = await supabase
                .from('products')
                .update({ is_featured: false })
                .eq('id', existingProducts[i].id);
            if (error) console.error("Error turning off featured for", i, error);
            else console.log(`Set is_featured to false for product ${i + 1}`);
        }
    }

    console.log("Done updating database!");
}

updateDb();
