-- ============================================================
-- Safe Update Script - Run this in Supabase SQL Editor
-- This handles existing tables/policies gracefully
-- ============================================================

-- Add missing columns to projects (if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'github_url') THEN
    ALTER TABLE public.projects ADD COLUMN github_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'live_url') THEN
    ALTER TABLE public.projects ADD COLUMN live_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'thumbnail') THEN
    ALTER TABLE public.projects ADD COLUMN thumbnail TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'reading_time') THEN
    ALTER TABLE public.projects ADD COLUMN reading_time INTEGER DEFAULT 5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'location') THEN
    ALTER TABLE public.projects ADD COLUMN location TEXT;
  END IF;
END $$;

-- ============================================================
-- FIX RLS POLICIES - Allow anon users to read and write
-- ============================================================

-- JOURNALS: Drop all existing policies and create permissive ones
DROP POLICY IF EXISTS "Public can view published journals" ON public.journals;
DROP POLICY IF EXISTS "Authenticated users can view all journals" ON public.journals;
DROP POLICY IF EXISTS "Authenticated users can insert journals" ON public.journals;
DROP POLICY IF EXISTS "Authenticated users can update journals" ON public.journals;
DROP POLICY IF EXISTS "Authenticated users can delete journals" ON public.journals;
DROP POLICY IF EXISTS "Allow all for service role" ON public.journals;
DROP POLICY IF EXISTS "Anon can do all on journals" ON public.journals;

CREATE POLICY "Allow all on journals"
  ON public.journals
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- PROJECTS: Drop all existing policies and create permissive ones
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Auth can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Auth can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Auth can update projects" ON public.projects;
DROP POLICY IF EXISTS "Auth can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Allow all for projects" ON public.projects;
DROP POLICY IF EXISTS "Anon can do all on projects" ON public.projects;

CREATE POLICY "Allow all on projects"
  ON public.projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ARTICLES table is no longer used - keeping for reference only
-- Journal content is now in the 'journals' table
-- DROP TABLE IF EXISTS public.articles;

-- ============================================================
-- PUBLISH ALL JOURNALS (so they show on frontend)
-- ============================================================
UPDATE public.journals SET published = true WHERE published = false OR published IS NULL;

-- Verify counts
SELECT 
  'Data counts:' as info,
  (SELECT COUNT(*) FROM public.journals) as journals,
  (SELECT COUNT(*) FROM public.projects) as projects,
  (SELECT COUNT(*) FROM public.journals WHERE published = true) as published_journals;
