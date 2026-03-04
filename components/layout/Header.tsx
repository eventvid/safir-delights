'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/context/CartContext'
import { APP_NAME } from '@/config/constants'
import { ROUTES } from '@/config/routes'
import { cn } from '@/utils/cn'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface HeaderProps {
  user: SupabaseUser | null
  isAdmin?: boolean
}

const NAV_LINKS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Shop', href: ROUTES.SHOP },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Blog', href: ROUTES.BLOG },
  { label: 'Contact', href: ROUTES.CONTACT },
]

const CATEGORY_LINKS = [
  { label: 'Baklava',       href: `${ROUTES.SHOP}?category=baklava` },
  { label: 'Lokum',         href: `${ROUTES.SHOP}?category=lokum` },
  { label: 'Halva',         href: `${ROUTES.SHOP}?category=halva` },
  { label: 'Date Sweets',   href: `${ROUTES.SHOP}?category=date-based-sweets` },
  { label: 'Gift Boxes',    href: `${ROUTES.SHOP}?category=premium-gift-boxes` },
  { label: 'Arabic Sweets', href: `${ROUTES.SHOP}?category=arabic-sweets` },
  { label: 'Tea & Coffee',  href: `${ROUTES.SHOP}?category=tea-coffee-pairings` },
]

export function Header({ user, isAdmin }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(ROUTES.HOME)
    router.refresh()
  }

  const isActive = (href: string) => pathname === href

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'glass-surface shadow-2xl' : 'shadow-sm',
      )}
      style={
        scrolled
          ? undefined
          : { backgroundColor: '#082E2C', borderBottom: '1px solid rgba(212,175,55,0.15)' }
      }
    >
      {/* Top announcement bar */}
      <div
        className="hidden py-1.5 text-center text-xs font-medium lg:block"
        style={{ backgroundColor: '#D4AF37', color: '#064E3B' }}
      >
        <Sparkles className="mr-1 inline h-3 w-3" />
        Free worldwide shipping on orders over $75 · Fresh from Istanbul
        <Sparkles className="ml-1 inline h-3 w-3" />
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }}
          >
            ✦
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)', color: '#FFF8ED' }}
            >
              {APP_NAME}
            </span>
            <span className="text-[10px] tracking-widest uppercase" style={{ color: '#D4AF37' }}>
              Est. 2024
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive(link.href)
                  ? 'text-[#D4AF37]'
                  : 'text-[#FFF8ED]/80 hover:text-[#D4AF37]',
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen((v) => !v)}
              onBlur={() => setTimeout(() => setCategoryOpen(false), 150)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-[#FFF8ED]/80 hover:text-[#D4AF37]"
            >
              Categories
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform', categoryOpen && 'rotate-180')}
              />
            </button>
            {categoryOpen && (
              <div
                className="absolute left-0 top-full z-50 mt-1 w-52 rounded-2xl border py-2 shadow-2xl"
                style={{
                  backgroundColor: '#082E2C',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(212,175,55,0.2)',
                }}
              >
                {CATEGORY_LINKS.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-4 py-2.5 text-sm transition-colors hover:text-[#D4AF37]"
                    style={{ color: '#FFF8ED' }}
                    onClick={() => setCategoryOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href={ROUTES.CART}
            className="relative rounded-xl p-2.5 transition-all duration-200 hover:scale-110"
            style={{ color: '#FFF8ED' }}
            title="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: '#D4AF37', color: '#064E3B' }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                style={{ color: '#FFF8ED' }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <span className="hidden sm:block" style={{ color: '#FFF8ED/80' }}>
                  {user.email?.split('@')[0]}
                </span>
                <ChevronDown
                  className={cn('h-3.5 w-3.5 transition-transform', menuOpen && 'rotate-180')}
                  style={{ color: '#D4AF37' }}
                />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-full z-20 mt-1 w-52 rounded-2xl border py-2 shadow-2xl"
                    style={{
                      backgroundColor: '#082E2C',
                      backdropFilter: 'blur(16px)',
                      borderColor: 'rgba(212,175,55,0.2)',
                    }}
                  >
                    <div className="border-b px-4 py-2.5" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                      <p className="text-xs" style={{ color: 'rgba(255,248,237,0.5)' }}>Signed in as</p>
                      <p className="truncate text-sm font-medium" style={{ color: '#FFF8ED' }}>
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={ROUTES.ACCOUNT}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:text-[#D4AF37]"
                      style={{ color: '#FFF8ED' }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href={ROUTES.ADMIN}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:text-[#D4AF37]"
                        style={{ color: '#FFF8ED' }}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="my-1 border-t" style={{ borderColor: 'rgba(212,175,55,0.2)' }} />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 transition-colors hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={ROUTES.LOGIN}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{ color: 'rgba(255,248,237,0.8)' }}
              >
                Sign in
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  color: '#064E3B',
                }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl p-2 transition-colors lg:hidden"
            style={{ color: '#FFF8ED' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t lg:hidden"
          style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.15)' }}
        >
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.href) ? '#D4AF37' : '#FFF8ED',
                  backgroundColor: isActive(link.href) ? 'rgba(212,175,55,0.1)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
              {!user && (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium"
                    style={{ color: '#FFF8ED' }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                      color: '#064E3B',
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="block w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-400"
                >
                  Sign out
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
