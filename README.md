# Spring Web Solutions 🚀

Building Websites, Software & Automation That Help Businesses Grow.

**Spring Web Solutions** is a digital solution engineering platform built with **React**, **TypeScript**, **Tailwind CSS v4**, **Vite**, **Supabase**, and **Resend**. It includes a dynamic Page Builder CMS, Lead CRM, Support Desk, Knowledge Base, Digital Product Marketplace, Software Download Vault, and an Admin Management Suite.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Zustand (State Management), React Router v6, React Hook Form, Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Authentication, Storage)
- **Transactional Email Dispatch**: Resend API (`https://api.resend.com/emails`)
- **Build Tool**: Vite 8

---

## ✨ Key Features

- **⚡ Instant 0ms Page Hydration**: Pre-rendered cached layout seeds prevent layout flash or loading delays on page reloads.
- **🎨 Obsidian Dark & Light Mode Engine**: Sleek dark mode palette (`#070a13` background, `#10b981` emerald accent, `#6366f1` indigo secondary) with smooth transitions.
- **📨 Resend Transactional Email Dispatcher**: Integrated email delivery for client contact inquiries, lead alerts, support ticket updates, and verification tests.
- **💼 Admin Control Panel**:
  - **Site Settings**: Manage company details, address, social media handles, and Resend API configurations with live test email verification.
  - **Lead CRM**: View, filter, track status, and export client lead inquiries.
  - **Support Manager**: Assign priorities, manage ticket statuses, and respond to technical support queries.
  - **Content Management**: Manage Blog Articles, Knowledge Base Guides, Marketplace Products, and Media Library.
- **📧 Departmental Email System**:
  - General Inquiries: `hello@springwebsolutions.in`
  - Sales & Pricing: `sales@springwebsolutions.in`
  - Technical Support: `support@springwebsolutions.in`
  - Developer & Integration: `developer@springwebsolutions.in`
  - Careers & Hiring: `careers@springwebsolutions.in`
  - System Admin: `admin@springwebsolutions.in`
- **📍 Physical HQ**: Udumalpet, Tamil Nadu, India (+91 80126 22119)

---

## 📨 Resend Email Integration

Spring Web Solutions connects to **[Resend](https://resend.com)** via `src/lib/emailService.ts` for zero-latency HTML transactional email delivery.

### Configured Capabilities:
- **Lead Notifications**: Automatically formats and dispatches clean HTML lead alerts to `sales@springwebsolutions.in` or custom recipient targets.
- **Connection Verification**: Admin Panel (`SiteSettings.tsx`) includes a **"Send Test Resend Email"** button to verify domain authentication and API key connectivity.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/springwebsolutions/SpringWebSolutions.git
cd SpringWebSolutions
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Resend Email Configuration
VITE_RESEND_API_KEY=re_123456789_abcdefg
VITE_RESEND_FROM_EMAIL=hello@springwebsolutions.in
```

> **Note**: For production deployments on **Vercel**, ensure environment variables start with `VITE_` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_RESEND_API_KEY`).

### 4. Setup Supabase Database

1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Run `supabase/seed.sql` to seed core schema, roles, initial site settings, pages, sections, and default data.

### 5. Run Local Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Production Build & Deployment

### Build for Production

```bash
npm run build
```

The output bundle will be generated inside the `dist/` directory.

### Deploy on Vercel

1. Import the repository into **Vercel**.
2. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RESEND_API_KEY` (optional, can also be configured directly in Admin Panel Site Settings)
3. Click **Deploy**.

---

## 📄 License

Copyright © 2026 Spring Web Solutions. All rights reserved.
