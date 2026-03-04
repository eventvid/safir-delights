import Link from 'next/link'
import { Home, ShoppingBag } from 'lucide-react'
import { ROUTES } from '@/config/routes'

export default function NotFound() {
  return (
    <div
      className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: '#071f1c' }}
    >
      {/* Decorative */}
      <div className="relative">
        <div
          className="text-[10rem] font-bold leading-none select-none"
          style={{
            fontFamily: 'var(--font-playfair)',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.35))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🍬
        </div>
      </div>

      <h1
        className="mt-6 text-3xl font-bold sm:text-4xl"
        style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
      >
        Page Not Found
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: '#9DB8B5' }}>
        The sweet you were looking for seems to have been enjoyed already.
        Don&apos;t worry — our shop is full of delicious alternatives waiting to be discovered.
      </p>

      {/* Divider */}
      <div className="my-8 flex items-center gap-3">
        <div className="h-px w-24" style={{ backgroundColor: 'rgba(212,175,55,0.2)' }} />
        <span style={{ color: '#D4AF37' }}>✦</span>
        <div className="h-px w-24" style={{ backgroundColor: 'rgba(212,175,55,0.2)' }} />
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
            color: '#064E3B',
          }}
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href={ROUTES.SHOP}
          className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-all hover:scale-105"
          style={{
            borderColor: 'rgba(212,175,55,0.25)',
            color: '#F5F0E8',
            backgroundColor: '#0A3B38',
          }}
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Shop
        </Link>
      </div>
    </div>
  )
}
