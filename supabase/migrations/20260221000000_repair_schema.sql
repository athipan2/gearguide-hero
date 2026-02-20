-- Repair migration to ensure schema consistency
-- 1. Ensure 'images' column exists in 'reviews' table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'images'
    ) THEN
        ALTER TABLE public.reviews ADD COLUMN images jsonb NOT NULL DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 2. Resolve 'articles' table column conflict (author_id vs created_by)
DO $$
BEGIN
    -- Check if articles table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN

        -- If author_id exists but created_by doesn't, rename it
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'author_id')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'created_by') THEN
            ALTER TABLE public.articles RENAME COLUMN author_id TO created_by;
        END IF;

        -- If neither exists (unlikely but safe), add created_by
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'created_by') THEN
            ALTER TABLE public.articles ADD COLUMN created_by uuid REFERENCES auth.users(id);
        END IF;

    END IF;
END $$;

-- 3. Refresh the schema cache (PostgREST)
-- Note: This is usually done automatically but mentioning it here for documentation.
-- In some environments, you can call NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload schema';
