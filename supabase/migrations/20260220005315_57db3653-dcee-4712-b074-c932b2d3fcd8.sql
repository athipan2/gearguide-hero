-- Add images column (JSONB array of URLs) to reviews table
ALTER TABLE public.reviews ADD COLUMN images jsonb NOT NULL DEFAULT '[]'::jsonb;