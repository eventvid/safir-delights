-- ============================================================
-- Safir Delights — Full Catalog Refresh (60 Products)
-- ============================================================
-- Replaces all sample data with the real 60-product catalog.
-- Adds weight_display column for human-readable weight strings.
-- ============================================================

-- ── Schema: add weight_display column ────────────────────────────────────────

ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_display TEXT;

-- ── Clean existing sample data (dev reset) ───────────────────────────────────
-- Note: product_categories and cart_items have ON DELETE CASCADE on product FK.
-- order_items does not, so we clear it manually first.

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM product_categories;
DELETE FROM products;
DELETE FROM categories;

-- ── Insert 9 new categories ───────────────────────────────────────────────────

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Baklava',              'baklava',            'Crispy phyllo layers with premium nuts & honey',            1),
  ('Lokum',                'lokum',              'Artisan Turkish delight in every flavor imaginable',        2),
  ('Halva',                'halva',              'Sesame & pistachio confections, crumbly and rich',         3),
  ('Premium Gift Boxes',   'premium-gift-boxes', 'Curated luxury assortments for every occasion',           4),
  ('Arabic Sweets',        'arabic-sweets',      'Traditional Middle Eastern pastries and confections',      5),
  ('Date-Based Sweets',    'date-based-sweets',  'Premium dates and date confections from the region',      6),
  ('Tea & Coffee Pairings','tea-coffee-pairings','Artisan teas and coffees to pair with your sweets',       7),
  ('Tea Accessories',      'tea-accessories',    'Handcrafted tools for the perfect tea or coffee ritual',  8),
  ('Gourmet Spreads',      'gourmet-spreads',    'Premium spreads and syrups crafted from finest ingredients', 9)
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description,
      sort_order  = EXCLUDED.sort_order;

-- ── Insert 60 products ────────────────────────────────────────────────────────

DO $$
DECLARE
  cat_baklava        UUID;
  cat_lokum          UUID;
  cat_halva          UUID;
  cat_gift_boxes     UUID;
  cat_arabic         UUID;
  cat_dates          UUID;
  cat_tea_coffee     UUID;
  cat_tea_acc        UUID;
  cat_spreads        UUID;
  prod_id            UUID;
BEGIN
  SELECT id INTO cat_baklava    FROM categories WHERE slug = 'baklava';
  SELECT id INTO cat_lokum      FROM categories WHERE slug = 'lokum';
  SELECT id INTO cat_halva      FROM categories WHERE slug = 'halva';
  SELECT id INTO cat_gift_boxes FROM categories WHERE slug = 'premium-gift-boxes';
  SELECT id INTO cat_arabic     FROM categories WHERE slug = 'arabic-sweets';
  SELECT id INTO cat_dates      FROM categories WHERE slug = 'date-based-sweets';
  SELECT id INTO cat_tea_coffee FROM categories WHERE slug = 'tea-coffee-pairings';
  SELECT id INTO cat_tea_acc    FROM categories WHERE slug = 'tea-accessories';
  SELECT id INTO cat_spreads    FROM categories WHERE slug = 'gourmet-spreads';

  -- ── BAKLAVA ─────────────────────────────────────────────────────────────────

  -- 1. Classic Pistachio Baklava
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Classic Pistachio Baklava', 'classic-pistachio-baklava',
    'Traditional Gaziantep-style baklava made with 40 ultra-thin layers of phyllo dough and premium Antep pistachios. Buttery, crisp and perfectly balanced in sweetness.',
    24.90, 120, 'Phyllo dough, Antep pistachio, clarified butter, sugar syrup, lemon juice',
    500, '500g', TRUE, ARRAY['bestseller','pistachio','traditional'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 2. Walnut Sultan Baklava
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Walnut Sultan Baklava', 'walnut-sultan-baklava',
    'A rich walnut-filled baklava with deep roasted nut flavor and delicate syrup infusion.',
    21.50, 100, 'Phyllo dough, crushed walnuts, butter, syrup',
    500, '500g', FALSE, ARRAY['walnut','traditional'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 3. Chocolate Pistachio Baklava Rolls
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Chocolate Pistachio Baklava Rolls', 'chocolate-pistachio-baklava-rolls',
    'Modern twist on classic baklava with Belgian dark chocolate and roasted pistachio filling.',
    27.90, 80, 'Phyllo dough, pistachio, dark chocolate, butter, syrup',
    450, '450g', TRUE, ARRAY['chocolate','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 13. Honey Almond Baklava Nest
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Honey Almond Baklava Nest', 'honey-almond-baklava-nest',
    'Delicately shaped baklava nests filled with roasted almonds and finished with fragrant honey syrup.',
    23.90, 85, 'Phyllo dough, roasted almonds, butter, wildflower honey syrup',
    500, '500g', FALSE, ARRAY['almond','honey','artisan'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 14. Caramel Pistachio Baklava Bites
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Caramel Pistachio Baklava Bites', 'caramel-pistachio-baklava-bites',
    'Miniature baklava bites layered with pistachio and finished with a light caramel glaze.',
    26.90, 70, 'Phyllo dough, pistachio, caramel glaze, butter',
    450, '450g', FALSE, ARRAY['mini','pistachio','modern'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 15. Antep Pistachio Square Baklava
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Antep Pistachio Square Baklava', 'antep-pistachio-square-baklava',
    'Premium square-cut baklava crafted with the finest Antep pistachios for a rich, authentic taste.',
    29.90, 60, 'Phyllo dough, premium Antep pistachio, butter, syrup',
    600, '600g', TRUE, ARRAY['antep','premium','bestseller'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 28. Truffle Pistachio Baklava Fingers
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Truffle Pistachio Baklava Fingers', 'truffle-pistachio-baklava-fingers',
    'Elegant finger-shaped baklava filled with smooth white chocolate truffle cream and layered pistachio.',
    32.90, 55, 'Phyllo dough, Antep pistachio, white chocolate truffle cream, butter, light syrup',
    450, '450g', TRUE, ARRAY['luxury','pistachio','modern'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 29. Cashew Honey Baklava Rolls
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Cashew Honey Baklava Rolls', 'cashew-honey-baklava-rolls',
    'Crisp baklava rolls generously filled with roasted cashews and finished with delicate honey syrup.',
    25.90, 70, 'Phyllo dough, roasted cashews, butter, acacia honey syrup',
    500, '500g', FALSE, ARRAY['cashew','honey'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 30. Lotus Caramel Baklava
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Lotus Caramel Baklava', 'lotus-caramel-baklava',
    'A contemporary baklava creation layered with caramel cream and delicate biscuit crumble.',
    29.50, 60, 'Phyllo dough, caramel cream, biscuit crumble, butter, syrup',
    500, '500g', FALSE, ARRAY['caramel','fusion'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 45. Triple Nut Royal Baklava
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Triple Nut Royal Baklava', 'triple-nut-royal-baklava',
    'A royal layered baklava combining pistachios, walnuts, and hazelnuts in perfect balance.',
    34.90, 50, 'Phyllo dough, pistachio, walnut, hazelnut, butter, syrup',
    600, '600g', TRUE, ARRAY['mixed-nuts','luxury'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- 46. Caramel Pecan Baklava Squares
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Caramel Pecan Baklava Squares', 'caramel-pecan-baklava-squares',
    'Modern baklava squares filled with toasted pecans and layered caramel glaze.',
    30.90, 65, 'Phyllo dough, pecans, caramel glaze, butter, syrup',
    500, '500g', FALSE, ARRAY['pecan','caramel'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_baklava) ON CONFLICT DO NOTHING; END IF;

  -- ── LOKUM ────────────────────────────────────────────────────────────────────

  -- 4. Rose Turkish Delight
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Rose Turkish Delight', 'rose-turkish-delight',
    'Soft, fragrant rose-flavored Turkish delight dusted in powdered sugar.',
    14.90, 150, 'Sugar, cornstarch, rosewater, powdered sugar',
    350, '350g', TRUE, ARRAY['rose','classic'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 5. Pomegranate Pistachio Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Pomegranate Pistachio Lokum', 'pomegranate-pistachio-lokum',
    'Bright and fruity pomegranate delight layered with crunchy pistachios.',
    16.50, 120, 'Sugar, cornstarch, pomegranate extract, pistachio',
    350, '350g', FALSE, ARRAY['fruit','pistachio'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 6. Double Roasted Pistachio Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Double Roasted Pistachio Lokum', 'double-roasted-pistachio-lokum',
    'Extra-rich pistachio lokum packed with whole Antep pistachios.',
    18.90, 110, 'Sugar, pistachio paste, whole pistachios',
    350, '350g', TRUE, ARRAY['premium','pistachio'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 16. Orange Blossom Turkish Delight
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Orange Blossom Turkish Delight', 'orange-blossom-turkish-delight',
    'Soft and aromatic lokum infused with delicate orange blossom essence.',
    15.90, 130, 'Sugar, cornstarch, orange blossom water',
    350, '350g', FALSE, ARRAY['floral','classic'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 17. Hazelnut Cocoa Lokum Cubes
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Hazelnut Cocoa Lokum Cubes', 'hazelnut-cocoa-lokum-cubes',
    'Rich cocoa Turkish delight filled with crunchy roasted hazelnuts.',
    17.90, 95, 'Sugar, cocoa, roasted hazelnuts',
    350, '350g', FALSE, ARRAY['chocolate','hazelnut'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 18. Saffron Gold Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Saffron Gold Lokum', 'saffron-gold-lokum',
    'Luxury saffron-infused lokum with a subtle golden hue and refined aroma.',
    22.90, 60, 'Sugar, saffron threads, cornstarch',
    300, '300g', TRUE, ARRAY['saffron','luxury'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 31. Mint Pistachio Turkish Delight
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Mint Pistachio Turkish Delight', 'mint-pistachio-turkish-delight',
    'Refreshing mint-infused lokum blended with whole roasted pistachios.',
    16.90, 110, 'Sugar, cornstarch, natural mint extract, pistachio',
    350, '350g', FALSE, ARRAY['mint','pistachio'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 32. Lemon Coconut Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Lemon Coconut Lokum', 'lemon-coconut-lokum',
    'Bright citrus Turkish delight rolled in fine coconut flakes for a tropical finish.',
    15.50, 120, 'Sugar, cornstarch, lemon zest, coconut flakes',
    350, '350g', FALSE, ARRAY['citrus','coconut'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 33. Premium Mixed Nut Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Premium Mixed Nut Lokum', 'premium-mixed-nut-lokum',
    'Soft lokum generously packed with a blend of roasted premium nuts.',
    19.90, 80, 'Sugar, pistachio, hazelnut, almond, walnut',
    400, '400g', TRUE, ARRAY['mixed-nuts','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 43. Rose Petal Pistachio Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Rose Petal Pistachio Lokum', 'rose-petal-pistachio-lokum',
    'Delicate Turkish delight infused with rosewater and finished with whole pistachios and edible rose petals.',
    18.40, 95, 'Sugar, cornstarch, rosewater, pistachio, dried rose petals',
    350, '350g', TRUE, ARRAY['rose','pistachio','floral'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- 44. Orange Blossom Almond Lokum
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Orange Blossom Almond Lokum', 'orange-blossom-almond-lokum',
    'Soft lokum flavored with orange blossom and enriched with crunchy almonds.',
    17.90, 100, 'Sugar, cornstarch, orange blossom extract, roasted almonds',
    350, '350g', FALSE, ARRAY['almond','citrus'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_lokum) ON CONFLICT DO NOTHING; END IF;

  -- ── HALVA ────────────────────────────────────────────────────────────────────

  -- 7. Classic Tahini Halva
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Classic Tahini Halva', 'classic-tahini-halva',
    'Traditional sesame halva with crumbly texture and nutty flavor.',
    12.90, 140, 'Tahini, sugar, vanilla extract',
    400, '400g', FALSE, ARRAY['sesame','traditional'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 8. Pistachio Marble Halva
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Pistachio Marble Halva', 'pistachio-marble-halva',
    'Swirled halva infused with pistachio paste for a luxurious taste.',
    15.90, 100, 'Tahini, pistachio paste, sugar',
    400, '400g', TRUE, ARRAY['pistachio','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 19. Chocolate Swirl Halva
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Chocolate Swirl Halva', 'chocolate-swirl-halva',
    'Classic sesame halva marbled with smooth cocoa swirls.',
    16.90, 90, 'Tahini, cocoa, sugar',
    400, '400g', FALSE, ARRAY['chocolate','sesame'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 20. Vanilla Almond Halva
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Vanilla Almond Halva', 'vanilla-almond-halva',
    'Creamy halva blended with roasted almonds and natural vanilla.',
    17.50, 80, 'Tahini, roasted almonds, vanilla extract',
    400, '400g', FALSE, ARRAY['almond','vanilla'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 34. Pistachio Crunch Halva Bars
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Pistachio Crunch Halva Bars', 'pistachio-crunch-halva-bars',
    'Crunchy halva bars enriched with generous pistachio chunks.',
    18.90, 85, 'Tahini, pistachio pieces, sugar',
    420, '420g', FALSE, ARRAY['pistachio','crunchy'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 35. Dark Chocolate Halva Cubes
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Dark Chocolate Halva Cubes', 'dark-chocolate-halva-cubes',
    'Sesame halva cubes dipped in rich dark chocolate for an indulgent finish.',
    19.50, 70, 'Tahini, dark chocolate coating, sugar',
    380, '380g', TRUE, ARRAY['chocolate','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 47. Honey Sesame Halva Swirl
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Honey Sesame Halva Swirl', 'honey-sesame-halva-swirl',
    'Classic sesame halva swirled with natural honey for a smooth and rich finish.',
    17.50, 90, 'Tahini, honey, sesame seeds',
    400, '400g', FALSE, ARRAY['honey','sesame'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- 48. Vanilla Almond Halva Deluxe
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Vanilla Almond Halva Deluxe', 'vanilla-almond-halva-deluxe',
    'Creamy tahini halva enhanced with aromatic vanilla and crunchy almonds.',
    19.20, 75, 'Tahini, vanilla extract, roasted almonds',
    400, '400g', FALSE, ARRAY['vanilla','almond'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_halva) ON CONFLICT DO NOTHING; END IF;

  -- ── PREMIUM GIFT BOXES ────────────────────────────────────────────────────────

  -- 9. Royal Baklava Gift Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Royal Baklava Gift Box', 'royal-baklava-gift-box',
    'An elegant gold-accented box featuring a curated selection of our finest baklava.',
    59.90, 50, 'Mixed baklava selection',
    1000, '1kg', TRUE, ARRAY['gift','luxury'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 10. Luxury Lokum Selection Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Luxury Lokum Selection Box', 'luxury-lokum-selection-box',
    'Premium assortment of artisan Turkish delights in an elegant gift box.',
    49.90, 60, 'Mixed lokum flavors',
    900, '900g', TRUE, ARRAY['gift','lokum'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 21. Ottoman Luxury Sweet Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Ottoman Luxury Sweet Box', 'ottoman-luxury-sweet-box',
    'An opulent assortment of baklava, lokum and halva presented in a velvet-lined luxury box.',
    79.90, 40, 'Mixed premium sweets selection',
    1200, '1.2kg', TRUE, ARRAY['luxury','gift','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 22. Ramadan Special Assorted Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Ramadan Special Assorted Box', 'ramadan-special-assorted-box',
    'Curated assortment of traditional sweets perfect for sharing during Ramadan gatherings.',
    69.90, 50, 'Mixed sweets selection',
    1000, '1kg', FALSE, ARRAY['seasonal','gift'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 36. Signature Sweet Celebration Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Signature Sweet Celebration Box', 'signature-sweet-celebration-box',
    'Our most exclusive gift box featuring a handpicked assortment of signature sweets.',
    89.90, 35, 'Mixed premium baklava, lokum, halva selection',
    1300, '1.3kg', TRUE, ARRAY['luxury','gift','exclusive'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 37. Engagement Sweet Gift Tray
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Engagement Sweet Gift Tray', 'engagement-sweet-gift-tray',
    'Elegant tray designed for engagement celebrations with a curated sweet selection.',
    109.90, 25, 'Premium assorted sweets',
    1500, '1.5kg', FALSE, ARRAY['celebration','luxury'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 49. Luxury Ramadan Sweet Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Luxury Ramadan Sweet Box', 'luxury-ramadan-sweet-box',
    'An exclusive Ramadan gift box curated with the finest traditional sweets.',
    119.90, 20, 'Premium baklava, dates, lokum selection',
    1800, '1.8kg', TRUE, ARRAY['ramadan','gift','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 50. Golden Eid Celebration Box
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Golden Eid Celebration Box', 'golden-eid-celebration-box',
    'A luxurious Eid celebration assortment presented in an elegant golden box.',
    129.90, 18, 'Assorted premium sweets selection',
    2000, '2kg', TRUE, ARRAY['eid','luxury','gift'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- 60. Luxury Sweet Tasting Collection
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Luxury Sweet Tasting Collection', 'luxury-sweet-tasting-collection',
    'The ultimate tasting experience featuring our finest luxury sweets in one collection.',
    149.90, 12, 'Exclusive assortment of premium sweets',
    2200, '2.2kg', TRUE, ARRAY['luxury','exclusive','gift'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_gift_boxes) ON CONFLICT DO NOTHING; END IF;

  -- ── ARABIC SWEETS ─────────────────────────────────────────────────────────────

  -- 11. Maamoul with Dates
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Maamoul with Dates', 'maamoul-with-dates',
    'Traditional Middle Eastern shortbread cookies filled with sweet date paste.',
    18.50, 90, 'Semolina, dates, butter',
    500, '500g', FALSE, ARRAY['dates','traditional'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_arabic) ON CONFLICT DO NOTHING; END IF;

  -- 12. Basbousa Coconut Cake
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Basbousa Coconut Cake', 'basbousa-coconut-cake',
    'Moist semolina cake soaked in light syrup and topped with coconut flakes.',
    19.90, 70, 'Semolina, coconut, syrup',
    600, '600g', FALSE, ARRAY['cake','coconut'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_arabic) ON CONFLICT DO NOTHING; END IF;

  -- ── DATE-BASED SWEETS ─────────────────────────────────────────────────────────

  -- 23. Stuffed Date Medjool Deluxe
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Stuffed Date Medjool Deluxe', 'stuffed-date-medjool-deluxe',
    'Large Medjool dates filled with almond paste and topped with crushed pistachios.',
    24.90, 100, 'Medjool dates, almond paste, pistachio',
    400, '400g', TRUE, ARRAY['dates','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 24. Chocolate Covered Dates
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Chocolate Covered Dates', 'chocolate-covered-dates',
    'Naturally sweet dates dipped in smooth Belgian dark chocolate.',
    21.90, 110, 'Dates, dark chocolate',
    350, '350g', FALSE, ARRAY['dates','chocolate'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 25. Pistachio Date Rolls
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Pistachio Date Rolls', 'pistachio-date-rolls',
    'Soft date paste rolled in crushed pistachios for a balanced nutty sweetness.',
    19.90, 90, 'Date paste, pistachio crumbs',
    400, '400g', FALSE, ARRAY['dates','pistachio'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 38. Coconut Date Energy Bites
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Coconut Date Energy Bites', 'coconut-date-energy-bites',
    'Naturally sweet date bites blended with coconut and almond butter.',
    17.90, 95, 'Date paste, coconut flakes, almond butter',
    350, '350g', FALSE, ARRAY['dates','healthy'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 39. Walnut Stuffed Dates Deluxe
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Walnut Stuffed Dates Deluxe', 'walnut-stuffed-dates-deluxe',
    'Premium Medjool dates filled with crunchy walnut halves.',
    22.90, 85, 'Medjool dates, walnut halves',
    400, '400g', FALSE, ARRAY['dates','walnut'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 40. Saffron Infused Date Confections
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Saffron Infused Date Confections', 'saffron-infused-date-confections',
    'Refined saffron-infused date sweets with a soft almond finish.',
    26.90, 60, 'Date paste, saffron extract, almond flour',
    350, '350g', TRUE, ARRAY['dates','saffron','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 51. Chocolate Covered Almond Dates
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Chocolate Covered Almond Dates', 'chocolate-covered-almond-dates',
    'Premium dates stuffed with almonds and coated in smooth dark chocolate.',
    24.50, 80, 'Medjool dates, roasted almonds, dark chocolate',
    400, '400g', TRUE, ARRAY['dates','chocolate'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 52. Pistachio Cream Stuffed Dates
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Pistachio Cream Stuffed Dates', 'pistachio-cream-stuffed-dates',
    'Soft dates filled with velvety pistachio cream for a refined taste experience.',
    23.90, 85, 'Medjool dates, pistachio cream filling',
    380, '380g', FALSE, ARRAY['dates','pistachio'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- 53. Spiced Arabian Date Rolls
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Spiced Arabian Date Rolls', 'spiced-arabian-date-rolls',
    'Traditional Arabian-style date rolls infused with warming spices.',
    19.90, 95, 'Date paste, cinnamon, cardamom, almond flour',
    350, '350g', FALSE, ARRAY['dates','spiced'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_dates) ON CONFLICT DO NOTHING; END IF;

  -- ── TEA & COFFEE PAIRINGS ─────────────────────────────────────────────────────

  -- 26. Arabic Coffee with Cardamom
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Arabic Coffee with Cardamom', 'arabic-coffee-with-cardamom',
    'Traditional Arabic coffee lightly roasted and infused with aromatic cardamom.',
    14.90, 150, 'Light roast coffee, ground cardamom',
    250, '250g', FALSE, ARRAY['coffee','pairing'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_coffee) ON CONFLICT DO NOTHING; END IF;

  -- 27. Premium Turkish Black Tea
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Premium Turkish Black Tea', 'premium-turkish-black-tea',
    'Strong and smooth Turkish black tea, perfect with baklava and lokum.',
    12.90, 160, 'Black tea leaves',
    500, '500g', FALSE, ARRAY['tea','traditional'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_coffee) ON CONFLICT DO NOTHING; END IF;

  -- 41. Ottoman Apple Tea Blend
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Ottoman Apple Tea Blend', 'ottoman-apple-tea-blend',
    'Traditional Turkish apple tea with sweet and tangy notes.',
    13.90, 140, 'Dried apple, hibiscus, natural flavoring',
    400, '400g', FALSE, ARRAY['tea','fruit'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_coffee) ON CONFLICT DO NOTHING; END IF;

  -- 42. Premium Turkish Coffee Fine Grind
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Premium Turkish Coffee Fine Grind', 'premium-turkish-coffee-fine-grind',
    'Finely ground Turkish coffee with a bold aroma and smooth crema.',
    16.90, 130, '100% Arabica coffee beans',
    250, '250g', FALSE, ARRAY['coffee','premium'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_coffee) ON CONFLICT DO NOTHING; END IF;

  -- 54. Persian Saffron Tea Blend
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Persian Saffron Tea Blend', 'persian-saffron-tea-blend',
    'Premium black tea delicately blended with aromatic Persian saffron.',
    18.90, 110, 'Black tea leaves, saffron threads',
    250, '250g', FALSE, ARRAY['tea','saffron'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_coffee) ON CONFLICT DO NOTHING; END IF;

  -- 55. Cardamom Turkish Coffee Blend
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Cardamom Turkish Coffee Blend', 'cardamom-turkish-coffee-blend',
    'Traditional Turkish coffee blended with aromatic cardamom spice.',
    17.50, 120, 'Arabica coffee, ground cardamom',
    250, '250g', FALSE, ARRAY['coffee','spiced'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_coffee) ON CONFLICT DO NOTHING; END IF;

  -- ── TEA ACCESSORIES ───────────────────────────────────────────────────────────

  -- 56. Copper Turkish Coffee Pot (Cezve)
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Copper Turkish Coffee Pot (Cezve)', 'copper-turkish-coffee-pot-cezve',
    'Authentic handcrafted copper cezve for brewing traditional Turkish coffee.',
    39.90, 60, 'Handcrafted copper',
    NULL, '1 piece', FALSE, ARRAY['accessory','coffee'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_acc) ON CONFLICT DO NOTHING; END IF;

  -- 57. Ottoman Tea Glass Set (6 pcs)
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Ottoman Tea Glass Set (6 pcs)', 'ottoman-tea-glass-set',
    'Elegant Ottoman-style tea glasses with delicate gold accents.',
    44.90, 50, 'Glass with gold detailing',
    NULL, '6 pieces', FALSE, ARRAY['accessory','tea'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_tea_acc) ON CONFLICT DO NOTHING; END IF;

  -- ── GOURMET SPREADS ───────────────────────────────────────────────────────────

  -- 58. Premium Pistachio Spread
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Premium Pistachio Spread', 'premium-pistachio-spread',
    'Smooth and rich pistachio spread crafted from premium roasted nuts.',
    21.90, 85, 'Roasted pistachios, sugar, natural oils',
    300, '300g', TRUE, ARRAY['spread','pistachio'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_spreads) ON CONFLICT DO NOTHING; END IF;

  -- 59. Rose Honey Syrup
  INSERT INTO products (title, slug, description, price, stock, ingredients, weight_grams, weight_display, is_featured, tags)
  VALUES ('Rose Honey Syrup', 'rose-honey-syrup',
    'Floral rose-infused honey syrup perfect for desserts and tea.',
    14.90, 100, 'Pure honey, rose extract',
    250, '250ml', FALSE, ARRAY['honey','rose'])
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, stock=EXCLUDED.stock,
    description=EXCLUDED.description, ingredients=EXCLUDED.ingredients, weight_grams=EXCLUDED.weight_grams,
    weight_display=EXCLUDED.weight_display, is_featured=EXCLUDED.is_featured, tags=EXCLUDED.tags
  RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN INSERT INTO product_categories (product_id, category_id) VALUES (prod_id, cat_spreads) ON CONFLICT DO NOTHING; END IF;

END $$;
