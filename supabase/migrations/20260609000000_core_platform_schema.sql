-- ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. ROLE-BASED ACCESS CONTROL (RBAC) & PROFILES
-- =========================================================================

CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (name IN ('super_admin', 'admin', 'editor', 'content_writer', 'sales', 'support', 'client'))
);

CREATE TABLE public.permissions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (name IN (
    'manage_users', 'edit_content', 'manage_blog', 
    'manage_marketplace', 'manage_leads', 'view_analytics', 
    'manage_media', 'manage_tickets', 'manage_billing', 'view_audit_logs'
  ))
);

CREATE TABLE public.role_permissions (
  role_id INTEGER REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- =========================================================================
-- 2. HELPER FUNCTIONS FOR ROLE/PERMISSION CHECKS
-- =========================================================================

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1 AND r.name = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super Admin always has all permissions
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1 AND r.name = 'super_admin'
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = $1 AND p.name = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_user_roles_and_permissions(check_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_roles TEXT[];
  v_permissions TEXT[];
  v_result JSONB;
BEGIN
  -- Get user roles
  SELECT array_agg(r.name) INTO v_roles
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = check_user_id;

  -- Get unique permissions linked to these roles (or all if super_admin)
  IF 'super_admin' = ANY(v_roles) THEN
    SELECT array_agg(name) INTO v_permissions FROM public.permissions;
  ELSE
    SELECT array_agg(DISTINCT p.name) INTO v_permissions
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = check_user_id;
  END IF;

  v_result := jsonb_build_object(
    'roles', COALESCE(to_jsonb(v_roles), '[]'::jsonb),
    'permissions', COALESCE(to_jsonb(v_permissions), '[]'::jsonb)
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 3. AUDIT LOGGING
-- =========================================================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_action(
  act_user_id UUID,
  act_action TEXT,
  act_table TEXT,
  act_record TEXT,
  act_old JSONB,
  act_new JSONB,
  act_ip TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data, ip_address)
  VALUES (act_user_id, act_action, act_table, act_record, act_old, act_new, act_ip);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 4. HYBRID CMS & PAGE BUILDER
-- =========================================================================

CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  styling JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 5. TESTIMONIALS & FAQS
-- =========================================================================

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  project_outcome TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- =========================================================================
-- 6. BLOG CMS
-- =========================================================================

CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  reading_time_minutes INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.blog_post_tags (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE public.blog_post_categories (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- =========================================================================
-- 7. PRODUCTS, DOWNLOADS & ECOSYSTEM
-- =========================================================================

CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price NUMERIC(10,2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT true,
  download_url TEXT,
  demo_url TEXT,
  documentation_url TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  type TEXT CHECK (type IN ('saas', 'desktop_app', 'chrome_extension', 'browser_extension', 'template', 'ui_kit', 'ai_tool', 'script', 'ebook', 'resource')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  changelog JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.product_category_mapping (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE public.product_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ip_address TEXT
);

-- =========================================================================
-- 8. E-COMMERCE FOUNDATION
-- =========================================================================

CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0.00,
  total NUMERIC(10,2) NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  gateway TEXT CHECK (gateway IN ('stripe', 'razorpay', 'upi', 'free')),
  gateway_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  gateway TEXT NOT NULL,
  gateway_payment_id TEXT,
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  license_key TEXT UNIQUE NOT NULL,
  max_activations INTEGER DEFAULT 1,
  current_activations INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 9. SAAS INFRASTRUCTURE
-- =========================================================================

CREATE TABLE public.saas_products (
  id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  api_endpoint TEXT,
  webhook_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  billing_interval TEXT CHECK (billing_interval IN ('month', 'year')) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.customer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  gateway_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.customer_subscriptions(id) ON DELETE CASCADE NOT NULL,
  metric_name TEXT NOT NULL,
  usage_value INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.customer_subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  invoice_pdf TEXT,
  status TEXT NOT NULL CHECK (status IN ('paid', 'unpaid', 'failed')),
  billed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 10. SUPPORT DESK
-- =========================================================================

CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.ticket_messages(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 11. KNOWLEDGE BASE
-- =========================================================================

CREATE TABLE public.knowledge_base_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE public.knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.knowledge_base_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 12. MEDIA LIBRARY
-- =========================================================================

CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  folder TEXT DEFAULT 'general',
  category TEXT DEFAULT 'uncategorized',
  tags JSONB DEFAULT '[]'::jsonb,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 13. LEAD CRM
-- =========================================================================

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  type TEXT CHECK (type IN ('contact', 'consultation', 'seo_audit', 'website_audit', 'automation_assessment')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost')),
  budget TEXT,
  timeline TEXT,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.lead_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 14. ANALYTICS
-- =========================================================================

CREATE TABLE public.analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_label TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 15. SETTINGS
-- =========================================================================

CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- =========================================================================
-- 16. TRIGGERS & PROCEDURES
-- =========================================================================

-- Trigger to automatically create a profile entry after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)), 
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign 'client' role by default
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT new.id, id FROM public.roles WHERE name = 'client';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to log database changes dynamically to public.audit_logs
-- Fulfills AUDIT LOGGING requirement
CREATE OR REPLACE FUNCTION public.process_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_action TEXT;
  v_old JSONB := NULL;
  v_new JSONB := NULL;
  v_record_id TEXT;
BEGIN
  -- Extract user ID from Supabase session context if available
  BEGIN
    v_user_id := (auth.uid());
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  IF (TG_OP = 'DELETE') THEN
    v_action := 'DELETE';
    v_old := to_jsonb(OLD);
    v_record_id := COALESCE(v_old->>'id', v_old->>'key', 'unknown');
  ELSIF (TG_OP = 'UPDATE') THEN
    v_action := 'UPDATE';
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_record_id := COALESCE(v_new->>'id', v_new->>'key', 'unknown');
  ELSIF (TG_OP = 'INSERT') THEN
    v_action := 'INSERT';
    v_new := to_jsonb(NEW);
    v_record_id := COALESCE(v_new->>'id', v_new->>'key', 'unknown');
  END IF;

  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (v_user_id, v_action, TG_TABLE_NAME, v_record_id, v_old, v_new);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Audit Log Trigger to crucial tables
CREATE TRIGGER audit_pages_changes AFTER INSERT OR UPDATE OR DELETE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
CREATE TRIGGER audit_sections_changes AFTER INSERT OR UPDATE OR DELETE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
CREATE TRIGGER audit_blog_changes AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
CREATE TRIGGER audit_product_changes AFTER INSERT OR UPDATE OR DELETE ON public.products FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
CREATE TRIGGER audit_leads_changes AFTER INSERT OR UPDATE OR DELETE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
CREATE TRIGGER audit_settings_changes AFTER INSERT OR UPDATE OR DELETE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

-- =========================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_category_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Dynamic profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.has_permission(auth.uid(), 'manage_users'));

-- Dynamic RBAC tables policies (Only administrators can view/manage)
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_permission(auth.uid(), 'manage_users'));
CREATE POLICY "Admins can read roles/permissions" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage roles" ON public.roles FOR ALL USING (public.has_permission(auth.uid(), 'manage_users'));
CREATE POLICY "Admins can read permissions" ON public.permissions FOR SELECT USING (true);

-- Pages / Sections public views (Readable by everyone, editable by content editors)
CREATE POLICY "Pages are readable by everyone" ON public.pages FOR SELECT USING (is_published = true OR public.has_permission(auth.uid(), 'edit_content'));
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (public.has_permission(auth.uid(), 'edit_content'));
CREATE POLICY "Sections are readable by everyone" ON public.sections FOR SELECT USING (is_active = true OR public.has_permission(auth.uid(), 'edit_content'));
CREATE POLICY "Admins can manage sections" ON public.sections FOR ALL USING (public.has_permission(auth.uid(), 'edit_content'));

-- Testimonials & FAQs
CREATE POLICY "Testimonials are readable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (public.has_permission(auth.uid(), 'edit_content'));
CREATE POLICY "FAQs are readable by everyone" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL USING (public.has_permission(auth.uid(), 'edit_content'));

-- Blog posts public view vs edit permissions
CREATE POLICY "Blog posts are readable by everyone" ON public.blog_posts FOR SELECT USING (status = 'published' OR public.has_permission(auth.uid(), 'manage_blog'));
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (public.has_permission(auth.uid(), 'manage_blog'));
CREATE POLICY "Blog metadata readable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog categories" ON public.blog_categories FOR ALL USING (public.has_permission(auth.uid(), 'manage_blog'));
CREATE POLICY "Blog tags readable by everyone" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog tags" ON public.blog_tags FOR ALL USING (public.has_permission(auth.uid(), 'manage_blog'));

-- Products and Download tracking
CREATE POLICY "Products are readable by everyone" ON public.products FOR SELECT USING (status = 'active' OR public.has_permission(auth.uid(), 'manage_marketplace'));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_permission(auth.uid(), 'manage_marketplace'));
CREATE POLICY "Downloads readable by owner or admins" ON public.downloads FOR SELECT USING (auth.uid() = user_id OR public.has_permission(auth.uid(), 'manage_marketplace'));
CREATE POLICY "Anyone can track downloads" ON public.downloads FOR INSERT WITH CHECK (true);

-- E-commerce and Subscriptions policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.has_permission(auth.uid(), 'manage_billing'));
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (public.has_permission(auth.uid(), 'manage_billing'));
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()) OR public.has_permission(auth.uid(), 'manage_billing'));
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (public.has_permission(auth.uid(), 'manage_billing'));
CREATE POLICY "Users can view their licenses" ON public.licenses FOR SELECT USING (auth.uid() = user_id OR public.has_permission(auth.uid(), 'manage_billing'));
CREATE POLICY "Admins can manage licenses" ON public.licenses FOR ALL USING (public.has_permission(auth.uid(), 'manage_billing'));

-- Support Tickets
CREATE POLICY "Users can view their own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id OR public.has_permission(auth.uid(), 'manage_tickets'));
CREATE POLICY "Users can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tickets" ON public.tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage tickets" ON public.tickets FOR ALL USING (public.has_permission(auth.uid(), 'manage_tickets'));
CREATE POLICY "Ticket messages visible to participants" ON public.ticket_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND user_id = auth.uid()) OR public.has_permission(auth.uid(), 'manage_tickets')
);
CREATE POLICY "Users can post to their tickets" ON public.ticket_messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_id AND user_id = auth.uid() AND status != 'closed')
);
CREATE POLICY "Admins can edit ticket messages" ON public.ticket_messages FOR ALL USING (public.has_permission(auth.uid(), 'manage_tickets'));

-- CRM Leads (Sales and admins)
CREATE POLICY "Leads visible to sales or admin" ON public.leads FOR SELECT USING (public.has_permission(auth.uid(), 'manage_leads'));
CREATE POLICY "Leads editable by sales or admin" ON public.leads FOR ALL USING (public.has_permission(auth.uid(), 'manage_leads'));
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Lead notes visible to sales or admin" ON public.lead_notes FOR ALL USING (public.has_permission(auth.uid(), 'manage_leads'));
CREATE POLICY "Lead activities visible to sales or admin" ON public.lead_activities FOR ALL USING (public.has_permission(auth.uid(), 'manage_leads'));
CREATE POLICY "Lead tasks visible to sales or admin" ON public.lead_tasks FOR ALL USING (public.has_permission(auth.uid(), 'manage_leads'));

-- Audit logs (Super admins only)
CREATE POLICY "Audit logs visible to superadmins only" ON public.audit_logs FOR SELECT USING (public.has_permission(auth.uid(), 'view_audit_logs'));

-- Analytics (Admins and marketers)
CREATE POLICY "Pageviews loggable by anyone" ON public.analytics_pageviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Events loggable by anyone" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Analytics visible to admins" ON public.analytics_pageviews FOR SELECT USING (public.has_permission(auth.uid(), 'view_analytics'));
CREATE POLICY "Analytics events visible to admins" ON public.analytics_events FOR SELECT USING (public.has_permission(auth.uid(), 'view_analytics'));

-- Media Library (Content and admin users)
CREATE POLICY "Media visible to everyone" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Admins/Editors can manage media" ON public.media_library FOR ALL USING (public.has_permission(auth.uid(), 'manage_media'));

-- Settings
CREATE POLICY "Settings visible to anyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings editable by admin" ON public.settings FOR ALL USING (public.has_permission(auth.uid(), 'edit_content'));

-- =========================================================================
-- 18. INITIAL SUPER ADMIN BOOTSTRAP RPC
-- =========================================================================

CREATE OR REPLACE FUNCTION public.create_first_super_admin(
  admin_id UUID,
  admin_full_name TEXT,
  admin_company TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_super_admin_role_id INTEGER;
BEGIN
  -- Check if any super admin already exists
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'A Super Administrator already exists in the system.';
  END IF;

  -- Get super_admin role ID
  SELECT id INTO v_super_admin_role_id FROM public.roles WHERE name = 'super_admin';

  -- Link user to super_admin
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (admin_id, v_super_admin_role_id)
  ON CONFLICT DO NOTHING;

  -- Update profile details if they already exist
  UPDATE public.profiles 
  SET full_name = admin_full_name, company = admin_company
  WHERE id = admin_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
