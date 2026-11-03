-- ============================================================
-- SUPABASE SCHEMA FOR ÉTOILE WEDDING PLANNING & DESIGN STUDIO
-- Execute this script in your Supabase Project's SQL Editor
-- ============================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    business_email TEXT NOT NULL,
    business_phone TEXT NOT NULL,
    business_address TEXT NOT NULL,
    slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
    booking_notice_hours INTEGER NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BUSINESS HOURS TABLE (weekday: 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat)
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weekday INTEGER NOT NULL UNIQUE,
    is_open BOOLEAN NOT NULL DEFAULT true,
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '18:00:00'
);

-- 4. BLOCKED DATES TABLE
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocked_date DATE NOT NULL,
    reason TEXT NOT NULL DEFAULT 'Unavailable',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ADMIN USERS TABLE (contains auth.users id for admin check)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- SERVICES: Anyone can read active services; authenticated admins have full access
CREATE POLICY "Public read active services" ON public.services 
FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin manage services" ON public.services 
FOR ALL USING (auth.role() = 'authenticated');

-- BUSINESS SETTINGS: Public read; Admin edit
CREATE POLICY "Public read business settings" ON public.business_settings 
FOR SELECT USING (true);

CREATE POLICY "Admin update business settings" ON public.business_settings 
FOR ALL USING (auth.role() = 'authenticated');

-- BUSINESS HOURS: Public read; Admin edit
CREATE POLICY "Public read business hours" ON public.business_hours 
FOR SELECT USING (true);

CREATE POLICY "Admin manage business hours" ON public.business_hours 
FOR ALL USING (auth.role() = 'authenticated');

-- BLOCKED DATES: Public read; Admin edit
CREATE POLICY "Public read blocked dates" ON public.blocked_dates 
FOR SELECT USING (true);

CREATE POLICY "Admin manage blocked dates" ON public.blocked_dates 
FOR ALL USING (auth.role() = 'authenticated');

-- APPOINTMENTS: 
-- Public can INSERT appointment requests (without reading client personal data)
CREATE POLICY "Public insert appointments" ON public.appointments 
FOR INSERT WITH CHECK (true);

-- Public can SELECT appointment date and times for slot collision prevention
CREATE POLICY "Public view booked appointment slots" ON public.appointments 
FOR SELECT USING (true);

-- Authenticated admins can update and delete appointments
CREATE POLICY "Admin manage appointments" ON public.appointments 
FOR ALL USING (auth.role() = 'authenticated');

-- ADMIN USERS: Authenticated user can read to verify if their user_id is admin
CREATE POLICY "Authenticated user check admin" ON public.admin_users 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin manage admin users" ON public.admin_users 
FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED INITIAL DATA
-- ============================================================

-- Seed Business Settings
INSERT INTO public.business_settings (business_name, business_email, business_phone, business_address, slot_interval_minutes, booking_notice_hours)
VALUES (
    'Étoile Wedding Planning & Design Studio',
    'concierge@etoilestudio.com',
    '(415) 890-3421',
    '450 Sutter Street, Suite 800, San Francisco, CA 94108',
    30,
    24
) ON CONFLICT DO NOTHING;

-- Seed Business Hours (Monday to Saturday, 9am - 6pm)
INSERT INTO public.business_hours (weekday, is_open, start_time, end_time) VALUES
(0, false, '10:00:00', '16:00:00'), -- Sunday closed
(1, true,  '09:00:00', '18:00:00'), -- Monday
(2, true,  '09:00:00', '18:00:00'), -- Tuesday
(3, true,  '09:00:00', '18:00:00'), -- Wednesday
(4, true,  '09:00:00', '18:00:00'), -- Thursday
(5, true,  '09:00:00', '18:00:00'), -- Friday
(6, true,  '10:00:00', '16:00:00')  -- Saturday
ON CONFLICT (weekday) DO NOTHING;

-- Seed Signature Wedding Planning Services
INSERT INTO public.services (name, description, duration_minutes, price, is_active) VALUES
(
    'Initial Wedding Vision & Concept Consultation',
    'A bespoke 60-minute planning session exploring your aesthetic vision, color palettes, venue aspirations, and overall wedding budget framework with our principal creative director.',
    60,
    150.00,
    true
),
(
    'Full-Service Wedding Planning & Creative Direction',
    'Comprehensive end-to-end wedding production consultation covering guest experience design, curated vendor procurement, architectural floor planning, and timeline orchestration.',
    90,
    300.00,
    true
),
(
    'Wedding Design, Florals & Tablescape Styling Session',
    'A dedicated tactile styling consultation focused on bespoke floral artistry, tableware curation, custom linens, ambient lighting design, and stationery presentation.',
    60,
    200.00,
    true
),
(
    'Day-of Wedding Coordination & Production Review',
    'Detailed logistical alignment meeting 6-8 weeks prior to your celebration. We review vendor contracts, load-in schedules, ceremony choreography, and comprehensive minute-by-minute day timelines.',
    75,
    225.00,
    true
),
(
    'Curated Destination & Intimate Elopement Planning',
    'Private consultation dedicated to micro-weddings and destination celebrations. Covering guest travel logistics, private villa sourcing, intimate ceremony pacing, and local vendor sourcing.',
    60,
    180.00,
    true
)
ON CONFLICT DO NOTHING;
