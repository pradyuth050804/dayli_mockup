/*
  # NUTR1L1NK Application Schema

  ## Overview
  Complete schema for the NUTR1L1NK precision nutrition platform.

  ## Tables Created
  1. `products` - Supplement product catalog with categories, pricing, descriptions
  2. `orders` - Customer orders with shipping and payment status
  3. `order_items` - Line items for each order
  4. `user_profiles` - Extended user information beyond auth
  5. `health_surveys` - Demographics and lifestyle survey responses
  6. `biomarker_reports` - Uploaded biomarker/lab report metadata
  7. `health_plans` - AI-generated personalized health plans
  8. `weekly_checkins` - Weekly progress check-in data
  9. `subscriptions` - Active product subscriptions
  10. `waitlist` - Email waitlist signups

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Public read on products
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text,
  description text,
  long_description text,
  category text NOT NULL,
  target_group text,
  price_monthly numeric(10,2) NOT NULL,
  price_one_time numeric(10,2),
  price_quarterly numeric(10,2),
  image_url text,
  badge text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  layers text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  ingredients jsonb DEFAULT '[]',
  certifications text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  guest_email text,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  shipping_amount numeric(10,2) DEFAULT 0,
  payment_status text DEFAULT 'unpaid',
  shipping_name text,
  shipping_address jsonb,
  order_type text DEFAULT 'one_time',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anon can insert guest orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND guest_email IS NOT NULL);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  date_of_birth date,
  gender text,
  phone text,
  avatar_url text,
  onboarding_completed boolean DEFAULT false,
  survey_completed boolean DEFAULT false,
  health_plan_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Health surveys table
CREATE TABLE IF NOT EXISTS health_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age integer,
  gender text,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  activity_level text,
  diet_type text,
  health_goals text[] DEFAULT '{}',
  health_conditions text[] DEFAULT '{}',
  medications text[] DEFAULT '{}',
  sleep_hours numeric(3,1),
  stress_level integer,
  smoking boolean DEFAULT false,
  alcohol_frequency text,
  survey_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own surveys"
  ON health_surveys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys"
  ON health_surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Biomarker reports table
CREATE TABLE IF NOT EXISTS biomarker_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_name text NOT NULL,
  report_type text DEFAULT 'blood_panel',
  upload_date date DEFAULT CURRENT_DATE,
  file_url text,
  parsed_data jsonb DEFAULT '{}',
  risk_scores jsonb DEFAULT '{}',
  processing_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE biomarker_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON biomarker_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON biomarker_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Health plans table
CREATE TABLE IF NOT EXISTS health_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name text DEFAULT 'My Precision Health Plan',
  recommended_products uuid[] DEFAULT '{}',
  plan_data jsonb DEFAULT '{}',
  risk_summary jsonb DEFAULT '{}',
  priority_areas text[] DEFAULT '{}',
  generated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE health_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health plans"
  ON health_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health plans"
  ON health_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Weekly check-ins table
CREATE TABLE IF NOT EXISTS weekly_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  energy_level integer CHECK (energy_level BETWEEN 1 AND 10),
  sleep_quality integer CHECK (sleep_quality BETWEEN 1 AND 10),
  mood_score integer CHECK (mood_score BETWEEN 1 AND 10),
  digestion_score integer CHECK (digestion_score BETWEEN 1 AND 10),
  overall_score integer CHECK (overall_score BETWEEN 1 AND 10),
  notes text,
  symptoms text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkins"
  ON weekly_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON weekly_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  status text DEFAULT 'active',
  frequency text DEFAULT 'monthly',
  next_billing_date date,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  cancelled_at timestamptz
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  interest text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Seed product data
INSERT INTO products (name, slug, tagline, description, long_description, category, target_group, price_monthly, price_one_time, price_quarterly, badge, is_featured, layers, benefits) VALUES
(
  'POSHAN™ GROWING CHAMPS',
  'poshan-growing-champs',
  'Smarter Growth. Stronger Immunity. Sharper Focus.',
  'One daily system. Built for real growth years.',
  'Built for growing bodies and developing brains, Poshan Kids delivers essential protein, fiber, nano vitamins & minerals, postbiotics, electrolytes, and cognitive nutrients in the right balance - not a generic adult mix diluted for children.',
  'Core Nutrition',
  'Children (5-14yrs)',
  69.00,
  82.00,
  199.00,
  'Kids 5-14yrs',
  true,
  ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'],
  ARRAY['Height & muscle growth', 'Iron & micronutrient sufficiency', 'Gut health & immunity', 'Brain development & focus', 'Daily energy without sugar spikes']
),
(
  'POSHAN™ TEEN QUEENS',
  'poshan-teen-queens',
  'Confidence. Clarity. Hormone Balance.',
  'Built for stronger bodies and sharper minds during critical years.',
  'Poshan Girls is designed for teenage girls navigating growth, hormonal shifts, academic pressure, and lifestyle stress. It supports iron balance, energy metabolism, skin health, gut resilience, and cognitive performance.',
  'Core Nutrition',
  'Teen Girls (13-18yrs)',
  74.00,
  89.00,
  209.00,
  'Girls 13-18yrs',
  true,
  ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'],
  ARRAY['Iron & hemoglobin balance', 'Hormonal stability', 'Energy & stamina', 'Skin & collagen building', 'Focus & emotional resilience']
),
(
  'POSHAN™ MOM STRONG',
  'poshan-mom-strong',
  'Energy That Lasts. Immunity That Protects. Strength That Sustains.',
  'Designed for women who carry everything - and still show up strong.',
  'Poshan Moms is engineered for working women balancing career, family, stress, and recovery. It combines protein, collagen building blocks, postbiotics, essential micronutrients, and cognitive support compounds.',
  'Core Nutrition',
  'Working Moms',
  89.00,
  105.00,
  249.00,
  'For Moms',
  true,
  ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'],
  ARRAY['Sustained daily energy', 'Stress & burnout resilience', 'Gut & immunity health', 'Collagen & structural support', 'Cognitive clarity']
),
(
  'POSHAN™ GLP Support',
  'poshan-glp-support',
  'Build. Recover. Perform. Repeat.',
  'Not just nutrients. A full performance architecture.',
  'Poshan Macro is a complete daily support system with high-dose protein & fiber, EAAs, BCAAs, electrolytes, nano minerals, postbiotics, and performance compounds.',
  'Metabolic',
  'Performance & Recovery',
  94.00,
  110.00,
  264.00,
  'Performance',
  true,
  ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'],
  ARRAY['Lean muscle building', 'Recovery & endurance', 'Electrolyte balance', 'Metabolic efficiency', 'Focus & performance']
),
(
  'Senior Vitality',
  'senior-vitality',
  'Healthy Ageing Across All 5 Biological Layers',
  'Anti-ageing precision blend for seniors focusing on muscle maintenance, cognitive health, and joint mobility.',
  'Senior Vitality is engineered for adults 60+ addressing age-related decline across all biological layers. Includes collagen peptides, CoQ10, NAD+ precursors, and probiotics for comprehensive healthy ageing.',
  'Core Nutrition',
  'Senior Citizens (60+)',
  84.00,
  99.00,
  234.00,
  'Healthy Ageing',
  false,
  ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'],
  ARRAY['Muscle Maintenance', 'Joint Mobility', 'Cognitive Health', 'Heart Health', 'Bone Density']
),
(
  'GLP-1 Support',
  'glp1-support',
  'Navigate GLP-1 Treatment with Precision Nutrition',
  'Science-backed blend to counteract nutrient depletion and muscle loss during GLP-1 therapy.',
  'GLP-1 Support is specifically designed for individuals on semaglutide, tirzepatide, or similar GLP-1 receptor agonists. Addresses the known nutritional gaps including protein, B12, magnesium, and digestive enzymes.',
  'Metabolic',
  'GLP-1 Users',
  94.00,
  110.00,
  264.00,
  'Clinically Guided',
  false,
  ARRAY['L2: Micros', 'L3: Amino Acids', 'L4: Biotics', 'L5: Growth Factors'],
  ARRAY['Muscle Preservation', 'Nutrient Replenishment', 'Nausea Relief', 'Gut Support', 'Energy']
),
(
  'Natural GLP-1',
  'natural-glp1',
  'Appetite Control Without the Prescription',
  'Clinically-validated natural alternative to GLP-1 medications for sustainable weight management.',
  'Natural GLP-1 harnesses the power of berberine, GLP-1 stimulating fibers, and metabolic botanicals to naturally regulate appetite, blood sugar, and fat metabolism — without pharmaceutical intervention.',
  'Metabolic',
  'Weight Management',
  84.00,
  99.00,
  234.00,
  'Natural Formula',
  false,
  ARRAY['L1: Macros', 'L2: Micros', 'L3: Amino Acids', 'L4: Biotics'],
  ARRAY['Appetite Control', 'Blood Sugar Balance', 'Fat Metabolism', 'Energy', 'Gut Health']
),
(
  'Lean & Collagen',
  'lean-collagen',
  'Muscle Building & Skin Elasticity Blend',
  'Precision amino acid and collagen matrix for lean muscle development and connective tissue health.',
  'Lean & Collagen combines grass-fed collagen peptides, essential amino acids, and anabolic growth factors to support muscle protein synthesis while improving skin, hair, and joint health simultaneously.',
  'Functional',
  'Active Adults',
  79.00,
  94.00,
  219.00,
  'Dual Action',
  false,
  ARRAY['L1: Macros', 'L3: Amino Acids', 'L5: Growth Factors'],
  ARRAY['Lean Muscle', 'Skin Elasticity', 'Joint Health', 'Hair Strength', 'Recovery']
);
