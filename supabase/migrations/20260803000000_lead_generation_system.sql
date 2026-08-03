-- ==========================================
-- SpringWeb Lead Generation System Schema (v1.1)
-- ==========================================

-- 1. Businesses Table (Main Lead Store)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_name TEXT,
    category TEXT,
    phone TEXT,
    normalized_phone TEXT,
    email TEXT,
    whatsapp TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    district TEXT,
    state TEXT DEFAULT 'Tamil Nadu',
    country TEXT DEFAULT 'India',
    rating NUMERIC(3,2) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    lead_score INT DEFAULT 0,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
    source TEXT DEFAULT 'Manual Input', -- Google Maps, Directory, Gov Data, CSV Import, Internal DB
    last_scan_date TIMESTAMPTZ,
    dnc_flag BOOLEAN DEFAULT FALSE, -- Do Not Contact / Opt-out flag
    duplicate_flag BOOLEAN DEFAULT FALSE,
    potential_duplicate_of UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    recommended_services TEXT[], -- Array of suggested services
    estimated_value_band TEXT DEFAULT '₹20K - ₹50K', -- ₹20K, ₹50K, ₹100K, ₹250K+
    status TEXT CHECK (status IN ('New', 'Contacted', 'Replied', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost')) DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for phone normalization & deduplication
CREATE INDEX IF NOT EXISTS idx_businesses_normalized_phone ON public.businesses(normalized_phone);
CREATE INDEX IF NOT EXISTS idx_businesses_state ON public.businesses(state);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_lead_score ON public.businesses(lead_score DESC);

-- 2. Website Audit Table
CREATE TABLE IF NOT EXISTS public.website_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    website_exists BOOLEAN DEFAULT TRUE,
    ssl_active BOOLEAN DEFAULT TRUE,
    mobile_friendly BOOLEAN DEFAULT TRUE,
    speed_score INT DEFAULT 85, -- Lighthouse performance score (0-100)
    has_contact_form BOOLEAN DEFAULT TRUE,
    has_whatsapp_button BOOLEAN DEFAULT FALSE,
    has_meta_tags BOOLEAN DEFAULT TRUE,
    has_schema_markup BOOLEAN DEFAULT FALSE,
    broken_links_count INT DEFAULT 0,
    ui_quality_score INT DEFAULT 70,
    raw_audit_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Discovery Jobs Queue Table
CREATE TABLE IF NOT EXISTS public.discovery_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL,
    category TEXT,
    location TEXT,
    country TEXT DEFAULT 'India',
    state TEXT DEFAULT 'Tamil Nadu',
    source TEXT DEFAULT 'Google Maps API',
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    progress INT DEFAULT 0,
    records_found INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Outreach System Log Table
CREATE TABLE IF NOT EXISTS public.outreach (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    channel TEXT CHECK (channel IN ('WhatsApp', 'Email', 'LinkedIn', 'Phone')) DEFAULT 'Email',
    mode TEXT CHECK (mode IN ('Template', 'AI Generated')) DEFAULT 'Template',
    language TEXT CHECK (language IN ('Tamil', 'English')) DEFAULT 'English',
    template_name TEXT,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'delivered', 'failed', 'replied', 'opted_out')) DEFAULT 'sent',
    tokens_used INT DEFAULT 0,
    estimated_cost_inr NUMERIC(8,4) DEFAULT 0,
    model_used TEXT,
    followup_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Usage & Budget Tracker Table
CREATE TABLE IF NOT EXISTS public.ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature TEXT NOT NULL, -- Outreach Draft, Lead Qualification, SEO Audit, Translation
    model TEXT NOT NULL, -- gpt-4o-mini, claude-3-haiku, etc.
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    estimated_cost_inr NUMERIC(8,4) DEFAULT 0,
    user_confirmed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated access to businesses" ON public.businesses FOR ALL USING (true);
CREATE POLICY "Allow authenticated access to website_audit" ON public.website_audit FOR ALL USING (true);
CREATE POLICY "Allow authenticated access to discovery_jobs" ON public.discovery_jobs FOR ALL USING (true);
CREATE POLICY "Allow authenticated access to outreach" ON public.outreach FOR ALL USING (true);
CREATE POLICY "Allow authenticated access to ai_usage" ON public.ai_usage FOR ALL USING (true);
