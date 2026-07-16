export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  long_description: string;
  category: string;
  target_group: string;
  price_subscription: number;
  price_one_time: number;
  image_url?: string | null;
  badge: string | null;
  is_featured: boolean;
  layers: string[];
  benefits: string[];
  ingredients?: IngredientItem[];
  certifications?: string[];
  images?: string[];
}

export interface IngredientItem {
  name: string;
  amount: string;
  benefit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  type: 'subscription' | 'one_time';
  subscription_months?: number;
}

export interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_name: string;
  order_type: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  onboarding_completed: boolean;
  survey_completed: boolean;
  health_plan_generated: boolean;
}

export interface HealthSurvey {
  age: number;
  gender: string;
  weight_kg: number;
  height_cm: number;
  activity_level: string;
  diet_type: string;
  health_goals: string[];
  health_conditions: string[];
  sleep_hours: number;
  stress_level: number;
  smoking: boolean;
  alcohol_frequency: string;
}

export interface WeeklyCheckin {
  week_number: number;
  energy_level: number;
  sleep_quality: number;
  mood_score: number;
  digestion_score: number;
  overall_score: number;
  notes: string;
  symptoms: string[];
}
