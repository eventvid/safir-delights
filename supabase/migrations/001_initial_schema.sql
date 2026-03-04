-- ============================================================
-- MarketPlace SaaS — Initial Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor (or use supabase db push)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- TABLES
-- ──────────────────────────────────────────────────────────────

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT           NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Product ↔ Category (many-to-many)
CREATE TABLE IF NOT EXISTS product_categories (
  product_id  UUID REFERENCES products(id)   ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (product_id, category_id)
);

-- Cart items (one row per user × product)
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID        NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID           NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  status      TEXT           NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Order line items (snapshot of product price at purchase time)
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID           NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id UUID           REFERENCES products(id)          ON DELETE SET NULL,
  quantity   INTEGER        NOT NULL CHECK (quantity > 0),
  price      DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- User roles (1:1 with auth.users, default = 'user')
CREATE TABLE IF NOT EXISTS roles (
  user_id    UUID    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT    NOT NULL DEFAULT 'user'
               CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_title         ON products (title);
CREATE INDEX IF NOT EXISTS idx_products_price         ON products (price);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id     ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id         ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status          ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items (order_id);

-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────

ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles             ENABLE ROW LEVEL SECURITY;

-- Helper: check if the current user has admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Categories ────────────────────────────────────────────────
-- Everyone can read; only admins can mutate
CREATE POLICY "categories_select_all"   ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_insert" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "categories_admin_update" ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "categories_admin_delete" ON categories FOR DELETE USING (is_admin());

-- ── Products ──────────────────────────────────────────────────
CREATE POLICY "products_select_all"   ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_insert" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_admin_update" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (is_admin());

-- ── Product categories ────────────────────────────────────────
CREATE POLICY "product_categories_select_all"  ON product_categories FOR SELECT USING (true);
CREATE POLICY "product_categories_admin_write" ON product_categories FOR ALL USING (is_admin());

-- ── Cart items ────────────────────────────────────────────────
-- Users only see and edit their own cart
CREATE POLICY "cart_user_select" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_user_insert" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_user_update" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_user_delete" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- ── Orders ────────────────────────────────────────────────────
-- Users see their own orders; admins see all
CREATE POLICY "orders_select" ON orders FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);
CREATE POLICY "orders_user_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_update" ON orders FOR UPDATE USING (is_admin());

-- ── Order items ───────────────────────────────────────────────
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
  )
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
  )
);

-- ── Roles ─────────────────────────────────────────────────────
-- Users can read their own role; admins can manage all roles
CREATE POLICY "roles_user_select" ON roles FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "roles_admin_all"   ON roles FOR ALL    USING (is_admin());

-- ──────────────────────────────────────────────────────────────
-- TRIGGERS
-- ──────────────────────────────────────────────────────────────

-- Auto-assign 'user' role when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update products.updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
