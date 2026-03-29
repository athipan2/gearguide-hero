-- Run this script in your Supabase SQL Editor to enable multi-language support
-- and fix the issue where Pros/Cons and other fields were not saving.

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS brand_en TEXT,
ADD COLUMN IF NOT EXISTS category_en TEXT,
ADD COLUMN IF NOT EXISTS badge_en TEXT,
ADD COLUMN IF NOT EXISTS intro_en TEXT,
ADD COLUMN IF NOT EXISTS verdict_en TEXT,
ADD COLUMN IF NOT EXISTS cta_text_en TEXT,
ADD COLUMN IF NOT EXISTS pros_en JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cons_en JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS shopee_url TEXT,
ADD COLUMN IF NOT EXISTS lazada_url TEXT,
ADD COLUMN IF NOT EXISTS test_conditions JSONB DEFAULT '{"terrain": "", "weather": "", "distance": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS test_conditions_en JSONB DEFAULT '{"terrain": "", "weather": "", "distance": ""}'::jsonb;

-- Optional: Update existing rows to have empty arrays instead of NULL for the new JSONB columns
UPDATE reviews SET pros_en = '[]'::jsonb WHERE pros_en IS NULL;
UPDATE reviews SET cons_en = '[]'::jsonb WHERE cons_en IS NULL;
UPDATE reviews SET test_conditions = '{"terrain": "", "weather": "", "distance": ""}'::jsonb WHERE test_conditions IS NULL;
UPDATE reviews SET test_conditions_en = '{"terrain": "", "weather": "", "distance": ""}'::jsonb WHERE test_conditions_en IS NULL;
