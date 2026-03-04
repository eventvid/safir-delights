import type React from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal & Recipes',
  description:
    'Stories, recipes, and the rich cultural heritage behind Turkish and Middle Eastern sweets.',
}

const POSTS = [
  {
    slug: 'art-of-perfect-baklava',
    title: 'The Art of Perfect Baklava: A 500-Year Ottoman Legacy',
    excerpt:
      'Journey through the history of baklava — from its imperial origins in Topkapı Palace to the hand-rolled pastries crafted in Gaziantep today. Discover what makes authentic baklava truly extraordinary.',
    category: 'Heritage',
    readTime: '8 min',
    date: 'Feb 15, 2026',
    emoji: '🥐',
    featured: true,
  },
  {
    slug: 'turkish-delight-guide',
    title: 'Turkish Delight: The Sweet That Conquered the World',
    excerpt:
      'Lokum has been a staple of Turkish culture since the 15th century. From rose-scented classics to modern pistachio varieties — a guide to the most beloved sweet in the Middle East.',
    category: 'Culture',
    readTime: '6 min',
    date: 'Jan 28, 2026',
    emoji: '🌸',
    featured: false,
  },
  {
    slug: 'gifting-guide-2026',
    title: 'The Ultimate Gifting Guide: Sweet Selections for Every Occasion',
    excerpt:
      'From Eid celebrations to corporate appreciation gifts — our experts share the perfect Safir Delights selections for birthdays, weddings, Ramadan, and more.',
    category: 'Guide',
    readTime: '5 min',
    date: 'Jan 10, 2026',
    emoji: '🎁',
    featured: false,
  },
  {
    slug: 'kunefe-recipe',
    title: 'Künefe at Home: A Step-by-Step Recipe from Our Master Chef',
    excerpt:
      "Warm, stretchy cheese between golden threads of kadayıf, soaked in fragrant syrup — our head chef Mehmet shares his family's recipe for this iconic Turkish dessert.",
    category: 'Recipe',
    readTime: '10 min',
    date: 'Dec 20, 2025',
    emoji: '🧀',
    featured: false,
  },
  {
    slug: 'dates-varieties-guide',
    title: 'Medjool vs Ajwa: A Complete Guide to Premium Dates',
    excerpt:
      "Not all dates are created equal. Learn the differences between the world's most prized date varieties and why quality sourcing makes all the difference in taste.",
    category: 'Education',
    readTime: '7 min',
    date: 'Dec 5, 2025',
    emoji: '🌴',
    featured: false,
  },
  {
    slug: 'istanbul-sweet-tour',
    title: "A Sweet Tour of Istanbul's Grand Bazaar",
    excerpt:
      'Follow our co-founder Aisha through the labyrinthine alleys of the Grand Bazaar, discovering hidden sweet shops and the stories behind the oldest confectionery families.',
    category: 'Travel',
    readTime: '12 min',
    date: 'Nov 18, 2025',
    emoji: '🕌',
    featured: false,
  },
]

const CATEGORY_COLORS: Record<string, React.CSSProperties> = {
  Heritage: { backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37' },
  Culture: { backgroundColor: 'rgba(6,95,70,0.3)', color: '#9DB8B5' },
  Guide: { backgroundColor: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
  Recipe: { backgroundColor: 'rgba(239,68,68,0.12)', color: '#fca5a5' },
  Education: { backgroundColor: 'rgba(157,184,181,0.15)', color: '#9DB8B5' },
  Travel: { backgroundColor: 'rgba(167,139,250,0.15)', color: '#c4b5fd' },
}

export default function BlogPage() {
  const [featured, ...rest] = POSTS

  return (
    <div style={{ backgroundColor: '#071f1c', minHeight: '100vh' }}>
      {/* Header */}
      <section
        className="relative overflow-hidden py-20 text-center"
        style={{ backgroundColor: '#082E2C', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,95,70,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
            From Our Journal
          </p>
          <h1
            className="mt-3 text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Stories &amp; Recipes
          </h1>
          <p className="mt-4 text-sm" style={{ color: '#9DB8B5' }}>
            Discover the rich cultural heritage, recipes, and stories behind the world&apos;s
            finest confectionery traditions.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Featured post */}
        <article
          className="hover-card-gold group relative mb-12 overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 lg:p-12"
          style={{ borderColor: 'rgba(212,175,55,0.15)', backgroundColor: '#082E2C' }}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div
              className="flex h-64 items-center justify-center rounded-2xl text-7xl lg:h-80"
              style={{ backgroundColor: 'rgba(10,59,56,0.8)', border: '1px solid rgba(212,175,55,0.1)' }}
            >
              {featured.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={CATEGORY_COLORS[featured.category] ?? { backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                >
                  {featured.category}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                >
                  ✦ Featured
                </span>
              </div>
              <h2
                className="mt-4 text-2xl font-bold leading-snug sm:text-3xl"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                {featured.title}
              </h2>
              <p className="mt-4 leading-relaxed" style={{ color: '#9DB8B5' }}>
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: '#9DB8B5' }}>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readTime} read
                </span>
                <span>{featured.date}</span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: '#D4AF37' }}>
                Read article <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </article>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="hover-card-gold group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: 'rgba(212,175,55,0.15)', backgroundColor: '#0A3B38' }}
            >
              <div
                className="flex h-44 items-center justify-center text-5xl"
                style={{ backgroundColor: 'rgba(7,31,28,0.5)', borderBottom: '1px solid rgba(212,175,55,0.08)' }}
              >
                {post.emoji}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={
                      CATEGORY_COLORS[post.category] ?? {
                        backgroundColor: 'rgba(212,175,55,0.15)',
                        color: '#D4AF37',
                      }
                    }
                  >
                    {post.category}
                  </span>
                </div>
                <h3
                  className="mt-3 font-bold leading-snug transition-colors group-hover:opacity-80"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                >
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed line-clamp-3" style={{ color: '#9DB8B5' }}>
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs" style={{ color: '#9DB8B5' }}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} read
                  </span>
                  <span>{post.date}</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: '#D4AF37' }}>
                  Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
          <h3
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Browse by Topic
          </h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => (
              <button
                key={cat}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={colors}
              >
                <Tag className="h-3.5 w-3.5" />
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
