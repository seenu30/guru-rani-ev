-- Seed the single dealer location for Guru Rani
-- Green Chillies, Gangavaram, Andhra Pradesh 517408
-- Plus Code: 6P7R+93G (approximately 13.6324, 79.4187)

-- First, remove all existing dealers (since there's only one location)
DELETE FROM dealers;

-- Insert the actual dealer
INSERT INTO dealers (
  name,
  address,
  city,
  state,
  pincode,
  phone,
  email,
  latitude,
  longitude,
  timings,
  is_active
) VALUES (
  'Guru Rani - Gangavaram',
  'Green Chillies, 6P7R+93G, Gangavaram',
  'Gangavaram',
  'Andhra Pradesh',
  '517408',
  '+91 95055 36337',
  'lakshman.guruson77@gmail.com',
  13.6324,
  79.4187,
  'Mon-Sat: 9:00 AM - 7:00 PM',
  true
);
