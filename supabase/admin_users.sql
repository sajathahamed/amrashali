-- Simple admin_users table for login
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow public read (for login check)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for login"
  ON public.admin_users
  FOR SELECT
  USING (true);

-- Insert your admin user
INSERT INTO public.admin_users (email, password, full_name, role)
VALUES ('easytech6727@gmail.com', '123456789', 'Admin', 'admin')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;
