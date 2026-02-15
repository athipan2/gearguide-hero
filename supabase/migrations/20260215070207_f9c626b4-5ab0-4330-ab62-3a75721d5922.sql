
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table (separate from profiles per security policy)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security definer helper function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- 5. Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT,
  badge TEXT,
  overall_rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  ratings JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  pros JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons JSONB NOT NULL DEFAULT '[]'::jsonb,
  intro TEXT,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  verdict TEXT,
  affiliate_url TEXT,
  cta_text TEXT DEFAULT 'ดูราคาล่าสุด',
  published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 6. Media library table
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- 7. Create storage bucket for review media
INSERT INTO storage.buckets (id, name, public) VALUES ('review-media', 'review-media', true);

-- 8. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles: only admins can manage
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Reviews: public can read published, admin/editor can CRUD
CREATE POLICY "Anyone can read published reviews" ON public.reviews FOR SELECT USING (published = true OR public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can insert reviews" ON public.reviews FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can update reviews" ON public.reviews FOR UPDATE USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can delete reviews" ON public.reviews FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Media library: admin/editor can manage
CREATE POLICY "Admin/Editor can view media" ON public.media_library FOR SELECT USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can upload media" ON public.media_library FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can delete media" ON public.media_library FOR DELETE USING (public.is_admin_or_editor(auth.uid()));

-- Storage policies for review-media bucket
CREATE POLICY "Public can view review media" ON storage.objects FOR SELECT USING (bucket_id = 'review-media');
CREATE POLICY "Admin/Editor can upload review media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-media' AND public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can update review media" ON storage.objects FOR UPDATE USING (bucket_id = 'review-media' AND public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admin/Editor can delete review media" ON storage.objects FOR DELETE USING (bucket_id = 'review-media' AND public.is_admin_or_editor(auth.uid()));
