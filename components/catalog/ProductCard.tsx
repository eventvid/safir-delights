'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'
import { ROUTES } from '@/config/routes'
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/config/constants'
import { staggerItem } from '@/utils/animations'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  isLoggedIn: boolean
}

export function ProductCard({ product, isLoggedIn }: ProductCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const inStock = product.stock > 0
  const hasDiscount = product.discount_percent != null && product.discount_percent > 0
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount_percent ?? 0) / 100)
    : null

  const productHref = product.slug ? ROUTES.PRODUCT(product.slug) : ROUTES.PRODUCT(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      router.push(ROUTES.LOGIN)
      return
    }
    try {
      setAdding(true)
      await addItem(product.id, 1)
      toast.success('Added to cart', {
        description: product.title,
        icon: '🛒',
      })
    } catch {
      toast.error('Could not add to cart', { description: 'Please try again.' })
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((v) => !v)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
      icon: wishlisted ? '💔' : '❤️',
    })
  }

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={productHref}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            backgroundColor: '#0A3B38',
            borderColor: hovered ? 'rgba(212,175,55,0.45)' : 'rgba(212,175,55,0.12)',
            boxShadow: hovered
              ? '0 24px 48px rgba(0,0,0,0.45), 0 4px 16px rgba(212,175,55,0.12)'
              : '0 2px 8px rgba(0,0,0,0.3)',
            transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          }}
        >
          {/* Image */}
          <div className="relative h-56 w-full overflow-hidden" style={{ backgroundColor: '#082E2C' }}>
            <Image
              src={product.image_url ?? PRODUCT_IMAGE_PLACEHOLDER}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500"
              style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Gradient overlay on hover */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to top, rgba(4,21,18,0.7) 0%, transparent 60%)',
                opacity: hovered ? 1 : 0,
              }}
            />

            {/* Out of stock */}
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <span className="rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: '#082E2C', color: '#9DB8B5' }}>
                  Out of Stock
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.is_featured && (
                <span
                  className="btn-gold-shimmer rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase"
                  style={{ color: '#064E3B' }}
                >
                  ✦ Featured
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: '#dc2626', color: '#fff' }}>
                  -{product.discount_percent}%
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: wishlisted ? '#D4AF37' : 'rgba(8,46,44,0.85)',
                borderColor: wishlisted ? '#D4AF37' : 'rgba(212,175,55,0.3)',
              }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={wishlisted ? 'filled' : 'empty'}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Heart
                    className="h-4 w-4"
                    style={{
                      color: wishlisted ? '#064E3B' : '#D4AF37',
                      fill: wishlisted ? '#064E3B' : 'none',
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Quick view hint */}
            {hovered && inStock && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-medium" style={{ color: 'rgba(245,240,232,0.85)' }}>
                <Eye className="h-3 w-3" />
                View Details
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-5">
            {product.categories && product.categories.length > 0 && (
              <div className="mb-2.5 flex flex-wrap gap-1">
                {product.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                    style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <h3
              className="line-clamp-1 text-sm font-semibold transition-colors"
              style={{ fontFamily: 'var(--font-playfair)', color: hovered ? '#D4AF37' : '#F5F0E8' }}
            >
              {product.title}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed" style={{ color: '#9DB8B5' }}>
              {product.description ?? 'Handcrafted with authentic recipes.'}
            </p>

            {/* Stars */}
            <div className="mt-2 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3 w-3" style={{ color: '#D4AF37', fill: '#D4AF37' }} />
              ))}
              <span className="ml-1.5 text-[10px]" style={{ color: '#9DB8B5' }}>(48)</span>
            </div>

            {/* Price */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#D4AF37' }}
                >
                  {formatPrice(discountedPrice ?? product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xs line-through" style={{ color: '#9DB8B5' }}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <span className="text-xs" style={{ color: inStock ? '#6EE7B7' : '#9DB8B5' }}>
                {inStock
                  ? product.stock < 10 ? `${product.stock} left` : 'In Stock'
                  : 'Unavailable'}
              </span>
            </div>

            {/* Weight display */}
            {product.weight_display && (
              <p className="mt-1 text-[10px]" style={{ color: 'rgba(157,184,181,0.6)' }}>
                {product.weight_display}
              </p>
            )}

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
              style={
                inStock
                  ? hovered
                    ? { background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }
                    : { background: 'linear-gradient(135deg, #064E3B, #065F46)', color: '#F5F0E8' }
                  : { backgroundColor: 'rgba(13,74,70,0.5)', color: '#9DB8B5' }
              }
            >
              {adding ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              {adding
                ? 'Adding...'
                : inStock
                  ? isLoggedIn
                    ? 'Add to Cart'
                    : 'Sign in to Buy'
                  : 'Out of Stock'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
