-- =========================================================================
-- AI-POWERED JOB DISCOVERY ENGINE — Schema Extension
-- Migration: 20260920000000_job_discovery_engine.sql
-- Extends the existing SpringWeb Solutions platform with:
--   1. Discovered Jobs pipeline (scrape → verify → publish)
--   2. Scrape Run audit trail
--   3. Social media card generation tracking
--   4. Job alert subscriptions
-- =========================================================================

-- =========================================================================
-- 1. DISCOVERED JOBS — Raw scraped jobs before admin verification
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.discovered_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source metadata
  source_name TEXT NOT NULL,                    -- 'adzuna', 'remotive', 'jsearch', 'manual'
  source_url TEXT,                              -- Original listing URL
  source_id TEXT,                               -- External platform's unique job ID
  
  -- Raw scraped data (SOURCE FACT — never fabricated)
  raw_title TEXT NOT NULL,
  raw_company TEXT NOT NULL,
  raw_location TEXT,
  raw_salary TEXT,                              -- Exactly as scraped, never modified
  raw_description TEXT,
  raw_requirements JSONB DEFAULT '[]'::jsonb,
  raw_apply_url TEXT,
  
  -- Normalized data for deduplication
  normalized_title TEXT,                        -- Lowercase, trimmed, stopwords removed
  normalized_company TEXT,                      -- Lowercase, trimmed, suffix removed
  fingerprint TEXT UNIQUE,                      -- SHA256(normalized_title + normalized_company + source_url)
  
  -- AI/Rule-based categorization
  ai_summary TEXT,                              -- AI-generated or template summary (labeled AI SUMMARY)
  ai_category TEXT,                             -- Auto-categorized niche (Software Engineering, Marketing, etc.)
  ai_experience_level TEXT,                     -- Parsed from description (Entry Level, Mid Level, Senior, Lead)
  ai_salary_parsed JSONB,                       -- Structured: { min, max, currency, period }
  ai_location_parsed JSONB,                     -- Structured: { country, state, city, is_remote }
  
  -- Verification lifecycle
  status TEXT DEFAULT 'discovered' CHECK (status IN (
    'discovered',       -- Just scraped, pending review
    'verified',         -- Admin confirmed legitimate
    'rejected',         -- Admin rejected (spam, duplicate, etc.)
    'published',        -- Published to public job listings
    'expired'           -- Past expiry date or manually expired
  )),
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  published_job_id TEXT,                        -- Links to job_postings.id when published
  
  -- Timestamps
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_status ON public.discovered_jobs(status);
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_source ON public.discovered_jobs(source_name);
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_fingerprint ON public.discovered_jobs(fingerprint);
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_category ON public.discovered_jobs(ai_category);
CREATE INDEX IF NOT EXISTS idx_discovered_jobs_discovered_at ON public.discovered_jobs(discovered_at DESC);

-- =========================================================================
-- 2. SCRAPE RUNS — Audit trail for each discovery session
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.scrape_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,                    -- Which source was scraped
  query_params JSONB DEFAULT '{}'::jsonb,       -- Search parameters used
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  jobs_found INTEGER DEFAULT 0,                 -- Total jobs returned by API
  jobs_new INTEGER DEFAULT 0,                   -- New unique jobs inserted
  jobs_duplicate INTEGER DEFAULT 0,             -- Fingerprint collisions (skipped)
  jobs_updated INTEGER DEFAULT 0,               -- Existing jobs updated with new data
  error_message TEXT,                           -- Error details if failed
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  triggered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL  -- Admin who triggered
);

CREATE INDEX IF NOT EXISTS idx_scrape_runs_source ON public.scrape_runs(source_name);
CREATE INDEX IF NOT EXISTS idx_scrape_runs_started_at ON public.scrape_runs(started_at DESC);

-- =========================================================================
-- 3. SOCIAL CARDS — Generated image/video content for social publishing
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.social_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.discovered_jobs(id) ON DELETE CASCADE,
  
  -- Platform & format
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'whatsapp', 'telegram')),
  card_type TEXT DEFAULT 'image' CHECK (card_type IN ('image', 'carousel', 'story', 'video')),
  
  -- Card content
  card_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Template config, text overlays, colors, layout
  image_url TEXT,                               -- Generated card image URL (Supabase storage or base64)
  caption TEXT,                                 -- Ready-to-post caption with hashtags
  
  -- Publishing lifecycle
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  publish_error TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_social_cards_job ON public.social_cards(job_id);
CREATE INDEX IF NOT EXISTS idx_social_cards_platform ON public.social_cards(platform);
CREATE INDEX IF NOT EXISTS idx_social_cards_status ON public.social_cards(status);

-- =========================================================================
-- 4. JOB ALERTS — User subscriptions for email notifications
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,                                    -- Subscriber name (optional)
  
  -- Alert preferences
  keywords TEXT[] DEFAULT '{}',                 -- Job title keywords to match
  locations TEXT[] DEFAULT '{}',                -- Location preferences
  job_types TEXT[] DEFAULT '{}',                -- Full-Time, Part-Time, Remote, etc.
  categories TEXT[] DEFAULT '{}',               -- Niche categories
  min_salary TEXT,                              -- Minimum salary filter
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('instant', 'daily', 'weekly')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,            -- Email verified via confirmation link
  verification_token TEXT,
  unsubscribe_token TEXT DEFAULT gen_random_uuid()::text,
  
  -- Tracking
  alerts_sent INTEGER DEFAULT 0,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  last_matched_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_alerts_email ON public.job_alerts(email);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON public.job_alerts(is_active) WHERE is_active = true;

-- Prevent duplicate subscriptions from same email
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_alerts_unique_email ON public.job_alerts(email) WHERE is_active = true;

-- =========================================================================
-- 5. RBAC EXTENSION — Add manage_jobs permission
-- =========================================================================

-- Add 'manage_jobs' permission if not exists
INSERT INTO public.permissions (name) 
VALUES ('manage_jobs') 
ON CONFLICT (name) DO NOTHING;

-- Grant manage_jobs to super_admin and admin roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.roles r, public.permissions p 
WHERE r.name IN ('super_admin', 'admin') AND p.name = 'manage_jobs'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Update permissions CHECK constraint to include new permission
-- Note: If the CHECK constraint prevents insertion, you may need to:
-- ALTER TABLE public.permissions DROP CONSTRAINT permissions_name_check;
-- ALTER TABLE public.permissions ADD CONSTRAINT permissions_name_check CHECK (name IN (..., 'manage_jobs'));

-- =========================================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =========================================================================

ALTER TABLE public.discovered_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- Discovered Jobs: Admins can manage, published ones are publicly readable
CREATE POLICY "Published discovered jobs are publicly readable"
  ON public.discovered_jobs FOR SELECT
  USING (status = 'published' OR public.has_permission(auth.uid(), 'manage_jobs'));

CREATE POLICY "Admins can manage discovered jobs"
  ON public.discovered_jobs FOR ALL
  USING (public.has_permission(auth.uid(), 'manage_jobs'));

-- Scrape Runs: Admin-only
CREATE POLICY "Scrape runs visible to admins"
  ON public.scrape_runs FOR SELECT
  USING (public.has_permission(auth.uid(), 'manage_jobs'));

CREATE POLICY "Admins can manage scrape runs"
  ON public.scrape_runs FOR ALL
  USING (public.has_permission(auth.uid(), 'manage_jobs'));

-- Social Cards: Admin-only management
CREATE POLICY "Social cards visible to admins"
  ON public.social_cards FOR SELECT
  USING (public.has_permission(auth.uid(), 'manage_jobs'));

CREATE POLICY "Admins can manage social cards"
  ON public.social_cards FOR ALL
  USING (public.has_permission(auth.uid(), 'manage_jobs'));

-- Job Alerts: Anyone can subscribe, admins can view all
CREATE POLICY "Anyone can create job alerts"
  ON public.job_alerts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own alerts by email"
  ON public.job_alerts FOR SELECT
  USING (true);  -- Public read needed for unsubscribe links

CREATE POLICY "Users can update their own alerts"
  ON public.job_alerts FOR UPDATE
  USING (true);  -- Unsubscribe token validated in application layer

CREATE POLICY "Admins can manage all alerts"
  ON public.job_alerts FOR ALL
  USING (public.has_permission(auth.uid(), 'manage_jobs'));

-- =========================================================================
-- 7. AUDIT LOG TRIGGERS
-- =========================================================================

CREATE TRIGGER audit_discovered_jobs_changes 
  AFTER INSERT OR UPDATE OR DELETE ON public.discovered_jobs 
  FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_scrape_runs_changes 
  AFTER INSERT OR UPDATE OR DELETE ON public.scrape_runs 
  FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

-- =========================================================================
-- 8. HELPER FUNCTIONS
-- =========================================================================

-- Function to get discovery pipeline statistics
CREATE OR REPLACE FUNCTION public.get_discovery_stats()
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_discovered', (SELECT COUNT(*) FROM public.discovered_jobs),
    'pending_review', (SELECT COUNT(*) FROM public.discovered_jobs WHERE status = 'discovered'),
    'verified', (SELECT COUNT(*) FROM public.discovered_jobs WHERE status = 'verified'),
    'published', (SELECT COUNT(*) FROM public.discovered_jobs WHERE status = 'published'),
    'rejected', (SELECT COUNT(*) FROM public.discovered_jobs WHERE status = 'rejected'),
    'expired', (SELECT COUNT(*) FROM public.discovered_jobs WHERE status = 'expired'),
    'total_scrape_runs', (SELECT COUNT(*) FROM public.scrape_runs),
    'last_scrape_at', (SELECT MAX(started_at) FROM public.scrape_runs),
    'total_alerts', (SELECT COUNT(*) FROM public.job_alerts WHERE is_active = true),
    'total_social_cards', (SELECT COUNT(*) FROM public.social_cards),
    'sources', (SELECT jsonb_agg(DISTINCT source_name) FROM public.discovered_jobs),
    'top_categories', (
      SELECT jsonb_agg(jsonb_build_object('category', ai_category, 'count', cnt))
      FROM (
        SELECT ai_category, COUNT(*) as cnt 
        FROM public.discovered_jobs 
        WHERE ai_category IS NOT NULL 
        GROUP BY ai_category 
        ORDER BY cnt DESC 
        LIMIT 10
      ) sub
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-expire old discovered jobs
CREATE OR REPLACE FUNCTION public.expire_old_discovered_jobs()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.discovered_jobs 
  SET status = 'expired', updated_at = now()
  WHERE status IN ('discovered', 'verified') 
    AND expires_at IS NOT NULL 
    AND expires_at < now();
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
