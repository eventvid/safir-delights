-- ============================================================
-- Safir Delights — Product Fields Enhancement
-- ============================================================
-- Adds new fields to products and categories for a rich
-- Turkish & Middle Eastern sweets marketplace.
-- ============================================================

-- ── Products: new columns ─────────────────────────────────────────────────────

ALTER TABLE products ADD COLUMN IF NOT EXISTS slug          TEXT UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients   TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_grams  INTEGER CHECK (weight_grams > 0);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured   BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags          TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order    INTEGER DEFAULT 0;

-- ── Categories: new columns ───────────────────────────────────────────────────

ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug        TEXT UNIQUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url   TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order  INTEGER DEFAULT 0;

-- ── Indexes for new fields ────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_slug          ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured   ON products (is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products (is_best_seller) WHERE is_best_seller = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_tags          ON products USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_categories_slug        ON categories (slug);

-- ── Slugify helper function ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION slugify(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(text_input),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '[\s-]+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ── Seed: categories for Safir Delights ──────────────────────────────────────

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Baklava',          'baklava',         'Crispy layers of phyllo, nuts & honey',           1),
  ('Turkish Delight',  'turkish-delight', 'Lokum in every flavor imaginable',                2),
  ('Künefe',           'kunefe',          'Warm cheese pastry with golden shredded wheat',   3),
  ('Premium Dates',    'dates',           'Medjool & Ajwa varieties from the region',        4),
  ('Halva',            'halva',           'Sesame & pistachio confections',                  5),
  ('Gift Boxes',       'gift-boxes',      'Curated selections for special occasions',        6),
  ('Cookies & Maamoul','cookies',         'Traditional filled cookies and pastries',         7),
  ('Nougat & Candy',   'nougat',          'Hand-pulled nougats and artisan candies',         8)
ON CONFLICT (name) DO UPDATE
  SET slug        = EXCLUDED.slug,
      description = EXCLUDED.description,
      sort_order  = EXCLUDED.sort_order;

-- ── Sample products (placeholder structure) ───────────────────────────────────

-- NOTE: Run this after categories are inserted.
-- Products reference category IDs, so we use a DO block.

DO $$
DECLARE
  cat_baklava         UUID;
  cat_turkish_delight UUID;
  cat_kunefe          UUID;
  cat_dates           UUID;
  cat_halva           UUID;
  cat_gift_boxes      UUID;

  prod_id UUID;
BEGIN
  SELECT id INTO cat_baklava         FROM categories WHERE slug = 'baklava';
  SELECT id INTO cat_turkish_delight FROM categories WHERE slug = 'turkish-delight';
  SELECT id INTO cat_kunefe          FROM categories WHERE slug = 'kunefe';
  SELECT id INTO cat_dates           FROM categories WHERE slug = 'dates';
  SELECT id INTO cat_halva           FROM categories WHERE slug = 'halva';
  SELECT id INTO cat_gift_boxes      FROM categories WHERE slug = 'gift-boxes';

  -- 1. Classic Pistachio Baklava
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, discount_percent, is_featured, is_best_seller, tags)
  VALUES (
    'Classic Pistachio Baklava',
    'classic-pistachio-baklava',
    'Layers of crispy phyllo dough filled with finely chopped Gaziantep pistachios, drenched in pure Anatolian blossom honey. The gold standard of Turkish confectionery.',
    24.99, 50,
    'Phyllo dough, Gaziantep pistachios, blossom honey, butter, rose water',
    400, 0, TRUE, TRUE,
    ARRAY['pistachio', 'baklava', 'classic', 'bestseller']
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL AND cat_baklava IS NOT NULL THEN
    INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING;
  END IF;

  -- 2. Rose & Pistachio Turkish Delight
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, discount_percent, is_featured, is_best_seller, tags)
  VALUES (
    'Rose & Pistachio Lokum',
    'rose-pistachio-lokum',
    'Soft, fragrant cubes of Turkish delight infused with Bulgarian rose water and studded with whole pistachios. Dusted in fine powdered sugar.',
    18.99, 80,
    'Sugar, starch, rose water, pistachios, powdered sugar, citric acid',
    300, 0, TRUE, TRUE,
    ARRAY['lokum', 'rose', 'turkish-delight', 'pistachio']
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL AND cat_turkish_delight IS NOT NULL THEN
    INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_turkish_delight) ON CONFLICT DO NOTHING;
  END IF;

  -- 3. Künefe
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, discount_percent, is_featured, is_best_seller, tags)
  VALUES (
    'Traditional Künefe',
    'traditional-kunefe',
    'Golden threads of kadayıf pastry embracing stretchy unsalted cheese, baked to perfection and soaked in fragrant sugar syrup. Best enjoyed warm.',
    22.99, 30,
    'Kadayıf (shredded wheat), unsalted white cheese, butter, sugar, rose water',
    350, 0, FALSE, TRUE,
    ARRAY['kunefe', 'warm', 'cheese', 'savory-sweet']
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL AND cat_kunefe IS NOT NULL THEN
    INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_kunefe) ON CONFLICT DO NOTHING;
  END IF;

  -- 4. Medjool Dates
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, discount_percent, is_featured, is_best_seller, tags)
  VALUES (
    'Premium Medjool Dates',
    'premium-medjool-dates',
    'Hand-selected Medjool dates from the Jordan Valley — the "king of dates." Plump, caramel-like, and naturally sweet with a soft, tender texture.',
    29.99, 60,
    '100% Medjool dates',
    500, 10, FALSE, FALSE,
    ARRAY['dates', 'medjool', 'natural', 'vegan', 'gluten-free']
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL AND cat_dates IS NOT NULL THEN
    INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Sesame Halva
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, discount_percent, is_featured, is_best_seller, tags)
  VALUES (
    'Premium Sesame Halva',
    'premium-sesame-halva',
    'Rich, crumbly halva made from stone-ground sesame tahini and pure sugar. A timeless Middle Eastern confection with a distinctive melt-in-your-mouth texture.',
    16.99, 45,
    'Sesame tahini, sugar, vanilla',
    400, 0, FALSE, FALSE,
    ARRAY['halva', 'sesame', 'vegan', 'gluten-free']
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL AND cat_halva IS NOT NULL THEN
    INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING;
  END IF;

  -- 6. Mixed Gift Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, discount_percent, is_featured, is_best_seller, tags)
  VALUES (
    'Safir Signature Gift Box',
    'safir-signature-gift-box',
    'Our most popular gift selection — a curated assortment of baklava, lokum, halva, and premium dates presented in our signature emerald and gold gift box. Perfect for any occasion.',
    59.99, 25,
    'Assorted — see individual products for ingredients',
    1200, 0, TRUE, TRUE,
    ARRAY['gift', 'assorted', 'premium', 'best-gift']
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL AND cat_gift_boxes IS NOT NULL THEN
    INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING;
  END IF;

END $$;
