'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '@/config/constants'
import { ROUTES } from '@/config/routes'

const SHOP_LINKS = [
  { label: 'All Products',  href: ROUTES.SHOP },
  { label: 'Baklava',       href: `${ROUTES.SHOP}?category=baklava` },
  { label: 'Lokum',         href: `${ROUTES.SHOP}?category=lokum` },
  { label: 'Halva',         href: `${ROUTES.SHOP}?category=halva` },
  { label: 'Gift Boxes',    href: `${ROUTES.SHOP}?category=premium-gift-boxes` },
  { label: 'Date Sweets',   href: `${ROUTES.SHOP}?category=date-based-sweets` },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: ROUTES.ABOUT },
  { label: 'Blog', href: ROUTES.BLOG },
  { label: 'Contact', href: ROUTES.CONTACT },
]

const ACCOUNT_LINKS = [
  { label: 'My Account', href: ROUTES.ACCOUNT },
  { label: 'My Orders', href: ROUTES.ACCOUNT },
  { label: 'Sign In', href: ROUTES.LOGIN },
  { label: 'Create Account', href: ROUTES.REGISTER },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#041512', color: '#F5F0E8', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold transition-transform group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }}
              >
                ✦
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#FFF8ED' }}
                >
                  {APP_NAME}
                </span>
                <span className="text-[10px] tracking-widest uppercase" style={{ color: '#D4AF37' }}>
                  Est. 2024
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: 'rgba(255,248,237,0.6)' }}>
              {APP_TAGLINE}
            </p>

            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,248,237,0.5)' }}>
              Handcrafted with centuries-old recipes from the heart of Istanbul, delivered fresh to your door anywhere in the world.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110"
                  style={{
                    borderColor: 'rgba(212,175,55,0.3)',
                    color: 'rgba(255,248,237,0.6)',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#D4AF37'
                    ;(e.currentTarget as HTMLElement).style.color = '#D4AF37'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,248,237,0.6)'
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(255,248,237,0.6)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#FFF8ED')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,248,237,0.6)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(255,248,237,0.6)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              Account
            </h3>
            <ul className="mt-4 space-y-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(255,248,237,0.6)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,248,237,0.6)' }}
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="text-sm"
                  style={{ color: 'rgba(255,248,237,0.6)' }}
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
                <span className="text-sm" style={{ color: 'rgba(255,248,237,0.6)' }}>
                  {CONTACT_ADDRESS}
                </span>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                Newsletter
              </h3>
              <p className="mt-2 text-xs" style={{ color: 'rgba(255,248,237,0.5)' }}>
                Sweet deals and new arrivals, weekly.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border px-3 py-2 text-xs outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'rgba(255,248,237,0.05)',
                    borderColor: 'rgba(212,175,55,0.3)',
                    color: '#FFF8ED',
                  }}
                />
                <button
                  className="rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                    color: '#064E3B',
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(212,175,55,0.15)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p style={{ color: 'rgba(255,248,237,0.4)' }}>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-1" style={{ color: 'rgba(255,248,237,0.4)' }}>
            <span>Made with</span>
            <span style={{ color: '#D4AF37' }}>✦</span>
            <span>in Istanbul</span>
          </div>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                className="transition-colors"
                style={{ color: 'rgba(255,248,237,0.4)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
