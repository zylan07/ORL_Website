-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create authorized_users table
CREATE TABLE IF NOT EXISTS public.authorized_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('super_admin', 'editor', 'viewer')) DEFAULT 'editor',
  status VARCHAR(50) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  auth_user_id UUID UNIQUE, -- linked to auth.users.id on first login
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Administrator
INSERT INTO public.authorized_users (email, full_name, role, status)
VALUES ('zylan6476@gmail.com', 'Initial Administrator', 'super_admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- 2. Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for checking auth status in policies
CREATE OR REPLACE FUNCTION public.is_active_authorized_user()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.authorized_users
    WHERE (auth_user_id = auth.uid() OR email = auth.jwt() ->> 'email')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_active_super_admin()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.authorized_users
    WHERE (auth_user_id = auth.uid() OR email = auth.jwt() ->> 'email')
      AND status = 'active'
      AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql;

-- 4. RLS Policies
-- site_settings
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authorized write site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authorized insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authorized update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authorized delete site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authorized insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_active_authorized_user()) WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized delete site_settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_active_authorized_user());

-- datasets
DROP POLICY IF EXISTS "Public read datasets" ON public.datasets;
DROP POLICY IF EXISTS "Authorized write datasets" ON public.datasets;
DROP POLICY IF EXISTS "Authorized insert datasets" ON public.datasets;
DROP POLICY IF EXISTS "Authorized update datasets" ON public.datasets;
DROP POLICY IF EXISTS "Authorized delete datasets" ON public.datasets;
CREATE POLICY "Public read datasets" ON public.datasets FOR SELECT USING (true);
CREATE POLICY "Authorized insert datasets" ON public.datasets FOR INSERT TO authenticated WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized update datasets" ON public.datasets FOR UPDATE TO authenticated USING (public.is_active_authorized_user()) WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized delete datasets" ON public.datasets FOR DELETE TO authenticated USING (public.is_active_authorized_user());

-- records
DROP POLICY IF EXISTS "Public read records" ON public.records;
DROP POLICY IF EXISTS "Authorized write records" ON public.records;
DROP POLICY IF EXISTS "Authorized insert records" ON public.records;
DROP POLICY IF EXISTS "Authorized update records" ON public.records;
DROP POLICY IF EXISTS "Authorized delete records" ON public.records;
CREATE POLICY "Public read records" ON public.records FOR SELECT USING (true);
CREATE POLICY "Authorized insert records" ON public.records FOR INSERT TO authenticated WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized update records" ON public.records FOR UPDATE TO authenticated USING (public.is_active_authorized_user()) WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized delete records" ON public.records FOR DELETE TO authenticated USING (public.is_active_authorized_user());

-- assets
DROP POLICY IF EXISTS "Public read assets" ON public.assets;
DROP POLICY IF EXISTS "Authorized write assets" ON public.assets;
DROP POLICY IF EXISTS "Authorized insert assets" ON public.assets;
DROP POLICY IF EXISTS "Authorized update assets" ON public.assets;
DROP POLICY IF EXISTS "Authorized delete assets" ON public.assets;
CREATE POLICY "Public read assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Authorized insert assets" ON public.assets FOR INSERT TO authenticated WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized update assets" ON public.assets FOR UPDATE TO authenticated USING (public.is_active_authorized_user()) WITH CHECK (public.is_active_authorized_user());
CREATE POLICY "Authorized delete assets" ON public.assets FOR DELETE TO authenticated USING (public.is_active_authorized_user());

-- authorized_users (Super admin reads all, others read own record only)
DROP POLICY IF EXISTS "Super admin read all authorized_users" ON public.authorized_users;
DROP POLICY IF EXISTS "Users read own authorized_users" ON public.authorized_users;
DROP POLICY IF EXISTS "Super admin modify authorized_users" ON public.authorized_users;
CREATE POLICY "Super admin read all authorized_users" ON public.authorized_users FOR SELECT TO authenticated USING (public.is_active_super_admin());
CREATE POLICY "Users read own authorized_users" ON public.authorized_users FOR SELECT TO authenticated USING (email = auth.jwt() ->> 'email' OR auth_user_id = auth.uid());
CREATE POLICY "Super admin modify authorized_users" ON public.authorized_users FOR ALL TO authenticated USING (public.is_active_super_admin()) WITH CHECK (public.is_active_super_admin());

-- admin_audit_logs
DROP POLICY IF EXISTS "Super admin read logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Authenticated write logs" ON public.admin_audit_logs;
CREATE POLICY "Super admin read logs" ON public.admin_audit_logs FOR SELECT TO authenticated USING (public.is_active_super_admin());
CREATE POLICY "Authenticated write logs" ON public.admin_audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Storage Bucket Policies
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Authorized insert images" ON storage.objects;
DROP POLICY IF EXISTS "Authorized write images" ON storage.objects;
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authorized insert images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images' AND public.is_active_authorized_user());
CREATE POLICY "Authorized write images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'images' AND public.is_active_authorized_user());

DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
DROP POLICY IF EXISTS "Authorized insert documents" ON storage.objects;
DROP POLICY IF EXISTS "Authorized write documents" ON storage.objects;
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Authorized insert documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND public.is_active_authorized_user());
CREATE POLICY "Authorized write documents" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'documents' AND public.is_active_authorized_user());

-- 6. Grant Role Privileges for API Access (fixes 403 errors)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Table-level SELECT access for anonymous and authenticated clients
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;
GRANT SELECT ON TABLE public.datasets TO anon, authenticated;
GRANT SELECT ON TABLE public.records TO anon, authenticated;
GRANT SELECT ON TABLE public.assets TO anon, authenticated;
GRANT SELECT ON TABLE public.authorized_users TO anon, authenticated;

-- Write access for authenticated editors and admins (RLS-guarded)
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.site_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.datasets TO authenticated;
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.records TO authenticated;
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.assets TO authenticated;
GRANT INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.authorized_users TO authenticated;
GRANT INSERT ON TABLE public.admin_audit_logs TO authenticated;
GRANT SELECT, DELETE ON TABLE public.admin_audit_logs TO authenticated;

-- Execute permissions on security functions utilized in policy evaluations
GRANT EXECUTE ON FUNCTION public.is_active_authorized_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_super_admin() TO anon, authenticated;
