-- ============================================================
-- MarketPlace SaaS — Seed Data (Development / Demo)
-- ============================================================
-- WARNING: Run AFTER 001_initial_schema.sql
-- This file inserts sample categories and products for demo purposes.
-- ============================================================

-- ── Categories ────────────────────────────────────────────────
INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Books'),
  ('Clothing'),
  ('Home & Garden'),
  ('Sports & Outdoors'),
  ('Beauty & Health')
ON CONFLICT (name) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────
INSERT INTO products (title, description, price, image_url, stock) VALUES
  (
    'Wireless Noise-Cancelling Headphones',
    'Premium over-ear headphones with 30-hour battery life, active noise cancellation, and crystal-clear audio.',
    149.99,
    'https://placehold.co/600x400/e0e7ff/6366f1?text=Headphones',
    50
  ),
  (
    'Ergonomic Mechanical Keyboard',
    'Compact TKL layout with Cherry MX switches, RGB backlight, and USB-C connectivity. Perfect for developers.',
    89.99,
    'https://placehold.co/600x400/e0e7ff/6366f1?text=Keyboard',
    30
  ),
  (
    '4K Ultra HD Monitor — 27"',
    '27-inch IPS panel with 4K resolution, 144Hz refresh rate, and HDR support. Ideal for creatives and gamers.',
    399.99,
    'https://placehold.co/600x400/e0e7ff/6366f1?text=Monitor',
    15
  ),
  (
    'The Pragmatic Programmer',
    'A classic guide to software craftsmanship. Learn timeless principles from experienced developers.',
    34.99,
    'https://placehold.co/600x400/fef3c7/d97706?text=Book',
    100
  ),
  (
    'Clean Code by Robert C. Martin',
    'A handbook of agile software craftsmanship. Essential reading for every professional developer.',
    29.99,
    'https://placehold.co/600x400/fef3c7/d97706?text=Book',
    80
  ),
  (
    'Premium Cotton T-Shirt',
    'Ethically sourced 100% organic cotton. Available in 10 colours, pre-shrunk, machine washable.',
    24.99,
    'https://placehold.co/600x400/dcfce7/16a34a?text=T-Shirt',
    200
  ),
  (
    'Running Shoes — Ultra Boost',
    'Engineered mesh upper with responsive cushioning. Designed for long-distance comfort and speed.',
    119.99,
    'https://placehold.co/600x400/fce7f3/db2777?text=Shoes',
    45
  ),
  (
    'Smart Indoor Plant Pot',
    'Self-watering planter with soil moisture sensor and companion app. Never over- or under-water again.',
    49.99,
    'https://placehold.co/600x400/d1fae5/059669?text=Plant+Pot',
    60
  ),
  (
    'Yoga Mat — Non-Slip 6mm',
    'Eco-friendly TPE foam with alignment lines. Supports up to 120 kg, includes carrying strap.',
    39.99,
    'https://placehold.co/600x400/fce7f3/db2777?text=Yoga+Mat',
    90
  ),
  (
    'Vitamin C Serum 30ml',
    '20% stabilised vitamin C with hyaluronic acid. Brightens skin, reduces fine lines. Dermatologist tested.',
    19.99,
    'https://placehold.co/600x400/fef9c3/ca8a04?text=Serum',
    150
  )
ON CONFLICT DO NOTHING;

-- ── Product ↔ Category Associations ──────────────────────────
DO $$
DECLARE
  electronics_id  UUID;
  books_id         UUID;
  clothing_id      UUID;
  home_id          UUID;
  sports_id        UUID;
  beauty_id        UUID;
BEGIN
  SELECT id INTO electronics_id FROM categories WHERE name = 'Electronics';
  SELECT id INTO books_id        FROM categories WHERE name = 'Books';
  SELECT id INTO clothing_id     FROM categories WHERE name = 'Clothing';
  SELECT id INTO home_id         FROM categories WHERE name = 'Home & Garden';
  SELECT id INTO sports_id       FROM categories WHERE name = 'Sports & Outdoors';
  SELECT id INTO beauty_id       FROM categories WHERE name = 'Beauty & Health';

  -- Headphones → Electronics
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, electronics_id FROM products p WHERE p.title = 'Wireless Noise-Cancelling Headphones'
  ON CONFLICT DO NOTHING;

  -- Keyboard → Electronics
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, electronics_id FROM products p WHERE p.title = 'Ergonomic Mechanical Keyboard'
  ON CONFLICT DO NOTHING;

  -- Monitor → Electronics
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, electronics_id FROM products p WHERE p.title = '4K Ultra HD Monitor — 27"'
  ON CONFLICT DO NOTHING;

  -- Books
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, books_id FROM products p WHERE p.title = 'The Pragmatic Programmer'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, books_id FROM products p WHERE p.title = 'Clean Code by Robert C. Martin'
  ON CONFLICT DO NOTHING;

  -- Clothing
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, clothing_id FROM products p WHERE p.title = 'Premium Cotton T-Shirt'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, clothing_id FROM products p WHERE p.title = 'Running Shoes — Ultra Boost'
  ON CONFLICT DO NOTHING;

  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, sports_id FROM products p WHERE p.title = 'Running Shoes — Ultra Boost'
  ON CONFLICT DO NOTHING;

  -- Home
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, home_id FROM products p WHERE p.title = 'Smart Indoor Plant Pot'
  ON CONFLICT DO NOTHING;

  -- Sports
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, sports_id FROM products p WHERE p.title = 'Yoga Mat — Non-Slip 6mm'
  ON CONFLICT DO NOTHING;

  -- Beauty
  INSERT INTO product_categories (product_id, category_id)
  SELECT p.id, beauty_id FROM products p WHERE p.title = 'Vitamin C Serum 30ml'
  ON CONFLICT DO NOTHING;
END $$;
