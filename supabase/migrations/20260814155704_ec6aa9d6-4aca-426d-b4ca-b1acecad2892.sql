CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.product_status AS ENUM ('draft','published','archived');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  short_description text,
  description text,
  logo_url text,
  icon_url text,
  banner_url text,
  status public.product_status NOT NULL DEFAULT 'draft',
  version text,
  release_date date,
  website_url text,
  apk_url text,
  apkpure_url text,
  play_store_url text,
  github_url text,
  documentation_url text,
  privacy_url text,
  terms_url text,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published products" ON public.products FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_features TO authenticated;
GRANT ALL ON public.product_features TO service_role;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view features of published products" ON public.product_features FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.status = 'published'));
CREATE POLICY "Admins manage features" ON public.product_features FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER product_features_updated_at BEFORE UPDATE ON public.product_features FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_screenshots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_screenshots TO authenticated;
GRANT ALL ON public.product_screenshots TO service_role;
ALTER TABLE public.product_screenshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view screenshots of published products" ON public.product_screenshots FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.status = 'published'));
CREATE POLICY "Admins manage screenshots" ON public.product_screenshots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.product_changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  version text NOT NULL,
  title text,
  changes text,
  release_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_changelog TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_changelog TO authenticated;
GRANT ALL ON public.product_changelog TO service_role;
ALTER TABLE public.product_changelog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view changelog of published products" ON public.product_changelog FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.status = 'published'));
CREATE POLICY "Admins manage changelog" ON public.product_changelog FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Bharat Cloud Technologies',
  tagline text,
  description text,
  logo_url text,
  founded_year integer,
  contact_email text,
  instagram_url text,
  youtube_url text,
  github_url text,
  linkedin_url text,
  x_url text,
  website_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send an enquiry" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read enquiries" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete enquiries" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.site_settings (company_name, tagline, description, founded_year)
VALUES ('Bharat Cloud Technologies','Innovate. Develop. Automate. Empower.','Building useful technology from India.',2020);

INSERT INTO public.products (name, slug, category, short_description, description, status, display_order, is_featured)
VALUES
('Prompt Verse','prompt-verse','AI Creative Tools','A creative platform for discovering and working with useful AI image-generation prompts and creative ideas.','A creative platform for discovering and working with useful AI image-generation prompts and creative ideas.','published',1,true),
('TubePilot','tubepilot','Creator Automation','A content automation platform designed to help creators manage, upload and schedule large volumes of YouTube videos efficiently.','A content automation platform designed to help creators manage, upload and schedule large volumes of YouTube videos efficiently.','published',2,true),
('Nexa Browser','nexa-browser','Browser / Productivity','A lightweight and practical browser designed for a simple and convenient everyday browsing experience.','A lightweight and practical browser designed for a simple and convenient everyday browsing experience.','published',3,true);