-- =========================================================================
-- SEED ROLES & PERMISSIONS
-- =========================================================================

INSERT INTO public.roles (name) VALUES 
('super_admin'),
('admin'),
('editor'),
('content_writer'),
('sales'),
('support'),
('client')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.permissions (name) VALUES 
('manage_users'),
('edit_content'),
('manage_blog'),
('manage_marketplace'),
('manage_leads'),
('view_analytics'),
('manage_media'),
('manage_tickets'),
('manage_billing'),
('view_audit_logs')
ON CONFLICT (name) DO NOTHING;

-- Map permissions to roles
-- Super Admin has all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'admin' AND p.name IN (
  'edit_content', 'manage_blog', 'manage_marketplace', 
  'manage_leads', 'view_analytics', 'manage_media', 'manage_tickets', 'manage_billing'
)
ON CONFLICT DO NOTHING;

-- Editor permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'editor' AND p.name IN ('edit_content', 'manage_blog', 'manage_media')
ON CONFLICT DO NOTHING;

-- Content Writer permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'content_writer' AND p.name IN ('manage_blog')
ON CONFLICT DO NOTHING;

-- Sales permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'sales' AND p.name IN ('manage_leads', 'view_analytics')
ON CONFLICT DO NOTHING;

-- Support permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'support' AND p.name IN ('manage_tickets')
ON CONFLICT DO NOTHING;


-- =========================================================================
-- SEED PAGES
-- =========================================================================

INSERT INTO public.pages (title, slug, seo_title, seo_description, seo_keywords) VALUES 
('Home', 'home', 'Spring Web Solutions | Websites, Software & Automation', 'We build premium websites, custom business software, SEO growth strategies, and workflow automations that save time and scale revenue.', 'websites, custom software, business automation, SEO services, local business growth'),
('About Us', 'about', 'About Us | Spring Web Solutions', 'Spring Web Solutions is a digital solution engineering agency. Learn about our mission, vision, values, and work process.', 'software developers, digital agency, automation services, enterprise solutions'),
('Services', 'services', 'Professional Digital Services | Spring Web Solutions', 'Explore our comprehensive digital solutions: Website Development, Custom CRM/ERP Software, AI & Workflow Automations, and technical SEO campaigns.', 'website development, CRM development, custom ERP, AI automations, SEO audits'),
('Industries', 'industries', 'Industries We Serve | Spring Web Solutions', 'Spring Web Solutions supports manufacturing, clinics, education, construction, startups, and services provider businesses with tailored digital integrations.', 'manufacturing software, education portals, real estate web tools, healthcare systems'),
('Pricing', 'pricing', 'Digital Platform Pricing Plans | Spring Web Solutions', 'Flexible Starter, Professional, and Enterprise packages for websites, integrations, software development, and support contracts.', 'software pricing, website costs, support SLAs, custom development quote'),
('Process', 'process', 'Our 8-Step Engineering Process | Spring Web Solutions', 'Our transparent step-by-step workflow: Discovery, Research, Planning, Design, Development, Testing, Launch, and ongoing Support.', 'agile development, product design lifecycle, software testing, website launch')
ON CONFLICT (slug) DO NOTHING;


-- =========================================================================
-- SEED SECTIONS (Landing Content)
-- =========================================================================

-- Home Page Sections
DO $$
DECLARE
  home_id UUID;
BEGIN
  SELECT id INTO home_id FROM public.pages WHERE slug = 'home';
  
  IF home_id IS NOT NULL THEN
    -- Delete any existing sections to avoid duplicates during seeding
    DELETE FROM public.sections WHERE page_id = home_id;
    
    -- Hero Section
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      home_id,
      'hero',
      '{
        "headline": "Helping Businesses Grow Through Websites, Software & Automation",
        "subheadline": "We engineer high-performance business websites, custom software solutions, SEO strategies, and custom integrations that save hundreds of hours, boost organic lead generation, and accelerate revenue growth.",
        "cta_primary_text": "Get Free Consultation",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "Explore Services",
        "cta_secondary_href": "/services"
      }'::jsonb,
      '{
        "padding_top": "py-24",
        "padding_bottom": "py-20",
        "background_type": "obsidian-glow"
      }'::jsonb,
      0
    );

    -- Stats Section
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      home_id,
      'stats',
      '{
        "items": [
          {"value": "250+", "label": "Projects Completed"},
          {"value": "98%", "label": "Client Success Rate"},
          {"value": "40%+", "label": "Average Time Saved"},
          {"value": "99.9%", "label": "Uptime SLA Guarantee"}
        ]
      }'::jsonb,
      '{
        "padding_top": "py-10",
        "padding_bottom": "py-10"
      }'::jsonb,
      1
    );

    -- Services Summary Section
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      home_id,
      'services_summary',
      '{
        "title": "Digital Solutions Built for Long-Term Scalability",
        "subtitle": "We integrate frontend interfaces, backend logic, e-commerce transactions, and CRM analytics into unified platforms.",
        "items": [
          {"title": "Website Development", "desc": "High-speed corporate sites, portfolio layouts, landing channels, and WooCommerce/Shopify architectures.", "href": "/services#web-development"},
          {"title": "Custom Software Development", "desc": "Proprietary CRM, ERP, client dashboards, inventory managers, and custom SaaS infrastructures.", "href": "/services#software-development"},
          {"title": "Business Automation", "desc": "Custom workflow automations, WhatsApp notifications integrations, reporting logs, and API syncs.", "href": "/services#automation"},
          {"title": "Technical SEO", "desc": "Semantic markup mapping, Core Web Vitals optimizations, keyword targets, and ranking audits.", "href": "/services#seo"}
        ]
      }'::jsonb,
      '{
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      2
    );

    -- Testimonials
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      home_id,
      'testimonials_summary',
      '{
        "title": "Delivering Measurable Outcomes for Growing Teams",
        "subtitle": "Read real testimonials from local businesses, manufacturers, and startups who scaled their operations with our code.",
        "items": [
          {
            "quote": "Spring Web Solutions engineered our inventory ERP system. It saved our floor managers 12 hours a week and eliminated data sync errors completely.",
            "author": "Marcus Sterling",
            "company": "Apex Manufacturing",
            "role": "Chief Operations Officer"
          },
          {
            "quote": "Our organic site traffic increased by 140% in six months after their technical SEO overhaul. The page load speed dropped under 1 second.",
            "author": "Dr. Clara Chen",
            "company": "Metropolitan Medical Clinic",
            "role": "Clinic Director"
          }
        ]
      }'::jsonb,
      '{
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      3
    );

    -- Tech Stack
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      home_id,
      'tech_stack',
      '{
        "title": "Our Engineering Ecosystem",
        "subtitle": "We use modern, reliable, and secure tools to build platforms that do not go offline or suffer from bloat.",
        "categories": [
          {"name": "Frontend", "items": ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js"]},
          {"name": "Backend & Database", "items": ["Node.js", "PostgreSQL", "Supabase", "REST & GraphQL APIs"]},
          {"name": "Integrations & SaaS", "items": ["Stripe", "Razorpay", "Twilio (WhatsApp)", "Zapier API", "OpenAI API"]}
        ]
      }'::jsonb,
      '{
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      4
    );

    -- CTA
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      home_id,
      'cta',
      '{
        "title": "Accelerate Your Digital Transformation Today",
        "subtitle": "Book a technical analysis with our solution engineers. We will review your processes, current website, or software idea and provide a concrete action checklist.",
        "cta_primary_text": "Request Consultation",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "Explore Case Studies",
        "cta_secondary_href": "/blog"
      }'::jsonb,
      '{
        "padding_top": "py-20",
        "padding_bottom": "py-20"
      }'::jsonb,
      5
    );
  END IF;
END $$;

-- About Page Sections
DO $$
DECLARE
  about_id UUID;
BEGIN
  SELECT id INTO about_id FROM public.pages WHERE slug = 'about';
  IF about_id IS NOT NULL THEN
    DELETE FROM public.sections WHERE page_id = about_id;
    
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      about_id,
      'hero',
      '{
        "headline": "The Engineering Team Behind Spring Web Solutions",
        "subheadline": "We are solution engineers, architects, and designers who believe that software should be robust, design should be clean, and operations should be automated. We help companies eliminate manual labor and scale customer acquisition.",
        "cta_primary_text": "Meet the Team",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "See Our Technology",
        "cta_secondary_href": "#milestones"
      }'::jsonb,
      '{
        "padding_top": "py-24",
        "padding_bottom": "py-20"
      }'::jsonb,
      0
    );

    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      about_id,
      'stats',
      '{
        "items": [
          {"value": "10+", "label": "Years Experience"},
          {"value": "50M+", "label": "API Operations Processed"},
          {"value": "140%", "label": "Average Client Traffic Boost"},
          {"value": "100%", "label": "On-Time Sprint Deliveries"}
        ]
      }'::jsonb,
      '{
        "id": "milestones",
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      1
    );
  END IF;
END $$;

-- Services Page Sections
DO $$
DECLARE
  services_id UUID;
BEGIN
  SELECT id INTO services_id FROM public.pages WHERE slug = 'services';
  IF services_id IS NOT NULL THEN
    DELETE FROM public.sections WHERE page_id = services_id;
    
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      services_id,
      'hero',
      '{
        "headline": "End-to-End Solutions for Growing Businesses",
        "subheadline": "We design, build, deploy, and maintain custom applications and websites. We specialize in complex API integrations, database mapping, and conversion-optimized checkout funnels.",
        "cta_primary_text": "Request a Quote",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "View Pricing",
        "cta_secondary_href": "/pricing"
      }'::jsonb,
      '{
        "padding_top": "py-24",
        "padding_bottom": "py-20"
      }'::jsonb,
      0
    );

    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      services_id,
      'services_summary',
      '{
        "title": "Our Services Spectrum",
        "subtitle": "High-performance modules designed to elevate your company operations and client conversion rates.",
        "items": [
          {"title": "Website Development", "desc": "High-performance enterprise sites, lightweight landing pages, and interactive product configurators designed to load in milliseconds.", "href": "/contact"},
          {"title": "Custom CRM/ERP Software", "desc": "Centralized client hubs, internal scheduling dashboards, secure client portals, and legacy system API bridges built using secure auth structures.", "href": "/contact"},
          {"title": "API & Webhook Automations", "desc": "Zero-latency data flows connecting Stripe payments, Twilio SMS alerts, Zapier logic paths, and custom SQL reporting logs.", "href": "/contact"},
          {"title": "Search Optimization (SEO)", "desc": "Semantic HTML validation, keyword search intent mapping, schema markups, and PageSpeed audits that drive organic search leads.", "href": "/contact"}
        ]
      }'::jsonb,
      '{
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      1
    );

    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      services_id,
      'cta',
      '{
        "title": "Ready to Automate Your Workflows?",
        "subtitle": "Get a free 30-minute system analysis with our engineers. We will review your processes, find database bottlenecks, and outline a concrete action checklist.",
        "cta_primary_text": "Analyze My Process",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "Read Case Studies",
        "cta_secondary_href": "/blog"
      }'::jsonb,
      '{
        "padding_top": "py-20",
        "padding_bottom": "py-20"
      }'::jsonb,
      2
    );
  END IF;
END $$;

-- Pricing Page Sections
DO $$
DECLARE
  pricing_id UUID;
BEGIN
  SELECT id INTO pricing_id FROM public.pages WHERE slug = 'pricing';
  IF pricing_id IS NOT NULL THEN
    DELETE FROM public.sections WHERE page_id = pricing_id;
    
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      pricing_id,
      'hero',
      '{
        "headline": "Flexible Solutions for Any Stage of Growth",
        "subheadline": "Choose from our starter setups, dedicated custom software project packages, or ongoing maintenance support contracts designed to keep your servers secure.",
        "cta_primary_text": "Contact Solutions Engineer",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "Read FAQs",
        "cta_secondary_href": "/kb"
      }'::jsonb,
      '{
        "padding_top": "py-24",
        "padding_bottom": "py-20"
      }'::jsonb,
      0
    );

    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      pricing_id,
      'stats',
      '{
        "items": [
          {"value": "100%", "label": "No Lock-ins"},
          {"value": "Scope", "label": "Clear Deadlines"},
          {"value": "99.9%", "label": "Uptime Guarantee"},
          {"value": "SLA", "label": "Dedicated Support"}
        ]
      }'::jsonb,
      '{
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      1
    );

    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      pricing_id,
      'cta',
      '{
        "title": "Need a Custom Integration Quote?",
        "subtitle": "If your project requires bespoke data structures, custom user levels, or integrations with third-party software, contact our Solutions Architect directly.",
        "cta_primary_text": "Connect with Architect",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "Explore Services",
        "cta_secondary_href": "/services"
      }'::jsonb,
      '{
        "padding_top": "py-20",
        "padding_bottom": "py-20"
      }'::jsonb,
      2
    );
  END IF;
END $$;

-- Process Page Sections
DO $$
DECLARE
  process_id UUID;
BEGIN
  SELECT id INTO process_id FROM public.pages WHERE slug = 'process';
  IF process_id IS NOT NULL THEN
    DELETE FROM public.sections WHERE page_id = process_id;
    
    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      process_id,
      'hero',
      '{
        "headline": "Our Collaborative Engineering Lifecycle",
        "subheadline": "We adhere to a transparent 8-step execution methodology to guarantee that code quality, deadlines, and project requirements are met with precision.",
        "cta_primary_text": "Start Project Discovery",
        "cta_primary_href": "/contact",
        "cta_secondary_text": "Read Blog Insights",
        "cta_secondary_href": "/blog"
      }'::jsonb,
      '{
        "padding_top": "py-24",
        "padding_bottom": "py-20"
      }'::jsonb,
      0
    );

    INSERT INTO public.sections (page_id, type, content, styling, display_order) VALUES (
      process_id,
      'stats',
      '{
        "items": [
          {"value": "Step 1", "label": "Discovery & Scope"},
          {"value": "Step 2", "label": "System Architecture"},
          {"value": "Step 3", "label": "UI/UX Design Wireframes"},
          {"value": "Step 4", "label": "Agile Sprint Development"}
        ]
      }'::jsonb,
      '{
        "padding_top": "py-16",
        "padding_bottom": "py-16"
      }'::jsonb,
      1
    );
  END IF;
END $$;



-- =========================================================================
-- SEED INITIAL SYSTEM SETTINGS
-- =========================================================================

INSERT INTO public.settings (key, value) VALUES 
('site_config', '{
  "company_name": "Spring Web Solutions",
  "tagline": "Building Websites, Software & Automation That Help Businesses Grow",
  "contact_email": "hello@springwebsolutions.in",
  "contact_phone": "+91 80126 22119",
  "address": "Udumalpet, Tamil Nadu",
  "whatsapp_number": "8012622119",
  "social_links": {
    "github": "https://github.com/springwebsolutions"
  }
}'::jsonb),
('navigation', '{
  "header_menu": [
    {"label": "Home", "href": "/"},
    {"label": "About", "href": "/about"},
    {"label": "Services", "href": "/services"},
    {"label": "Pricing", "href": "/pricing"},
    {"label": "Marketplace", "href": "/marketplace"},
    {"label": "Downloads", "href": "/downloads"},
    {"label": "Blog", "href": "/blog"},
    {"label": "Contact", "href": "/contact"}
  ],
  "footer_links": [
    {"heading": "Solutions", "links": [
      {"label": "Website Design", "href": "/services#web"},
      {"label": "SaaS Engineering", "href": "/services#software"},
      {"label": "Workflow Automation", "href": "/services#automation"},
      {"label": "SEO Services", "href": "/services#seo"}
    ]},
    {"heading": "Ecosystem", "links": [
      {"label": "Marketplace Store", "href": "/marketplace"},
      {"label": "Download Software", "href": "/downloads"},
      {"label": "Knowledge Base", "href": "/kb"},
      {"label": "Support Desk", "href": "/support"}
    ]},
    {"heading": "Company", "links": [
      {"label": "Our Agency", "href": "/about"},
      {"label": "Engineering Process", "href": "/process"},
      {"label": "Contact Us", "href": "/contact"},
      {"label": "System Status", "href": "/status"}
    ]}
  ]
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;


-- =========================================================================
-- SEED BLOG CATEGORIES & TAGS
-- =========================================================================

INSERT INTO public.blog_categories (name, slug, description) VALUES 
('Career Guidance', 'career-guidance', 'Guides and roadmaps for aspiring web developers, software engineers, and digital marketers.'),
('Business Growth', 'business-growth', 'Insights on digital transformation, client acquisition, automation benefits, and SEO strategy.'),
('Technology', 'technology', 'Latest trends in AI solutions, web frameworks, developer tools, and scalable software architecture.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_tags (name, slug) VALUES 
('React', 'react'),
('TypeScript', 'typescript'),
('Supabase', 'supabase'),
('AI Automation', 'ai-automation'),
('Technical SEO', 'technical-seo'),
('SaaS Development', 'saas-development'),
('Career Roadmaps', 'career-roadmaps')
ON CONFLICT (slug) DO NOTHING;


-- =========================================================================
-- SEED PRODUCT CATEGORIES
-- =========================================================================

INSERT INTO public.product_categories (name, slug) VALUES 
('SaaS Products', 'saas'),
('Desktop Applications', 'desktop'),
('Chrome Extensions', 'extensions'),
('Website Templates', 'templates'),
('Developer Scripts', 'scripts'),
('Automation Tools', 'automations'),
('E-Books', 'books')
ON CONFLICT (slug) DO NOTHING;


-- =========================================================================
-- SEED SAMPLE PRODUCTS (Real specifications)
-- =========================================================================

INSERT INTO public.products (name, slug, description, short_description, price, is_free, type, status, version) VALUES 
(
  'PriceIQ Browser Extension', 
  'price-iq', 
  'An intelligent browser extension that monitors pricing dynamics across multiple e-commerce platforms, tracks histories, and utilizes automated scraping hooks. Fulfills browser extension requirements.', 
  'Smart browser extension tracking pricing metrics across major web retail networks.', 
  0.00, 
  true, 
  'chrome_extension', 
  'active', 
  '1.0.2'
),
(
  'Spring Web Starter UI Kit', 
  'spring-ui-kit', 
  'A Tailwind CSS and React modular template engineered with clean grid components, obsidian glassmorphism styles, accessible form hooks, and dashboard navigation setups.', 
  'Premium obsidian glassmorphism UI dashboard template built using React and Tailwind.', 
  49.00, 
  false, 
  'ui_kit', 
  'active', 
  '2.1.0'
),
(
  'WhatsApp Leads Dispatcher Script', 
  'whatsapp-dispatcher', 
  'A Python automated workflow script that links to custom webhooks, parses lead JSON entries, and triggers instant client alerts using the Twilio WhatsApp API.', 
  'Instant lead-to-WhatsApp automation script using Python and Twilio notifications.', 
  19.00, 
  false, 
  'script', 
  'active', 
  '1.0.0'
)
ON CONFLICT (slug) DO NOTHING;
