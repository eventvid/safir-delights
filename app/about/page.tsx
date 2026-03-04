import { Award, Heart, Leaf, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn the story behind Safir Delights — how we bring authentic Turkish and Middle Eastern sweets from Istanbul to your door.',
}

const VALUES = [
  {
    icon: Heart,
    title: 'Made with Love',
    description:
      'Every sweet is crafted by master artisans who have dedicated their lives to preserving the flavors of the Ottoman Empire.',
  },
  {
    icon: Leaf,
    title: 'Premium Ingredients',
    description:
      'We source only the finest pistachios from Gaziantep, pure honey from Anatolia, and rose water from Bulgarian rose valleys.',
  },
  {
    icon: Star,
    title: 'Authentic Recipes',
    description:
      'Our recipes date back 500+ years. No shortcuts, no artificial flavors — just time-tested methods passed through generations.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'We partner with small-scale artisan families in Turkey, ensuring fair trade and keeping traditional craftsmanship alive.',
  },
]

const TEAM = [
  { name: 'Mehmet Yilmaz', role: 'Head Pastry Chef', emoji: '👨‍🍳', years: '25 years experience' },
  { name: 'Aisha Hassan', role: 'Co-founder & CEO', emoji: '👩‍💼', years: 'Since 2024' },
  { name: 'Tarık Demir', role: 'Master Confectioner', emoji: '👨', years: '20 years experience' },
]

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#071f1c' }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-24 text-center"
        style={{ backgroundColor: '#082E2C', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,95,70,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
            Our Story
          </p>
          <h1
            className="mt-3 text-4xl font-bold leading-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Born in Istanbul,
            <br />
            <span style={{ color: '#D4AF37' }}>Delivered Worldwide</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed" style={{ color: '#9DB8B5' }}>
            Founded in 2024, Safir Delights was born from a simple mission: to share the
            extraordinary world of Turkish and Middle Eastern confectionery with sweet lovers
            everywhere on Earth.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        className="border-b"
        style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.12)' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '500+', label: 'Years of Recipes' },
              { value: '60+', label: 'Sweet Varieties' },
              { value: '50+', label: 'Countries Served' },
              { value: '10k+', label: 'Happy Customers' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#D4AF37' }}
                >
                  {value}
                </div>
                <div className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20" style={{ backgroundColor: '#071f1c' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Visual */}
            <div className="grid grid-cols-2 gap-4">
              {['🥐', '🌸', '🍫', '🌴'].map((emoji, i) => (
                <div
                  key={i}
                  className="flex h-44 items-center justify-center rounded-2xl text-5xl transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(10,59,56,0.6)' : '#0A3B38',
                    border: '1px solid rgba(212,175,55,0.15)',
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                How It Started
              </p>
              <h2
                className="mt-3 text-3xl font-bold sm:text-4xl"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                A Passion for Authentic Flavor
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed" style={{ color: '#9DB8B5' }}>
                <p>
                  Our co-founder Aisha spent three years traveling through Turkey, Lebanon, and the
                  Gulf states, documenting the confectionery traditions of each region. What struck
                  her was how each sweet told a story — of spice routes, royal banquets, and family
                  celebrations passed down through centuries.
                </p>
                <p>
                  Partnering with master pastry chef Mehmet Yilmaz, whose family has operated a
                  baklava workshop in Istanbul&apos;s Grand Bazaar for four generations, Safir
                  Delights was born — a digital bridge between ancient craft and modern convenience.
                </p>
                <p>
                  Today, we work with 12 artisan families across Turkey, ensuring every product
                  carries the authentic taste and cultural heritage that makes these sweets so special.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 border-t"
        style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.12)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              What We Stand For
            </p>
            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
            >
              Our Values
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: '#0A3B38',
                  borderColor: 'rgba(212,175,55,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                >
                  <Icon className="h-6 w-6" style={{ color: '#D4AF37' }} />
                </div>
                <h3
                  className="mt-4 font-semibold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9DB8B5' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="py-20 border-t"
        style={{ backgroundColor: '#071f1c', borderColor: 'rgba(212,175,55,0.12)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              The People Behind the Sweets
            </p>
            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
            >
              Meet Our Team
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="w-60 rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: '#0A3B38',
                  borderColor: 'rgba(212,175,55,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                  style={{ backgroundColor: 'rgba(212,175,55,0.08)' }}
                >
                  {member.emoji}
                </div>
                <h3
                  className="mt-4 font-semibold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                >
                  {member.name}
                </h3>
                <p className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
                  {member.role}
                </p>
                <p className="mt-1 text-xs" style={{ color: '#D4AF37' }}>
                  {member.years}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 border-t"
        style={{ backgroundColor: '#041512', borderColor: 'rgba(212,175,55,0.12)' }}
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Award className="mx-auto h-12 w-12" style={{ color: '#D4AF37' }} />
          <h2
            className="mt-4 text-2xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Ready to taste our story?
          </h2>
          <p className="mt-3 text-sm" style={{ color: '#9DB8B5' }}>
            Every box of Safir Delights carries 500 years of culinary heritage.
          </p>
          <Link
            href={ROUTES.SHOP}
            className="btn-gold-shimmer mt-6 inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105 hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }}
          >
            Shop Our Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
