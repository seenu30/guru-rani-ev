-- =============================================
-- Guru Rani EV - Row Level Security Policies
-- Migration: 00002_create_rls_policies
-- =============================================

-- =============================================
-- Enable RLS on all tables
-- =============================================
ALTER TABLE scooter_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_ride_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES
-- These tables are publicly readable (for website visitors)
-- =============================================

-- Scooter Models: Public can view active, non-deleted models
CREATE POLICY "scooter_models_public_read"
  ON scooter_models FOR SELECT
  USING (status = 'active' AND deleted_at IS NULL);

-- Variants: Public can view active variants of active models
CREATE POLICY "variants_public_read"
  ON variants FOR SELECT
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM scooter_models
      WHERE scooter_models.id = variants.model_id
      AND scooter_models.status = 'active'
      AND scooter_models.deleted_at IS NULL
    )
  );

-- Colors: Public can view colors of active variants
CREATE POLICY "colors_public_read"
  ON colors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM variants
      WHERE variants.id = colors.variant_id
      AND variants.status = 'active'
    )
  );

-- Dealers: Public can view active dealers
CREATE POLICY "dealers_public_read"
  ON dealers FOR SELECT
  USING (is_active = true);

-- Blog Posts: Public can view published posts
CREATE POLICY "blog_posts_public_read"
  ON blog_posts FOR SELECT
  USING (is_published = true AND published_at IS NOT NULL AND published_at <= NOW());

-- FAQs: Public can view active FAQs
CREATE POLICY "faqs_public_read"
  ON faqs FOR SELECT
  USING (is_active = true);

-- Testimonials: Public can view active testimonials
CREATE POLICY "testimonials_public_read"
  ON testimonials FOR SELECT
  USING (is_active = true);

-- Site Settings: Public can read non-sensitive settings
CREATE POLICY "site_settings_public_read"
  ON site_settings FOR SELECT
  USING (key NOT LIKE 'internal_%' AND key NOT LIKE 'secret_%');

-- =============================================
-- PUBLIC INSERT POLICIES
-- For forms submitted by website visitors
-- =============================================

-- Leads: Anyone can submit a lead (enquiry form)
CREATE POLICY "leads_public_insert"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Test Ride Bookings: Anyone can book a test ride
CREATE POLICY "test_ride_bookings_public_insert"
  ON test_ride_bookings FOR INSERT
  WITH CHECK (true);

-- =============================================
-- AUTHENTICATED (ADMIN) POLICIES
-- Full access for authenticated admin users
-- =============================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role in their JWT claims
  RETURN (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Scooter Models: Admin full access
CREATE POLICY "scooter_models_admin_all"
  ON scooter_models FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Variants: Admin full access
CREATE POLICY "variants_admin_all"
  ON variants FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Colors: Admin full access
CREATE POLICY "colors_admin_all"
  ON colors FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Dealers: Admin full access
CREATE POLICY "dealers_admin_all"
  ON dealers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Leads: Admin can read, update, delete
CREATE POLICY "leads_admin_read"
  ON leads FOR SELECT
  USING (is_admin());

CREATE POLICY "leads_admin_update"
  ON leads FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "leads_admin_delete"
  ON leads FOR DELETE
  USING (is_admin());

-- Test Ride Bookings: Admin can read, update, delete
CREATE POLICY "test_ride_bookings_admin_read"
  ON test_ride_bookings FOR SELECT
  USING (is_admin());

CREATE POLICY "test_ride_bookings_admin_update"
  ON test_ride_bookings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "test_ride_bookings_admin_delete"
  ON test_ride_bookings FOR DELETE
  USING (is_admin());

-- Blog Posts: Admin full access
CREATE POLICY "blog_posts_admin_all"
  ON blog_posts FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- FAQs: Admin full access
CREATE POLICY "faqs_admin_all"
  ON faqs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Testimonials: Admin full access
CREATE POLICY "testimonials_admin_all"
  ON testimonials FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Site Settings: Admin full access
CREATE POLICY "site_settings_admin_all"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
