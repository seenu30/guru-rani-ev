-- =============================================
-- Guru Rani EV - Base Database Schema
-- Migration: 00001_create_base_schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- HELPER FUNCTION: Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TABLE: scooter_models
-- Main product models (e.g., Guru Rani X, S, Pro Max)
-- =============================================
CREATE TABLE scooter_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_scooter_models_slug ON scooter_models(slug);
CREATE INDEX idx_scooter_models_status ON scooter_models(status);
CREATE INDEX idx_scooter_models_deleted_at ON scooter_models(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE TRIGGER trigger_scooter_models_updated_at
  BEFORE UPDATE ON scooter_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: variants
-- Product variants (e.g., Standard, Pro, Max)
-- =============================================
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES scooter_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in paise (INR * 100)
  range_km INTEGER NOT NULL, -- Range in km
  top_speed INTEGER NOT NULL, -- Top speed in km/h
  battery TEXT NOT NULL, -- e.g., "3.7 kWh"
  charging_time TEXT NOT NULL, -- e.g., "4 hours"
  motor_power TEXT NOT NULL, -- e.g., "4.5 kW"
  boot_space INTEGER, -- Boot space in liters
  specs JSONB, -- Additional specifications
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_variants_model_id ON variants(model_id);
CREATE INDEX idx_variants_status ON variants(status);

-- Trigger for updated_at
CREATE TRIGGER trigger_variants_updated_at
  BEFORE UPDATE ON variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: colors
-- Color options for variants
-- =============================================
CREATE TABLE colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Cosmic Black"
  hex_code TEXT NOT NULL, -- e.g., "#1a1a1a"
  image_url TEXT, -- Image of scooter in this color
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_colors_variant_id ON colors(variant_id);

-- =============================================
-- TABLE: dealers
-- Dealer/showroom locations
-- =============================================
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timings TEXT, -- e.g., "Mon-Sat: 9AM-7PM"
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dealers_city ON dealers(city);
CREATE INDEX idx_dealers_is_active ON dealers(is_active);

-- Trigger for updated_at
CREATE TRIGGER trigger_dealers_updated_at
  BEFORE UPDATE ON dealers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: leads
-- Sales enquiries / lead capture
-- =============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  model_id UUID REFERENCES scooter_models(id) ON DELETE SET NULL,
  message TEXT,
  source TEXT, -- e.g., "enquiry_form", "newsletter", "test_ride"
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT, -- Internal notes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

-- Trigger for updated_at
CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: test_ride_bookings
-- Test ride appointment bookings
-- =============================================
CREATE TABLE test_ride_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE RESTRICT,
  model_id UUID REFERENCES scooter_models(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL, -- e.g., "10:00 AM - 11:00 AM"
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_test_ride_bookings_dealer_id ON test_ride_bookings(dealer_id);
CREATE INDEX idx_test_ride_bookings_status ON test_ride_bookings(status);
CREATE INDEX idx_test_ride_bookings_date ON test_ride_bookings(booking_date);

-- Trigger for updated_at
CREATE TRIGGER trigger_test_ride_bookings_updated_at
  BEFORE UPDATE ON test_ride_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: blog_posts
-- Blog content
-- =============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Rich text / HTML / Markdown
  cover_image TEXT,
  category TEXT,
  author TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT, -- SEO
  meta_description TEXT, -- SEO
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

-- Trigger for updated_at
CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: faqs
-- Frequently Asked Questions
-- =============================================
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., "Ownership", "Booking", "Charging"
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_is_active ON faqs(is_active);

-- Trigger for updated_at
CREATE TRIGGER trigger_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABLE: testimonials
-- Customer testimonials / reviews
-- =============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL, -- e.g., "Mumbai, Maharashtra"
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  image_url TEXT, -- Customer photo
  model_id UUID REFERENCES scooter_models(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);

-- =============================================
-- TABLE: site_settings
-- Key-value store for site configuration
-- =============================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
