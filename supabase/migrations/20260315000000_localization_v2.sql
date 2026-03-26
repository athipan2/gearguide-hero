-- Migration to add English localization columns to reviews and articles tables

-- 1. Add columns to 'reviews' table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS name_en text,
ADD COLUMN IF NOT EXISTS category_en text,
ADD COLUMN IF NOT EXISTS price_en text,
ADD COLUMN IF NOT EXISTS badge_en text,
ADD COLUMN IF NOT EXISTS intro_en text,
ADD COLUMN IF NOT EXISTS verdict_en text,
ADD COLUMN IF NOT EXISTS cta_text_en text,
ADD COLUMN IF NOT EXISTS ratings_en jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specs_en jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pros_en jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cons_en jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS test_conditions_en jsonb DEFAULT '{}'::jsonb;

-- 2. Add columns to 'articles' table
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS title_en text,
ADD COLUMN IF NOT EXISTS category_en text,
ADD COLUMN IF NOT EXISTS content_en text,
ADD COLUMN IF NOT EXISTS excerpt_en text;

-- 3. Refresh the schema cache
NOTIFY pgrst, 'reload schema';
