-- =============================================
-- Guru Rani EV - Seed Data
-- Run this after migrations to populate demo data
-- =============================================

-- =============================================
-- SCOOTER MODELS
-- =============================================
INSERT INTO scooter_models (id, name, slug, tagline, description, status, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Guru Rani X', 'guru-rani-x', 'The Ultimate Urban Commuter', 'Experience the perfect blend of style, performance, and sustainability. The Guru Rani X is designed for the modern Indian commuter who demands more from their ride.', 'active', 1),
  ('22222222-2222-2222-2222-222222222222', 'Guru Rani S', 'guru-rani-s', 'Smart. Simple. Sustainable.', 'The perfect entry point to electric mobility. Guru Rani S offers everything you need for your daily commute at an accessible price point.', 'active', 2),
  ('33333333-3333-3333-3333-333333333333', 'Guru Rani Pro Max', 'guru-rani-pro-max', 'Power Meets Performance', 'For those who want it all. The Pro Max delivers unmatched range, speed, and features for the most demanding riders.', 'active', 3);

-- =============================================
-- VARIANTS
-- =============================================

-- Guru Rani X Variants
INSERT INTO variants (id, model_id, name, price, range_km, top_speed, battery, charging_time, motor_power, boot_space, specs, sort_order) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Standard', 9999900, 100, 70, '2.5 kWh', '4 hours', '3.5 kW', 22, '{"weight": "95 kg", "ground_clearance": "165 mm", "brakes": "Disc/Drum"}', 1),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Pro', 12499900, 130, 80, '3.5 kWh', '5 hours', '4.5 kW', 28, '{"weight": "102 kg", "ground_clearance": "165 mm", "brakes": "Disc/Disc", "display": "7-inch TFT"}', 2);

-- Guru Rani S Variants
INSERT INTO variants (id, model_id, name, price, range_km, top_speed, battery, charging_time, motor_power, boot_space, specs, sort_order) VALUES
  ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Base', 7999900, 80, 60, '2.0 kWh', '3.5 hours', '2.5 kW', 18, '{"weight": "85 kg", "ground_clearance": "160 mm", "brakes": "Disc/Drum"}', 1),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Plus', 9499900, 100, 70, '2.5 kWh', '4 hours', '3.0 kW', 22, '{"weight": "90 kg", "ground_clearance": "160 mm", "brakes": "Disc/Disc"}', 2);

-- Guru Rani Pro Max Variant
INSERT INTO variants (id, model_id, name, price, range_km, top_speed, battery, charging_time, motor_power, boot_space, specs, sort_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Pro Max', 14999900, 160, 100, '4.0 kWh', '6 hours', '6.0 kW', 32, '{"weight": "115 kg", "ground_clearance": "170 mm", "brakes": "Disc/Disc", "display": "10-inch TFT", "features": ["Connected App", "Fast Charging", "Reverse Mode"]}', 1);

-- =============================================
-- COLORS
-- =============================================

-- Guru Rani X Colors
INSERT INTO colors (variant_id, name, hex_code, sort_order) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Cosmic Black', '#1a1a1a', 1),
  ('a1111111-1111-1111-1111-111111111111', 'Pearl White', '#f5f5f5', 2),
  ('a1111111-1111-1111-1111-111111111111', 'Racing Red', '#dc2626', 3),
  ('a2222222-2222-2222-2222-222222222222', 'Cosmic Black', '#1a1a1a', 1),
  ('a2222222-2222-2222-2222-222222222222', 'Pearl White', '#f5f5f5', 2),
  ('a2222222-2222-2222-2222-222222222222', 'Racing Red', '#dc2626', 3),
  ('a2222222-2222-2222-2222-222222222222', 'Ocean Blue', '#0ea5e9', 4);

-- Guru Rani S Colors
INSERT INTO colors (variant_id, name, hex_code, sort_order) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Midnight Blue', '#1e3a5f', 1),
  ('b1111111-1111-1111-1111-111111111111', 'Silver Storm', '#9ca3af', 2),
  ('b1111111-1111-1111-1111-111111111111', 'Forest Green', '#166534', 3),
  ('b2222222-2222-2222-2222-222222222222', 'Midnight Blue', '#1e3a5f', 1),
  ('b2222222-2222-2222-2222-222222222222', 'Silver Storm', '#9ca3af', 2),
  ('b2222222-2222-2222-2222-222222222222', 'Forest Green', '#166534', 3);

-- Guru Rani Pro Max Colors
INSERT INTO colors (variant_id, name, hex_code, sort_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Stealth Black', '#0a0a0a', 1),
  ('c1111111-1111-1111-1111-111111111111', 'Glacier White', '#ffffff', 2),
  ('c1111111-1111-1111-1111-111111111111', 'Sunset Orange', '#f97316', 3);

-- =============================================
-- DEALERS
-- =============================================
INSERT INTO dealers (name, address, city, state, pincode, phone, email, latitude, longitude, timings, is_active) VALUES
  ('Guru Rani Experience Center - Mumbai', '123 EV Plaza, Bandra West', 'Mumbai', 'Maharashtra', '400050', '+91 22 1234 5678', 'mumbai@gururani.in', 19.0596, 72.8295, 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM', true),
  ('Guru Rani Showroom - Delhi', '45 Green Avenue, Connaught Place', 'New Delhi', 'Delhi', '110001', '+91 11 2345 6789', 'delhi@gururani.in', 28.6315, 77.2167, 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM', true),
  ('Guru Rani Hub - Bangalore', '78 Tech Park Road, Koramangala', 'Bangalore', 'Karnataka', '560034', '+91 80 3456 7890', 'bangalore@gururani.in', 12.9352, 77.6245, 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM', true),
  ('Guru Rani Store - Chennai', '22 Marina Drive, Adyar', 'Chennai', 'Tamil Nadu', '600020', '+91 44 4567 8901', 'chennai@gururani.in', 13.0067, 80.2571, 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM', true),
  ('Guru Rani Outlet - Hyderabad', '56 Hi-Tech City Road, Madhapur', 'Hyderabad', 'Telangana', '500081', '+91 40 5678 9012', 'hyderabad@gururani.in', 17.4489, 78.3907, 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM', true);

-- =============================================
-- FAQs
-- =============================================
INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES
  -- Ownership & Delivery
  ('What documents do I need to purchase a Guru Rani scooter?', 'You need a valid ID proof (Aadhaar/PAN), address proof, and passport-size photographs. For financing, additional income proof may be required.', 'Ownership & Delivery', 1, true),
  ('How long does delivery take?', 'Standard delivery takes 7-14 business days after order confirmation, depending on your location and color availability.', 'Ownership & Delivery', 2, true),
  ('Is registration included in the price?', 'Yes, RTO registration charges are included in the on-road price. We handle all the paperwork for you.', 'Ownership & Delivery', 3, true),

  -- Booking & Purchase
  ('How do I book a Guru Rani scooter?', 'You can book online through our website with a nominal booking amount, or visit any of our experience centers for an in-person booking.', 'Booking & Purchase', 1, true),
  ('What payment options are available?', 'We accept all major payment methods including UPI, credit/debit cards, net banking, and EMI options through our finance partners.', 'Booking & Purchase', 2, true),
  ('Can I cancel my booking?', 'Yes, bookings can be cancelled within 7 days for a full refund. After that, standard cancellation charges apply.', 'Booking & Purchase', 3, true),

  -- Government Subsidies
  ('Am I eligible for FAME-II subsidy?', 'Yes! All Guru Rani scooters are eligible for FAME-II subsidy up to ₹15,000, which is already reflected in our ex-showroom prices.', 'Government Subsidies', 1, true),
  ('What about state subsidies?', 'Additional state subsidies vary by location. Our team will help you understand and apply for all applicable subsidies in your state.', 'Government Subsidies', 2, true),

  -- Charging & Battery
  ('How do I charge my Guru Rani scooter?', 'Simply plug in the portable charger (included) to any standard 15A socket. No special installation required.', 'Charging & Battery', 1, true),
  ('What is the battery warranty?', 'We offer a 3-year or 50,000 km warranty on the battery pack, whichever comes first.', 'Charging & Battery', 2, true),
  ('Can I use fast charging?', 'The Pro and Pro Max models support DC fast charging, which can charge the battery to 80% in just 30 minutes at compatible stations.', 'Charging & Battery', 3, true),

  -- Service & Maintenance
  ('Where can I get my scooter serviced?', 'At any authorized Guru Rani service center or through our doorstep service option available in select cities.', 'Service & Maintenance', 1, true),
  ('How often does the scooter need servicing?', 'We recommend a service every 5,000 km or 6 months, whichever comes first. EVs require significantly less maintenance than petrol vehicles.', 'Service & Maintenance', 2, true),
  ('What is covered under warranty?', 'The comprehensive warranty covers the motor, controller, and all electrical components for 3 years. Extended warranty options are also available.', 'Service & Maintenance', 3, true);

-- =============================================
-- TESTIMONIALS
-- =============================================
INSERT INTO testimonials (name, location, rating, text, model_id, is_featured, is_active, sort_order) VALUES
  ('Rajesh Kumar', 'Mumbai, Maharashtra', 5, 'Switched from my petrol bike to Guru Rani X six months ago. Best decision ever! The range is perfect for my daily commute, and I am saving over ₹3,000 every month on fuel.', '11111111-1111-1111-1111-111111111111', true, true, 1),
  ('Priya Sharma', 'Bangalore, Karnataka', 5, 'As a first-time EV owner, I was nervous about charging and range. But the Guru Rani S has exceeded all my expectations. Simple, reliable, and so much fun to ride!', '22222222-2222-2222-2222-222222222222', true, true, 2),
  ('Amit Patel', 'Delhi', 5, 'The Pro Max is an absolute beast! 160km range means I never worry about charging during my long rides. The acceleration is addictive.', '33333333-3333-3333-3333-333333333333', true, true, 3),
  ('Sneha Reddy', 'Hyderabad, Telangana', 4, 'Love my Guru Rani X! The connected app features are so convenient. I can check battery status, locate my scooter, and even pre-condition it before leaving.', '11111111-1111-1111-1111-111111111111', false, true, 4),
  ('Vikram Singh', 'Chennai, Tamil Nadu', 5, 'After 10,000+ km, my Guru Rani is still running like new. The build quality is excellent, and service has been hassle-free.', '11111111-1111-1111-1111-111111111111', false, true, 5);

-- =============================================
-- BLOG POSTS
-- =============================================
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, is_published, published_at) VALUES
  ('Why Electric Scooters Are the Future of Urban Mobility', 'electric-scooters-future-urban-mobility', 'Discover why more Indians are making the switch to electric scooters and how it''s transforming city commutes.', '<h2>The EV Revolution in India</h2><p>India is witnessing a massive shift towards electric vehicles, and electric scooters are leading the charge. With rising fuel prices, increasing environmental awareness, and government incentives, there has never been a better time to go electric.</p><h3>Key Benefits</h3><ul><li>Save up to ₹50,000 annually on fuel costs</li><li>Zero direct emissions for cleaner cities</li><li>Lower maintenance costs</li><li>Government subsidies make EVs more affordable</li></ul>', 'EV News', 'Guru Rani Team', true, NOW() - INTERVAL '7 days'),
  ('Complete Guide to EV Charging at Home', 'guide-ev-charging-home', 'Everything you need to know about charging your electric scooter at home - from setup to best practices.', '<h2>Home Charging Made Simple</h2><p>One of the biggest advantages of electric scooters is the ability to charge right at home. No more visits to petrol pumps!</p><h3>What You Need</h3><p>All Guru Rani scooters come with a portable charger that works with any standard 15A socket. Simply plug in overnight and wake up to a fully charged scooter.</p>', 'Tips & Guides', 'Guru Rani Team', true, NOW() - INTERVAL '3 days'),
  ('Guru Rani Pro Max: A Deep Dive into Features', 'guru-rani-pro-max-features', 'Explore all the premium features that make the Pro Max our most advanced electric scooter yet.', '<h2>Introducing the Pro Max</h2><p>The Guru Rani Pro Max represents the pinnacle of our engineering. With a 160km range, 100 km/h top speed, and cutting-edge technology, it''s designed for riders who want the very best.</p><h3>Key Features</h3><ul><li>4.0 kWh battery pack</li><li>6.0 kW motor</li><li>10-inch TFT display</li><li>Connected app features</li><li>Fast charging support</li></ul>', 'Company Updates', 'Guru Rani Team', true, NOW() - INTERVAL '1 day');

-- =============================================
-- SITE SETTINGS
-- =============================================
INSERT INTO site_settings (key, value, description) VALUES
  ('savings_calculator', '{"petrol_price": 105, "electricity_price": 8, "avg_petrol_mileage": 45, "avg_ev_efficiency": 15}', 'Default values for savings calculator'),
  ('contact_info', '{"phone": "+91 1800 123 4567", "email": "hello@gururani.in", "address": "Guru Rani Electric Pvt Ltd, Mumbai"}', 'Company contact information'),
  ('social_links', '{"instagram": "https://instagram.com/gururani", "twitter": "https://twitter.com/gururani", "facebook": "https://facebook.com/gururani", "youtube": "https://youtube.com/gururani"}', 'Social media links');
