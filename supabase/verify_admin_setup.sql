-- 1. Check user status and manually confirm email if needed
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'terdoomcom1@gmail.com';

  IF target_user_id IS NOT NULL THEN
    -- Confirm their email if it's not already
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
        confirmed_at = COALESCE(confirmed_at, now())
    WHERE id = target_user_id;

    RAISE NOTICE 'User found and email confirmed for terdoomcom1@gmail.com';
  ELSE
    RAISE NOTICE 'User terdoomcom1@gmail.com not found. Please sign up first via the UI.';
  END IF;
END $$;

-- 2. Verify and assign Admin role
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'terdoomcom1@gmail.com';

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin role assigned to user ID: %', target_user_id;
  END IF;
END $$;

-- 3. Verify RLS Policy for user_roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'user_roles' AND policyname = 'Users can view own roles'
    ) THEN
        CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Policy "Users can view own roles" created.';
    ELSE
        RAISE NOTICE 'Policy "Users can view own roles" already exists.';
    END IF;
END $$;

-- 4. Final verification queries (Run these to see the results)
-- Check auth status
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email = 'terdoomcom1@gmail.com';

-- Check user roles
SELECT u.email, r.role
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email = 'terdoomcom1@gmail.com';

-- Check RLS policies on user_roles
SELECT policyname, definition
FROM pg_policies
WHERE tablename = 'user_roles';
