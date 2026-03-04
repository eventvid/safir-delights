import Link from 'next/link'
import { ArrowRight, Truck, ShieldCheck, Star, Gift, Globe, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductService } from '@/services/product.service'
import { ProductCard } from '@/components/catalog/ProductCard'
import { FEATURED_CATEGORIES } from '@/config/constants'
import { ROUTES as R } from '@/config/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safir Delights — Authentic Turkish & Middle Eastern Sweets',
  description:
    'Discover the finest baklava, Turkish delight, künefe and Middle Eastern sweets. Handcrafted with centuries-old recipes, delivered worldwide.',
}

const TRUST_BADGES = [
  { icon: Truck,       label: 'Free Worldwide Shipping',   sub: 'On orders over $75' },
  { icon: ShieldCheck, label: 'Authenticity Guaranteed',   sub: '100% original recipes' },
  { icon: Gift,        label: 'Gift Wrapping',             sub: 'Complimentary on all orders' },
  { icon: Globe,       label: 'Ships to 50+ Countries',    sub: 'Fresh from Istanbul' },
]

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'New York, USA',
    rating: 5,
    text: "The baklava melted in my mouth. I've been to Istanbul twice and this tastes exactly like what I had there. Absolutely incredible quality.",
    avatar: '👩',
  },
  {
    name: 'James L.',
    location: 'London, UK',
    rating: 5,
    text: "Ordered the mixed gift box for my parents' anniversary. They were over the moon. The presentation was stunning and the sweets were divine.",
    avatar: '👨',
  },
  {
    name: 'Fatima K.',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'Finally found a place that makes Turkish delight the proper way. Soft, fragrant, and so flavorful. Will order again and again.',
    avatar: '👩‍🦱',
  },
]

const BLOG_POSTS = [
  {
    title: 'The Art of Perfect Baklava: A 500-Year-Old Recipe',
    excerpt: 'Journey through the history of baklava and discover how Safir Delights preserves the authentic Ottoman technique.',
    category: 'Heritage',
    date: 'Feb 15, 2026',
    emoji: '🥐',
  },
  {
    title: 'Turkish Delight: More Than Just a Candy',
    excerpt: 'Lokum has been a staple of Turkish culture for centuries. Learn about its fascinating history and modern variations.',
    category: 'Culture',
    date: 'Jan 28, 2026',
    emoji: '🌸',
  },
  {
    title: 'Gifting Guide: Perfect Sweets for Every Occasion',
    excerpt: 'From Eid celebrations to corporate gifts, our experts share the best sweet selections for every event.',
    category: 'Guide',
    date: 'Jan 10, 2026',
    emoji: '🎁',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const productService = new ProductService(supabase)
  const { data: featuredProducts } = await productService.getProducts({ isFeatured: true, limit: 8, page: 1 })

  return (
    <div style={{ backgroundColor: '#071f1c' }}>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#082E2C', minHeight: '92vh' }}
      >
        {/* Radial hero glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(6,95,70,0.5) 0%, transparent 65%), ' +
              'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(212,175,55,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium"
            style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)' }}
          >
            <Star className="h-3.5 w-3.5" style={{ fill: '#D4AF37' }} />
            Trusted by 10,000+ customers worldwide
            <Star className="h-3.5 w-3.5" style={{ fill: '#D4AF37' }} />
          </div>

          {/* Heading */}
          <h1
            className="mx-auto max-w-4xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Taste the{' '}
            <span style={{ color: '#D4AF37' }}>Authenticity</span>
            <br />
            of the Orient
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.65)' }}
          >
            Handcrafted Turkish &amp; Middle Eastern sweets made with centuries-old recipes.
            From the bazaars of Istanbul to your door — fresh, authentic, and unforgettable.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={R.SHOP}
              className="btn-gold-shimmer inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{ color: '#064E3B', boxShadow: '0 8px 32px rgba(212,175,55,0.25)' }}
            >
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            {!user && (
              <Link
                href={R.REGISTER}
                className="inline-flex items-center gap-2 rounded-2xl border px-8 py-4 text-base font-medium transition-all duration-200 hover:scale-105"
                style={{ borderColor: 'rgba(245,240,232,0.2)', color: '#F5F0E8', backgroundColor: 'rgba(245,240,232,0.04)' }}
              >
                Create Account
              </Link>
            )}
          </div>

          {/* Social proof stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
            {[
              { value: '60+', label: 'Sweet varieties' },
              { value: '50+', label: 'Countries served' },
              { value: '10k+', label: 'Happy customers' },
              { value: '4.9★', label: 'Average rating' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#D4AF37' }}
                >
                  {value}
                </div>
                <div className="mt-0.5 text-sm" style={{ color: 'rgba(245,240,232,0.45)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.5)' }}>
            Explore
          </div>
          <div
            className="h-8 w-0.5 animate-bounce rounded-full"
            style={{ backgroundColor: 'rgba(212,175,55,0.35)' }}
          />
        </div>
      </section>

      {/* ── Trust badges ──────────────────────────────────────────── */}
      <section
        className="border-y"
        style={{ backgroundColor: '#041512', borderColor: 'rgba(212,175,55,0.1)' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: '#D4AF37' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured categories ───────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#071f1c' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              ✦ Our Specialties
            </p>
            <h2
              className="mt-2 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
            >
              Explore by Category
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: '#9DB8B5' }}>
              From delicate baklava to rich halva — we carry the full spectrum of Middle Eastern confectionery.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`${R.SHOP}?category=${cat.slug}`}
                className="hover-card-gold group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: 'rgba(212,175,55,0.12)',
                  backgroundColor: '#0A3B38',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                  >
                    {cat.emoji}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold transition-colors group-hover:text-[#D4AF37]"
                      style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                    >
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: '#D4AF37' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ─────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section
          className="py-20 border-t"
          style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.1)' }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                  ✦ Customer Favorites
                </p>
                <h2
                  className="mt-2 text-3xl font-bold sm:text-4xl"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                >
                  Featured Sweets
                </h2>
              </div>
              <Link
                href={R.SHOP}
                className="flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-80"
                style={{ color: '#D4AF37' }}
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} isLoggedIn={!!user} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Brand story ───────────────────────────────────────────── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: '#071f1c' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 0% 50%, rgba(6,95,70,0.2) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                ✦ Our Story
              </p>
              <h2
                className="mt-3 text-3xl font-bold leading-snug sm:text-4xl"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                From Istanbul&apos;s Grand Bazaar
                <br />
                <span style={{ color: '#D4AF37' }}>to Your Doorstep</span>
              </h2>
              <p className="mt-6 leading-relaxed" style={{ color: '#9DB8B5' }}>
                Founded in 2024, Safir Delights bridges the gap between ancient Ottoman confectionery
                traditions and modern global delivery. Each sweet is crafted by master pastry artisans
                in Istanbul using recipes passed down through generations.
              </p>
              <p className="mt-4 leading-relaxed" style={{ color: '#9DB8B5' }}>
                We source only the finest pistachios from Gaziantep, pure blossom honey from Anatolia,
                and premium rose water from the Bulgarian rose valleys — because authentic flavor
                demands nothing less.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { icon: Award,       label: '500-year-old recipes' },
                  { icon: ShieldCheck, label: 'No artificial flavors' },
                  { icon: Truck,       label: 'Ships fresh daily' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: '#D4AF37' }} />
                    <span className="text-sm" style={{ color: '#9DB8B5' }}>{label}</span>
                  </div>
                ))}
              </div>
              <Link
                href={R.ABOUT}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-medium transition-all hover:scale-105"
                style={{ borderColor: 'rgba(212,175,55,0.35)', color: '#D4AF37' }}
              >
                Read Our Story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Visual grid */}
            <div className="grid grid-cols-2 gap-4">
              {['🥐', '🌸', '🍫', '🎁'].map((emoji, i) => (
                <div
                  key={i}
                  className="flex h-40 items-center justify-center rounded-2xl text-5xl transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(212,175,55,0.1)' : '#082E2C',
                    border: '1px solid rgba(212,175,55,0.15)',
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section
        className="py-20 border-t"
        style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.1)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              ✦ What Our Customers Say
            </p>
            <h2
              className="mt-2 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
            >
              Loved Around the World
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="hover-card-gold rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: '#0A3B38',
                  borderColor: 'rgba(212,175,55,0.12)',
                }}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: '#9DB8B5' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: '#9DB8B5' }}>
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog preview ──────────────────────────────────────────── */}
      <section
        className="py-20 border-t"
        style={{ backgroundColor: '#071f1c', borderColor: 'rgba(212,175,55,0.1)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                ✦ From Our Journal
              </p>
              <h2
                className="mt-2 text-3xl font-bold sm:text-4xl"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                Stories &amp; Recipes
              </h2>
            </div>
            <Link
              href={R.BLOG}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: '#D4AF37' }}
            >
              All posts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.title}
                className="hover-card-gold group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#0A3B38', borderColor: 'rgba(212,175,55,0.12)' }}
              >
                <div
                  className="flex h-40 items-center justify-center text-5xl"
                  style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}
                >
                  {post.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: '#9DB8B5' }}>{post.date}</span>
                  </div>
                  <h3
                    className="mt-2 font-semibold leading-snug"
                    style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: '#9DB8B5' }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: '#D4AF37' }}>
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#041512' }}>
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="text-4xl" style={{ color: '#D4AF37' }}>✦</div>
          <h2
            className="mt-4 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Sweet Deals, Delivered Weekly
          </h2>
          <p className="mt-4 text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>
            Subscribe for exclusive offers, new arrivals, and sweet inspiration from Istanbul.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-2xl border px-5 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#D4AF37]/40"
              style={{
                backgroundColor: 'rgba(245,240,232,0.05)',
                borderColor: 'rgba(212,175,55,0.25)',
                color: '#F5F0E8',
                maxWidth: '360px',
              }}
            />
            <button
              className="btn-gold-shimmer rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all hover:scale-105"
              style={{ color: '#064E3B' }}
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs" style={{ color: 'rgba(245,240,232,0.25)' }}>
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* ── CTA for guests ────────────────────────────────────────── */}
      {!user && (
        <section
          className="py-16 border-t"
          style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.1)' }}
        >
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
            >
              Ready to taste the authentic Orient?
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#9DB8B5' }}>
              Create a free account and get 10% off your first order.
            </p>
            <Link
              href={R.REGISTER}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                color: '#064E3B',
                boxShadow: '0 8px 24px rgba(212,175,55,0.2)',
              }}
            >
              Create Account — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
