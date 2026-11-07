Étoile Wedding Planning & Design Studio
A luxury modern wedding planning booking platform with a real-time availability engine, collision-proof appointment booking, and a secure Supabase-powered admin dashboard.
✨ Features
💍 Public Client Experience
Luxury Editorial Design: Tailored for high-end wedding planning ateliers with warm canvas tones, bespoke typography, and curated bridal photography.
Dynamic Services Showcase: Displays active wedding planning packages and consultations loaded directly from the database.
Real-Time Availability Engine: Dynamically calculates open appointment slots using:
Weekly operating hours (business_hours)
Service durations (services.duration_minutes)
Slot spacing intervals (business_settings.slot_interval_minutes)
Minimum advance notice required (business_settings.booking_notice_hours)
Studio blackout/blocked dates (blocked_dates)
Appointment collision detection (new_start < existing_end AND new_end > existing_start)
Privacy-First Appointment Insertion: Visitors can reserve appointments without requiring public read permissions over other clients' personal details.
Consultation Dossier & Calendar Integration: Step 4 confirmation card with direct one-click "Add to Google Calendar" integration.
🛡️ Studio Owner & Planner Admin Dashboard
Robust Supabase Auth: Secure email/password login with session persistence.
Strict Role Authorization: Authorization is strictly validated by checking auth.user.id against admin_users.user_id using maybeSingle().
Overview Dashboard: High-level metrics for Pending Requests, Confirmed Sessions, Completed Celebrations, and Active Offerings.
Appointments Management:
Filter by status (all, pending, confirmed, completed, cancelled).
Search by client name, email, phone, or service.
In-place status updates and celebration vision notes inspector.
Services Management:
Add new packages.
Edit service name, description, duration, and investment price.
One-click Activate / Deactivate toggles.
Business Hours Management:
Toggle each weekday open or closed.
Configure daily opening and closing hours.
Blocked Dates Management:
Blackout dates for holidays, private retreats, or on-site wedding coordination weekends.
Business Settings Management:
Live-updated studio profile (Studio Name, Email, Phone, Address, Slot Interval, Booking Notice).
In-App Database Assistant:
Interactive SQL migration script copy tool and status check.
🛠️ Tech Stack
Frontend Framework: React 19 + TypeScript
Build Tool: Vite 8
Styling: Tailwind CSS v4
Icons: Lucide React
Backend & Database: Supabase (PostgreSQL, Row Level Security, Auth)
📂 Project Structure
Text
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── context/
│   │   ├── AuthContext.tsx       # Supabase Auth & admin_users verification
│   │   └── AppContext.tsx        # Central data state & CRUD mutations
│   ├── components/
│   │   ├── public/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── BookingSection.tsx
│   │   │   ├── BookingSuccess.tsx
│   │   │   └── Footer.tsx
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── DatabaseSetupModal.tsx
│   │       └── tabs/
│   │           ├── OverviewTab.tsx
│   │           ├── AppointmentsTab.tsx
│   │           ├── ServicesTab.tsx
│   │           ├── BusinessHoursTab.tsx
│   │           ├── BlockedDatesTab.tsx
│   │           └── BusinessSettingsTab.tsx
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client initialization
│   │   ├── availability.ts       # Booking slot generation & collision engine
│   │   └── schema-sql.ts         # Embedded SQL setup script
│   ├── data/
│   │   ├── weddingImages.ts      # Curated high-res imagery URLs
│   │   └── defaultData.ts        # Luxury seed presets
│   ├── db/
│   │   └── supabase-schema.sql   # Complete SQL schema & RLS policies
│   └── types/
│       └── database.ts           # TypeScript interfaces matching schema
🗄️ Database Schema
The application uses the following exact PostgreSQL database schema:
Table	Description	Key Fields
services	Wedding planning offerings & packages	id, name, description, duration_minutes, price, is_active, created_at
appointments	Booked consultation sessions	id, full_name, email, phone, service_id, appointment_date, start_time, end_time, status, notes, created_at
business_hours	Weekly opening & closing schedule	id, weekday (0-6), is_open, start_time, end_time
blocked_dates	Blackout dates where booking is disabled	id, blocked_date, reason, created_at
business_settings	Studio profile and scheduling parameters	id, business_name, business_email, business_phone, business_address, slot_interval_minutes, booking_notice_hours, created_at
admin_users	Authorized Supabase Auth administrator UUIDs	id, user_id (references auth.users.id), created_at
🚀 Quick Start & Setup
1. Clone the repository
Bash
git clone https://github.com/your-username/wedding-planner-booking.git
cd wedding-planner-booking
2. Install dependencies
Bash
npm install
3. Configure environment variables
Create a .env file in the root directory (based on .env.example):
Env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
4. Run the Supabase SQL Migration
Go to your Supabase Dashboard.
Open the SQL Editor tab.
Open src/db/supabase-schema.sql (or copy it from the in-app Database & SQL Setup assistant modal).
Run the script. This creates all tables, Row Level Security (RLS) policies, and default wedding studio seed records.
5. Create an Admin User
Sign up a user in Supabase under Authentication > Users (or via the client).
Note the created user's User UID (e.g., 3f2504e0-4f89-11d3-9a0c-0305e82c3301).
Run this query in the Supabase SQL Editor to grant admin privileges:
SQL
INSERT INTO public.admin_users (user_id) 
VALUES ('YOUR_USER_UID_HERE');
6. Start the development server
Bash
npm run dev
Open http://localhost:3000 in your browser.
🔒 Security & Row Level Security (RLS)
Appointments Insertion: Public users are authorized to create appointment inquiries with INSERT WITH CHECK (true), but cannot read client contact details.
Admin Access: Authenticated administrators have full ALL access across services, appointments, business_hours, blocked_dates, and business_settings.
Client Auth Validation: Admin authorization is checked against admin_users.user_id on every session change.
