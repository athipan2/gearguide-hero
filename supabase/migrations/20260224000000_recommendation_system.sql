
-- Add metadata for recommendation system to reviews table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS feeling text CHECK (feeling IN ('soft', 'responsive')),
ADD COLUMN IF NOT EXISTS foot_type text CHECK (foot_type IN ('normal', 'flat')),
ADD COLUMN IF NOT EXISTS suitable_for text[];

-- Add rating to comments table
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS rating integer CHECK (rating >= 1 AND rating <= 5);

-- Update some existing data if possible (optional, but good for testing)
UPDATE public.reviews SET feeling = 'soft', foot_type = 'normal', suitable_for = ARRAY['health', 'marathon'] WHERE slug = 'nike-pegasus-40';
UPDATE public.reviews SET feeling = 'responsive', foot_type = 'flat', suitable_for = ARRAY['marathon', 'road-long'] WHERE slug = 'nike-alphafly-3';
UPDATE public.reviews SET feeling = 'soft', foot_type = 'normal', suitable_for = ARRAY['trail', 'ultra-trail'] WHERE slug = 'hoka-speedgoat-5';
