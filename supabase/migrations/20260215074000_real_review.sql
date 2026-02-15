-- 1. Assign admin role to the provided user (terdoomcom1@gmail.com)
-- This migration assumes the user has already signed up via the UI.
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'terdoomcom1@gmail.com';

  IF target_user_id IS NOT NULL THEN
    -- Confirm their email if it's not already
    -- Note: only updating email_confirmed_at as confirmed_at might be a generated column in some versions
    UPDATE auth.users SET email_confirmed_at = now() WHERE id = target_user_id;

    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- 2. Add policy to allow users to view their own roles
-- This is necessary for the front-end to correctly identify the user's role upon login.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'user_roles' AND policyname = 'Users can view own roles'
    ) THEN
        CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Seed a Real Review: Nike Vaporfly 3
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'terdoomcom1@gmail.com';

  -- If admin doesn't exist yet, we still insert the review but without created_by or with a null created_by
  -- However, for a "real" review, having the admin as creator is better.

  INSERT INTO public.reviews (
    slug, name, brand, category, price, overall_rating,
    badge, image_url, intro, verdict, published,
    ratings, specs, pros, cons, sections,
    created_by
  )
  VALUES (
    'nike-vaporfly-3',
    'Nike Vaporfly 3',
    'Nike',
    'Running Shoes',
    '฿8,500',
    4.8,
    'Top Pick',
    'https://fgnhksityeonfnjysicb.supabase.co/storage/v1/object/public/review-media/nike-vaporfly-3.jpg',
    'Nike Vaporfly 3 คือภาคต่อของสุดยอดรองเท้าวิ่งถนนที่ทำมาเพื่อทำลายสถิติโดยเฉพาะ ด้วยการปรับปรุงโครงสร้างพื้นโฟมและหน้าผ้าใหม่ให้ระบายอากาศได้ดีขึ้นและเบากว่าเดิม',
    'หากคุณกำลังมองหาความเร็วสูงสุดในวันแข่งขัน Nike Vaporfly 3 คือหนึ่งในตัวเลือกที่ดีที่สุดในตลาดปัจจุบัน แม้ราคาจะสูงแต่ประสิทธิภาพที่ได้นั้นคุ้มค่าสำหรับนักวิ่งที่ต้องการทำเวลา New PB',
    true,
    '[{"label": "Cushioning", "score": 4.9}, {"label": "Responsiveness", "score": 5.0}, {"label": "Weight", "score": 4.8}, {"label": "Breathability", "score": 4.7}]'::jsonb,
    '[{"label": "Stack Height", "value": "40mm (Heel) / 32mm (Forefoot)"}, {"label": "Drop", "value": "8mm"}, {"label": "Weight", "value": "180g (Size 9US)"}, {"label": "Plate", "value": "Flyplate (Carbon Fiber)"}]'::jsonb,
    '["แรงดีดมหาศาล", "น้ำหนักเบามาก", "ระบายอากาศดีเยี่ยม", "หน้าเท้ากว้างขึ้นกว่ารุ่น 2"]'::jsonb,
    '["ราคาสูง", "ความทนทานของพื้นยางชั้นนอกไม่มากนัก", "เสียงดังเวลาลงเท้า"]'::jsonb,
    '[{"title": "ความรู้สึกแรกสัมผัส", "body": "เมื่อใส่ครั้งแรกจะรู้สึกถึงความนุ่มและเด้งของโฟม ZoomX ที่หนาขึ้นกว่าเดิมเล็กน้อย แต่อยู่ในเกณฑ์ที่ยังมั่นคง"}, {"title": "ประสิทธิภาพการวิ่ง", "body": "ในการทดสอบวิ่งที่ความเร็ว Tempo และ Interval รองเท้าตอบสนองได้ดีมาก ทุกก้าวที่ลงเท้าจะรู้สึกถึงแรงส่งจาก Flyplate อย่างชัดเจน"}]'::jsonb,
    admin_id
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    overall_rating = EXCLUDED.overall_rating,
    badge = EXCLUDED.badge,
    image_url = EXCLUDED.image_url,
    intro = EXCLUDED.intro,
    verdict = EXCLUDED.verdict,
    published = EXCLUDED.published,
    ratings = EXCLUDED.ratings,
    specs = EXCLUDED.specs,
    pros = EXCLUDED.pros,
    cons = EXCLUDED.cons,
    sections = EXCLUDED.sections,
    created_by = COALESCE(EXCLUDED.created_by, reviews.created_by);

  -- 4. Add to Media Library
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.media_library (
      file_name, file_path, file_size, mime_type, uploaded_by
    )
    VALUES (
      'nike-vaporfly-3.jpg',
      'nike-vaporfly-3.jpg',
      150000,
      'image/jpeg',
      admin_id
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
