-- Create articles table for guides and techniques
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Running Technique', 'Gear Guide', 'Maintenance'
  image_url TEXT,
  excerpt TEXT,
  content TEXT NOT NULL, -- Markdown content
  published BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  content TEXT NOT NULL,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT comment_target CHECK (
    (review_id IS NOT NULL AND article_id IS NULL) OR
    (review_id IS NULL AND article_id IS NOT NULL)
  )
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger for articles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_articles_updated_at') THEN
        CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Policies for articles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Anyone can read published articles') THEN
        CREATE POLICY "Anyone can read published articles" ON public.articles FOR SELECT USING (published = true OR public.is_admin_or_editor(auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Admin/Editor can manage articles') THEN
        CREATE POLICY "Admin/Editor can manage articles" ON public.articles FOR ALL USING (public.is_admin_or_editor(auth.uid()));
    END IF;
END $$;

-- Policies for comments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Anyone can read comments') THEN
        CREATE POLICY "Anyone can read comments" ON public.comments FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Authenticated users can post comments') THEN
        CREATE POLICY "Authenticated users can post comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Users can delete own comments') THEN
        CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id OR public.is_admin_or_editor(auth.uid()));
    END IF;
END $$;

-- Seed some articles
INSERT INTO public.articles (slug, title, category, excerpt, content, published, image_url)
VALUES
('marathon-training-guide', 'คู่มือซ้อมวิ่งมาราธอนฉบับมือใหม่', 'เทคนิคการวิ่ง', 'ก้าวแรกสู่ระยะ 42.195 กม. กับตารางซ้อมที่เข้าใจง่ายและใช้ได้จริง', '# คู่มือซ้อมวิ่งมาราธอน\n\nการวิ่งมาราธอนไม่ใช่เรื่องที่เป็นไปไม่ได้สำหรับคนทั่วไป...', true, 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop'),
('trail-running-for-beginners', 'เริ่มวิ่งเทรลอย่างไรให้ปลอดภัยและสนุก', 'เทคนิคการวิ่ง', 'แนะนำอุปกรณ์พื้นฐานและเทคนิคการวิ่งขึ้น-ลงเขาสำหรับมือใหม่', '# เทคนิคการวิ่งเทรลสำหรับมือใหม่\n\nการวิ่งเทรลแตกต่างจากการวิ่งถนนอย่างมาก...', true, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop')
ON CONFLICT (slug) DO NOTHING;
