-- ==============================================================================
-- ShopSphere Supabase PostgreSQL Schema
-- CodeAlpha Task 1: Simple E-Commerce Store
-- ==============================================================================

-- Enable UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Table: user_profiles
-- Stores extended user profile data linked to Clerk user ID
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. Table: orders
-- Stores customer orders with shipping and totals
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) DEFAULT 0.00,
  shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'credit_card',
  shipping_details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. Table: order_items
-- Stores line items for each order
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- Indexes for Fast Query Performance
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON public.user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_clerk_id ON public.orders(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) & Access Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if recreating
DROP POLICY IF EXISTS "Public access to user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Public access to orders" ON public.orders;
DROP POLICY IF EXISTS "Public access to order_items" ON public.order_items;

-- Full CRUD Access Policies for Anon / Authenticated / Service Role API Keys
CREATE POLICY "Public access to user_profiles" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public access to orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public access to order_items" ON public.order_items
  FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- Sample Demo Order Seed (Optional)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  demo_order_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.orders WHERE clerk_user_id = 'user_demo_codealpha') THEN
    INSERT INTO public.orders (clerk_user_id, total_amount, subtotal, tax, shipping_fee, discount, status, payment_method, shipping_details)
    VALUES (
      'user_demo_codealpha',
      324.98,
      299.99,
      24.99,
      0.00,
      0.00,
      'delivered',
      'credit_card',
      '{"fullName": "Alex Morgan", "email": "alex.morgan@example.com", "address": "742 Evergreen Terrace", "city": "Springfield", "state": "OR", "postalCode": "97477", "country": "United States"}'::jsonb
    )
    RETURNING id INTO demo_order_id;

    INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image_url)
    VALUES
      (demo_order_id, '1', 'Hydrating Facial Moisturizer', 20.00, 1, 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/facial-moisturizer.jpg'),
      (demo_order_id, '2', 'Soothing Body Lotion', 15.00, 2, 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/body-lotion.jpg');
  END IF;
END $$;
