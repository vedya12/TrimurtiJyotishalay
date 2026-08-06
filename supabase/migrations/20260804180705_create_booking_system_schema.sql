/*
# Booking System Schema for Trimurti Jyotishalay

## Purpose
Creates the core database tables for an astrology/pandit service management platform:
- Services catalog (Kundali, Marriage Matching, Vastu, etc.)
- Client bookings/appointments
- Admin-managed events (pujas, kathas, ceremonies)
- Date availability blocking

## New Tables

### 1. services
- `id` (uuid PK)
- `name` (text, not null) — service name e.g. "Kundali Analysis"
- `name_mr` (text) — Marathi name
- `name_hi` (text) — Hindi name
- `description` (text) — what the service includes
- `description_mr` (text) — Marathi description
- `duration_minutes` (int, default 60) — typical session length
- `base_price` (numeric, default 0) — starting price in INR
- `is_active` (bool, default true) — whether shown to clients
- `sort_order` (int, default 0) — display ordering
- `created_at` (timestamptz)

### 2. bookings
- `id` (uuid PK)
- `booking_reference` (text, unique) — human-readable ID like "TJ-20250804-AB12"
- `service_id` (uuid FK → services)
- `client_name` (text, not null)
- `client_phone` (text, not null) — WhatsApp number
- `client_email` (text) — optional
- `event_date` (date, not null) — requested date
- `start_time` (time, not null) — requested time slot
- `end_time` (time) — calculated end time
- `location` (text) — venue address for on-site services
- `notes` (text) — client notes / special requests
- `status` (text, default 'pending') — pending, confirmed, completed, cancelled
- `admin_notes` (text) — pandit's internal notes
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 3. events
- `id` (uuid PK)
- `title` (text, not null) — event name e.g. "Satyanarayan Puja at Patil residence"
- `event_type` (text) — Kundali, Marriage Matching, Griha Pravesh, etc.
- `event_date` (date, not null)
- `start_time` (time, not null)
- `end_time` (time)
- `location` (text)
- `contact_person` (text)
- `contact_phone` (text)
- `notes` (text)
- `created_at` (timestamptz)

### 4. blocked_dates
- `id` (uuid PK)
- `block_date` (date, not null, unique) — the unavailable date
- `reason` (text) — holiday, travel, personal, etc.
- `created_at` (timestamptz)

## Security
- This is a single-tenant app (one pandit/admin manages everything; clients submit bookings without sign-in)
- RLS enabled on all tables
- Policies allow anon + authenticated CRUD on all tables since the booking system is intentionally public-facing
- Clients can create bookings; admin manages everything via the same anon key (Phase 1 — no auth gate)
*/

-- ─────────────────────── SERVICES ───────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  name_mr       text,
  name_hi       text,
  description   text,
  description_mr text,
  duration_minutes int DEFAULT 60,
  base_price    numeric DEFAULT 0,
  is_active     boolean DEFAULT true,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_services" ON services;
CREATE POLICY "anon_insert_services" ON services FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_services" ON services;
CREATE POLICY "anon_delete_services" ON services FOR DELETE
  TO anon, authenticated USING (true);

-- ─────────────────────── BOOKINGS ───────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  service_id       uuid REFERENCES services(id) ON DELETE SET NULL,
  client_name      text NOT NULL,
  client_phone     text NOT NULL,
  client_email     text,
  event_date       date NOT NULL,
  start_time       time NOT NULL,
  end_time         time,
  location         text,
  notes            text,
  status           text NOT NULL DEFAULT 'pending',
  admin_notes      text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);

-- ─────────────────────── EVENTS ───────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  event_type    text,
  event_date    date NOT NULL,
  start_time    time NOT NULL,
  end_time      time,
  location      text,
  contact_person text,
  contact_phone text,
  notes         text,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE
  TO anon, authenticated USING (true);

-- ─────────────────────── BLOCKED DATES ───────────────────────
CREATE TABLE IF NOT EXISTS blocked_dates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date date NOT NULL UNIQUE,
  reason     text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blocked" ON blocked_dates;
CREATE POLICY "anon_select_blocked" ON blocked_dates FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_blocked" ON blocked_dates;
CREATE POLICY "anon_insert_blocked" ON blocked_dates FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_blocked" ON blocked_dates;
CREATE POLICY "anon_update_blocked" ON blocked_dates FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_blocked" ON blocked_dates;
CREATE POLICY "anon_delete_blocked" ON blocked_dates FOR DELETE
  TO anon, authenticated USING (true);

-- ─────────────────────── INDEXES ───────────────────────
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_blocked_date ON blocked_dates(block_date);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active, sort_order);

-- ─────────────────────── SEED SERVICES ───────────────────────
INSERT INTO services (name, name_mr, name_hi, description, description_mr, duration_minutes, base_price, sort_order)
VALUES
  ('Kundali Analysis', 'कुंडली विश्लेषण', 'कुंडली विश्लेषण',
   'Detailed analysis of birth chart, planetary positions, and life predictions.',
   'जन्म कुंडली, ग्रह स्थिती आणि जीवन भविष्याचे सविस्तर विश्लेषण.',
   60, 501, 1),
  ('Marriage Matching', 'वधू-वर मिलन', 'वधू-वर मिलन',
   'Guna milan and compatibility analysis for marriage.',
   'विवाहासाठी गुण मिलन आणि सुसंगतता विश्लेषण.',
   45, 501, 2),
  ('Griha Pravesh', 'गृहप्रवेश', 'गृहप्रवेश',
   'Auspicious housewarming ceremony with Vedic rituals.',
   'वैदिक विधींसह शुभ गृहप्रवेश सोहळा.',
   120, 2100, 3),
  ('Satyanarayan Puja', 'सत्यनारायण पूजा', 'सत्यनारायण पूजा',
   'Traditional Satyanarayan Katha and Puja for prosperity.',
   'समृद्धीसाठी पारंपरिक सत्यनारायण कथा आणि पूजा.',
   90, 1100, 4),
  ('Bhagwat Katha', 'भागवत कथा', 'भागवत कथा',
   '7-day Bhagwat Katha narration with daily sessions.',
   '७ दिवसांची भागवत कथा, दररोज सत्र.',
   180, 11000, 5),
  ('Vastu Consultation', 'वास्तू सल्ला', 'वास्तू सल्ला',
   'On-site Vastu analysis and remedies for home or business.',
   'घर किंवा व्यवसायासाठी ठिकाणी वास्तू विश्लेषण आणि उपाय.',
   90, 1100, 6),
  ('Naming Ceremony', 'बारसे / नामकरण', 'नामकरण संस्कार',
   'Traditional naming ceremony (Naamkaran) for newborns.',
   'नवजात शिशूसाठी पारंपरिक नामकरण सोहळा.',
   60, 501, 7),
  ('Muhurta Selection', 'मुहूर्त निवड', 'मुहूर्त चयन',
   'Auspicious date and time selection for weddings, travel, business, etc.',
   'विवाह, प्रवास, व्यवसाय इत्यादीसाठी शुभ मुहूर्त निवड.',
   30, 251, 8)
ON CONFLICT DO NOTHING;

-- ─────────────────────── AUTO-GENERATE BOOKING REFERENCE ───────────────────────
-- Function to generate a unique booking reference like TJ-20250804-AB12
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text AS $$
DECLARE
  ref       text;
  date_part text;
  rand_part text;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  rand_part := substr(md5(random()::text), 1, 2) || substr(md5(random()::text), 1, 2);
  rand_part := upper(substr(rand_part, 1, 4));
  ref := 'TJ-' || date_part || '-' || rand_part;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;