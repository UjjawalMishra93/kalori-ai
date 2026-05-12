-- SQL Schema for Kalori AI Dashboard Features
-- Run this entire script in your Supabase SQL Editor

-- 1. Create the meal_items table to store scanned/logged foods
CREATE TABLE public.meal_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_name text NOT NULL,
  calories integer NOT NULL,
  protein integer NOT NULL,
  carbs integer NOT NULL,
  fats integer NOT NULL,
  confidence integer,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) to ensure users can only see their own meals
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own meal items"
ON public.meal_items
FOR ALL USING (auth.uid() = user_id);

-- 2. Create hydration_logs table for the water tracker widget
CREATE TABLE public.hydration_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_liters numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for hydration
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own hydration logs"
ON public.hydration_logs
FOR ALL USING (auth.uid() = user_id);

-- 3. Create user_stats table to track streaks and total logs
CREATE TABLE public.user_stats (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_log_date date,
  total_meals_logged integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
ON public.user_stats
FOR SELECT USING (auth.uid() = user_id);

-- Note: In a production app, you can use a Database Trigger 
-- to automatically update these stats whenever a meal_item is inserted.
