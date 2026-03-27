
-- Add localization and missing functional fields to reviews table
DO $$
BEGIN
    -- Core info translations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'name_en') THEN
        ALTER TABLE public.reviews ADD COLUMN name_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'brand_en') THEN
        ALTER TABLE public.reviews ADD COLUMN brand_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'category_en') THEN
        ALTER TABLE public.reviews ADD COLUMN category_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'badge_en') THEN
        ALTER TABLE public.reviews ADD COLUMN badge_en TEXT;
    END IF;

    -- Long text translations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'intro_en') THEN
        ALTER TABLE public.reviews ADD COLUMN intro_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'verdict_en') THEN
        ALTER TABLE public.reviews ADD COLUMN verdict_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'cta_text_en') THEN
        ALTER TABLE public.reviews ADD COLUMN cta_text_en TEXT DEFAULT 'View Latest Price';
    END IF;

    -- Array/JSONB translations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'pros_en') THEN
        ALTER TABLE public.reviews ADD COLUMN pros_en JSONB DEFAULT '[]'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'cons_en') THEN
        ALTER TABLE public.reviews ADD COLUMN cons_en JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Missing functional fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'shopee_url') THEN
        ALTER TABLE public.reviews ADD COLUMN shopee_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'lazada_url') THEN
        ALTER TABLE public.reviews ADD COLUMN lazada_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'test_conditions') THEN
        ALTER TABLE public.reviews ADD COLUMN test_conditions JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'test_conditions_en') THEN
        ALTER TABLE public.reviews ADD COLUMN test_conditions_en JSONB;
    END IF;
END $$;

-- Add localization to articles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'title_en') THEN
        ALTER TABLE public.articles ADD COLUMN title_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'category_en') THEN
        ALTER TABLE public.articles ADD COLUMN category_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'excerpt_en') THEN
        ALTER TABLE public.articles ADD COLUMN excerpt_en TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'content_en') THEN
        ALTER TABLE public.articles ADD COLUMN content_en TEXT;
    END IF;
END $$;
