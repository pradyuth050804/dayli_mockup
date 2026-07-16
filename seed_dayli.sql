-- Seed script for DAYLI products

-- 1. Wipe existing products (POSHAN)
DELETE FROM products WHERE id IS NOT NULL;

-- 2. Insert DAYLI products
INSERT INTO products (
    name, slug, tagline, description, long_description, 
    category, target_group, price_monthly, price_one_time, 
    badge, is_featured, is_active, benefits, layers, image_url
) VALUES 
(
    'DAYLI® KIDS', 
    'dayli-kids', 
    'Smarter Growth. Stronger Immunity. Sharper Focus.', 
    'All-In-One Superblend for growing bodies and developing brains.', 
    'Built for growing bodies and developing brains, DAYLI Kids delivers essential protein, fiber, nano vitamins & minerals, postbiotics, electrolytes, and cognitive nutrients in the right balance — not a generic adult mix diluted for children. Precision Nutrients™ engineered for maximum customization, superior biology, cost-effectiveness and sustainability.', 
    'Core Nutrition', 
    'Children (5–14 YRS)', 
    49.00, 
    75.00, 
    'Kids 5–14 YRS', 
    true, 
    true, 
    ARRAY['Height & muscle growth', 'Iron & micronutrient sufficiency', 'Gut health & immunity', 'Brain development & focus', 'Daily energy without sugar spikes'], 
    ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'], 
    '/images/products/dayli_kids.png'
),
(
    'DAYLI® WOMEN', 
    'dayli-women', 
    'Energy That Lasts. Immunity That Protects. Strength That Sustains.', 
    'All-In-One Superblend for women who carry everything — and still show up strong.', 
    'DAYLI Women is engineered for women balancing career, family, stress, and recovery. It combines protein, collagen building blocks, postbiotics, essential micronutrients, and cognitive support compounds. Precision Nutrients™ — modular building blocks of nutrition engineered for maximum customization and superior biology.', 
    'Core Nutrition', 
    'Women (21–50 YRS)', 
    49.00, 
    75.00, 
    'Women 21–50 YRS', 
    true, 
    true, 
    ARRAY['Sustained daily energy', 'Stress & burnout resilience', 'Gut & immunity health', 'Collagen & structural support', 'Cognitive clarity'], 
    ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'], 
    '/images/products/dayli_women.png'
),
(
    'DAYLI® GYM FREAKS', 
    'dayli-gym-freaks', 
    'Build. Recover. Perform. Repeat.', 
    'All-In-One Superblend — not just nutrients, a full performance architecture.', 
    'DAYLI Gym Freaks is a complete daily support system with high-dose protein & fiber, EAAs, BCAAs, electrolytes, nano minerals, postbiotics, and performance compounds. Precision Nutrients™ — modular building blocks of nutrition engineered for maximum customization and superior biology.', 
    'Performance', 
    'Gym Freaks (21–50 YRS)', 
    49.00, 
    75.00, 
    'Gym Freaks 21–50 YRS', 
    true, 
    true, 
    ARRAY['Lean muscle building', 'Recovery & endurance', 'Electrolyte balance', 'Metabolic efficiency', 'Focus & performance'], 
    ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'], 
    '/images/products/dayli_gym_freaks.png'
),
(
    'DAYLI® SENIORS', 
    'dayli-seniors', 
    'Vitality. Resilience. Graceful Strength.', 
    'All-In-One Superblend for active ageing and sustained vitality.', 
    'DAYLI Seniors is precision-formulated for adults 50+ who want to maintain bone density, cognitive sharpness, cardiovascular health, and daily energy. Features bioavailable calcium, vitamin D3/K2, CoQ10, and advanced postbiotics for gut-immune optimization. Precision Nutrients™ engineered for superior biology.', 
    'Core Nutrition', 
    'Seniors (50+)', 
    49.00, 
    75.00, 
    'Seniors 50+', 
    true, 
    true, 
    ARRAY['Bone & joint strength', 'Cardiovascular support', 'Cognitive sharpness', 'Immune resilience', 'Sustained daily energy'], 
    ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'], 
    '/images/products/dayli_seniors.png'
),
(
    'DAYLI® MEN', 
    'dayli-men', 
    'Peak Performance. Total Balance. Everyday Strength.', 
    'All-In-One Superblend for men who demand more from their nutrition.', 
    'DAYLI Men delivers a precision-calibrated stack of protein, performance amino acids, nano minerals, adaptogenic compounds, and gut health support tailored to male biology. Supports testosterone balance, lean mass maintenance, stress resilience, and cardiovascular health. Precision Nutrients™ engineered for superior biology.', 
    'Core Nutrition', 
    'Men (21–50 YRS)', 
    49.00, 
    75.00, 
    'Men 21–50 YRS', 
    true, 
    true, 
    ARRAY['Lean muscle support', 'Hormonal balance', 'Stress & recovery', 'Heart health', 'Mental clarity & focus'], 
    ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'], 
    '/images/products/dayli_men.png'
),
(
    'DAYLI® GIRLS', 
    'dayli-girls', 
    'Confidence. Clarity. Hormone Balance.', 
    'All-In-One Superblend built for stronger bodies and sharper minds during critical years.', 
    'DAYLI Girls is designed for teenage girls navigating growth, hormonal shifts, academic pressure, and lifestyle stress. It supports iron balance, energy metabolism, skin health, gut resilience, and cognitive performance. Precision Nutrients™ — modular building blocks engineered for maximum customization and superior biology.', 
    'Core Nutrition', 
    'Girls (12–20 YRS)', 
    49.00, 
    75.00, 
    'Girls 12–20 YRS', 
    true, 
    true, 
    ARRAY['Iron & hemoglobin balance', 'Hormonal stability', 'Energy & stamina', 'Skin & collagen building', 'Focus & emotional resilience'], 
    ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'], 
    '/images/products/dayli_girls.png'
);
