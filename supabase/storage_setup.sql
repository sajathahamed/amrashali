-- ============================================================
-- Supabase Storage Setup for Image Uploads
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create a public bucket for images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to read images (public bucket)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow anyone to upload images (for admin panel)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to update their uploads
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Allow anyone to delete images
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Verify bucket was created
SELECT id, name, public FROM storage.buckets WHERE id = 'images';
