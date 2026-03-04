# Safir Delights ✦

> **Authentic Turkish & Middle Eastern Sweets — Delivered Worldwide**
>
> A production-ready premium e-commerce SaaS built with Next.js 16, TypeScript, TailwindCSS v4, and Supabase.

![Safir Delights Banner](https://placehold.co/1200x400/064E3B/D4AF37?text=Safir+Delights+%E2%9C%A6+Premium+Turkish+%26+Middle+Eastern+Sweets)

---

## Brand Identity

**Safir Delights** is a premium SaaS e-commerce platform specializing in authentic Turkish and Middle Eastern confectionery. Founded with the mission of connecting artisan sweet makers in Istanbul with customers worldwide, it showcases enterprise-grade architecture with a luxurious, modern UI.

- **Primary color:** Deep Emerald `#064E3B`
- **Accent:** Gold `#D4AF37`
- **Background:** Warm Cream `#FFF8ED`
- **Typography:** Playfair Display (headings) + DM Sans (body)

---

## Screenshots

> _Add screenshots here_

| Home Page | Shop | Product Detail |
|-----------|------|----------------|
| ![Home](screenshots/home.png) | ![Shop](screenshots/shop.png) | ![Product](screenshots/product.png) |

---

## Architecture

This project follows a strict **4-layer architecture** to ensure separation of concerns, testability, and scalability:

```
Browser / Next.js Pages (UI)
    ↓
API Routes (Next.js Route Handlers)
    ↓
Services (Business Logic)
    ↓
Repositories (Database Access)
    ↓
Supabase (PostgreSQL + Auth + Storage)
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Pages** | `app/**/page.tsx` | UI rendering, data fetching (Server Components) |
| **API Routes** | `app/api/**` | HTTP endpoints, Zod validation, auth checks |
| **Services** | `services/` | Business rules, validation, orchestration |
| **Repositories** | `repositories/` | Raw database queries, data mapping |
| **Context** | `context/` | Client-side state (Cart) |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | Full-stack React framework (App Router) |
| **TypeScript** | 5+ | Type safety throughout |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Supabase** | Latest | PostgreSQL, Auth, Row Level Security |
| **@supabase/ssr** | 0.8+ | Cookie-based SSR auth |
| **Framer Motion** | Latest | Smooth animations |
| **Zod** | Latest | Schema validation on API routes |
| **Sonner** | Latest | Toast notifications |
| **Lucide React** | Latest | Icon library |
| **Playfair Display** | — | Serif typography (Google Fonts) |
| **DM Sans** | — | Body typography (Google Fonts) |

---

## Features

### Customer-facing
- 🏠 **Premium Landing Page** — Hero, categories, best sellers, testimonials, newsletter
- 🛍️ **Product Shop** — Pagination, category filters, search, skeleton loading
- 🛒 **Shopping Cart** — Real-time state via React Context, synced with Supabase
- 📦 **Order Management** — Checkout flow, order history in account dashboard
- 👤 **User Account** — Order stats, history, profile
- 📖 **Blog / Journal** — Static content showcasing brand storytelling
- 📬 **Contact Page** — Contact form with validation and FAQ
- 🌐 **About Page** — Brand story, team, values

### Admin Panel
- 📊 **Overview Dashboard** — Stats and recent orders
- ✏️ **Product CRUD** — Create, edit, delete products with image preview
- 🗂️ **Category CRUD** — Manage categories
- 📋 **Order Management** — View all orders, update status

### Technical
- 🔐 **Row Level Security** — PostgreSQL RLS policies on all tables
- ✅ **Zod Validation** — API route input validation
- 🔔 **Toast Notifications** — User feedback for all async actions
- ⚡ **Skeleton Loading** — Smooth loading states everywhere
- 🎨 **Framer Motion** — Product card animations
- 📱 **Fully Responsive** — Mobile-first design
- 🔍 **SEO Optimized** — Metadata, OpenGraph tags on all pages
- 🚦 **Middleware Protection** — Route guards for auth and admin
- 🏗️ **TypeScript Strict** — End-to-end type safety

---

## Database Schema

```sql
categories          -- Product categories (baklava, lokum, etc.)
products            -- Products with rich fields (ingredients, weight, tags, etc.)
product_categories  -- Many-to-many product ↔ category
cart_items          -- Per-user shopping cart
orders              -- Customer orders
order_items         -- Line items (price snapshot at purchase time)
roles               -- User roles (user / admin)
```

### Key Fields (v1.1)

Products now support:
- `slug` — SEO-friendly URL identifier
- `ingredients` — Full ingredients list
- `weight_grams` — Package weight
- `discount_percent` — Sale percentage
- `is_featured` — Homepage featuring
- `is_best_seller` — Best seller badge
- `tags` — PostgreSQL array for flexible tagging

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd app
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database setup

Run the SQL migrations in your Supabase SQL Editor in order:

```
supabase/migrations/001_initial_schema.sql   — Core schema + RLS
supabase/migrations/002_seed_data.sql        — Initial placeholder data
supabase/migrations/003_product_fields.sql   — Extended product fields + categories
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create an admin user

After registering, run this in Supabase SQL Editor:

```sql
UPDATE roles SET role = 'admin' WHERE user_id = 'your-user-uuid';
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set all environment variables in the Vercel dashboard.

### Self-hosted

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
├── (pages)/            — Route pages
│   ├── page.tsx        — Home / landing
│   ├── shop/           — Product catalog
│   ├── product/[id]/   — Product detail
│   ├── cart/           — Shopping cart
│   ├── checkout/       — Checkout
│   ├── account/        — User account & orders
│   ├── about/          — Brand story
│   ├── contact/        — Contact form
│   ├── blog/           — Blog / journal
│   ├── admin/          — Admin panel
│   ├── login/          — Authentication
│   └── register/       — Registration
├── api/                — Route handlers (REST API)
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── orders/
│   └── admin/
components/
├── catalog/            — ProductCard, SearchBar, CategoryFilter, Pagination
├── cart/               — CartItemRow
├── dashboard/          — OrderCard, OrderStatusBadge
├── layout/             — Header, Footer, Sidebar
├── admin/              — ProductForm, CategoryForm, OrderTable
└── ui/                 — Button, Input, Badge, Skeleton, EmptyState, Modal
services/               — Business logic layer
repositories/           — Database access layer
context/                — CartContext (client-side state)
lib/
├── supabase/           — Browser / server / admin clients
└── validations.ts      — Zod schemas
types/                  — TypeScript interfaces and DTOs
config/                 — Routes, constants, brand tokens
utils/                  — cn, format, validators, animations
supabase/migrations/    — SQL migration files
```

---

## Roadmap

- [ ] Stripe payment integration
- [ ] Email notifications (Resend)
- [ ] Image upload to Supabase Storage
- [ ] Full-text search (PostgreSQL tsvector)
- [ ] Product reviews & ratings
- [ ] Wishlist persistence
- [ ] Coupon / discount codes
- [ ] Analytics dashboard
- [ ] PWA support

---

## License

MIT — free for personal and commercial use.

---

Made with ✦ in Istanbul · Built on [Next.js](https://nextjs.org) · Powered by [Supabase](https://supabase.com)
