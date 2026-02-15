-- บันทึก: รันคำสั่งนี้ใน Supabase SQL Editor เพื่อแก้ไขปัญหาการเข้าสู่ระบบไม่ได้
-- 1. ยืนยันอีเมลด้วยตนเอง (Force Confirm Email)
-- แก้ไข 'YOUR_EMAIL@example.com' เป็นอีเมลที่คุณต้องการยืนยัน
UPDATE auth.users
SET email_confirmed_at = now(),
    confirmed_at = now(), -- ใส่ทั้งคู่เพื่อความชัวร์ในทุกเวอร์ชัน
    updated_at = now()
WHERE email = 'YOUR_EMAIL@example.com'; -- <--- เปลี่ยนเป็นอีเมลของคุณที่นี่

-- 2. ตรวจสอบและมอบสิทธิ์ Admin
DO $$
DECLARE
  target_user_id UUID;
  target_email TEXT := 'YOUR_EMAIL@example.com'; -- <--- เปลี่ยนเป็นอีเมลของคุณที่นี่
BEGIN
  -- หา ID ของผู้ใช้
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

  IF target_user_id IS NOT NULL THEN
    -- มอบสิทธิ์ Admin ในตาราง user_roles
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- สร้างโปรไฟล์ให้ถ้ายังไม่มี
    INSERT INTO public.profiles (id, display_name, updated_at)
    VALUES (target_user_id, 'Admin', now())
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Setup complete for user: %', target_user_id;
  ELSE
    RAISE NOTICE 'User not found. Please sign up first.';
  END IF;
END $$;

-- 3. ตรวจสอบสิทธิ์การอ่าน Role (RLS Policy)
-- อนุญาตให้ทุกคนที่มี Session สามารถอ่าน Role ของตัวเองได้
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'user_roles' AND policyname = 'Users can view own roles'
    ) THEN
        CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;
