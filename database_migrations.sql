-- ==========================================
-- INSTRUCTIONS FOR KUSHAL:
-- ==========================================
-- Do NOT delete your old SQL. 
-- Please open a NEW run window (or a new tab in the Supabase SQL Editor)
-- and paste the following SQL exactly as it is to create the Analytics table.
-- ==========================================

CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid default gen_random_uuid() primary key,
  url_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (good practice)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so the client-side tracker can insert without needing to be logged in)
CREATE POLICY "Allow public insert to page_views" 
ON public.page_views FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow admins to read (this assumes you use the authenticated role for admins)
CREATE POLICY "Allow authenticated read page_views"
ON public.page_views FOR SELECT
TO authenticated
USING (true);
