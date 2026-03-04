import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductService } from '@/services/product.service'
import { formatPrice } from '@/utils/format'
import { ROUTES } from '@/config/routes'
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/config/constants'
import { ArrowLeft, Package, Tag, CheckCircle, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'
import type { Product } from '@/types'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const productService = new ProductService(supabase)
  const product = await productService.getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.title} — Safir Delights`,
    description: product.description ?? `${product.title} — authentic handcrafted sweets from Safir Delights.`,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

/** JSON-LD structured data for SEO */
function ProductJsonLd({ product }: { product: Product }) {
  const hasDiscount = product.discount_percent != null && product.discount_percent > 0
  const finalPrice = hasDiscount
    ? (product.price * (1 - (product.discount_percent ?? 0) / 100)).toFixed(2)
    : product.price.toFixed(2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image_url ?? PRODUCT_IMAGE_PLACEHOLDER,
    offers: {
      '@type': 'Offer',
      price: finalPrice,
      priceCurrency: 'USD',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function ProductSlugPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const productService = new ProductService(supabase)
  const product = await productService.getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const hasDiscount = product.discount_percent != null && product.discount_percent > 0
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount_percent ?? 0) / 100)
    : null
  const inStock = product.stock > 0
  const lowStock = inStock && product.stock < 10

  // Related products from same category
  const primaryCategorySlug = product.categories?.[0]?.slug
  const { data: relatedProducts } = primaryCategorySlug
    ? await productService.getProducts({
        categorySlug: primaryCategorySlug,
        limit: 4,
        page: 1,
      })
    : { data: [] }

  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <>
      <ProductJsonLd product={product} />

      <div style={{ backgroundColor: '#071f1c', minHeight: '100vh' }}>
        {/* Breadcrumb */}
        <div
          className="border-b px-4 py-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.1)' }}
        >
          <div className="mx-auto max-w-7xl flex items-center gap-3 text-sm">
            <Link
              href={ROUTES.SHOP}
              className="flex items-center gap-1.5 transition-colors hover:opacity-80"
              style={{ color: '#9DB8B5' }}
              aria-label="Back to catalog"
            >
              <ArrowLeft className="h-4 w-4" />
              Shop
            </Link>
            <span style={{ color: 'rgba(157,184,181,0.4)' }}>/</span>
            {product.categories?.[0] && (
              <>
                <Link
                  href={`${ROUTES.SHOP}?category=${product.categories[0].slug ?? ''}`}
                  className="transition-colors hover:opacity-80"
                  style={{ color: '#9DB8B5' }}
                >
                  {product.categories[0].name}
                </Link>
                <span style={{ color: 'rgba(157,184,181,0.4)' }}>/</span>
              </>
            )}
            <span style={{ color: '#F5F0E8' }}>{product.title}</span>
          </div>
        </div>

        {/* Product detail */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image */}
            <div>
              <div
                className="relative aspect-square overflow-hidden rounded-3xl border"
                style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.15)' }}
              >
                <Image
                  src={product.image_url ?? PRODUCT_IMAGE_PLACEHOLDER}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {!inStock && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                  >
                    <span
                      className="rounded-full px-6 py-2 text-sm font-semibold"
                      style={{ backgroundColor: '#082E2C', color: '#9DB8B5' }}
                    >
                      Out of Stock
                    </span>
                  </div>
                )}
                {/* Featured badge */}
                {product.is_featured && (
                  <div className="absolute left-4 top-4">
                    <span
                      className="btn-gold-shimmer rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
                      style={{ color: '#064E3B' }}
                    >
                      ✦ Featured
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {/* Category badges */}
              {product.categories && product.categories.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`${ROUTES.SHOP}?category=${cat.slug ?? ''}`}
                      className="rounded-full px-3 py-1 text-xs font-medium transition-colors hover:opacity-80"
                      style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              <h1
                className="text-3xl font-bold sm:text-4xl"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                {product.title}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#D4AF37' }}
                >
                  {formatPrice(discountedPrice ?? product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl line-through" style={{ color: '#9DB8B5' }}>
                    {formatPrice(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: '#dc2626', color: '#fff' }}>
                    -{product.discount_percent}%
                  </span>
                )}
              </div>

              {/* Stock indicator */}
              <div className="mt-3 flex items-center gap-2">
                {inStock ? (
                  <>
                    <CheckCircle className="h-4 w-4" style={{ color: '#6EE7B7' }} />
                    <span className="text-sm" style={{ color: lowStock ? '#FCD34D' : '#6EE7B7' }}>
                      {lowStock ? `Only ${product.stock} left — order soon` : 'In Stock'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" style={{ color: '#9DB8B5' }} />
                    <span className="text-sm" style={{ color: '#9DB8B5' }}>Currently unavailable</span>
                  </>
                )}
              </div>

              {/* Weight */}
              {product.weight_display && (
                <p className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
                  Weight: {product.weight_display}
                </p>
              )}

              {/* Description */}
              {product.description && (
                <div
                  className="mt-6 rounded-2xl border p-5"
                  style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.1)' }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: '#9DB8B5' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                    Ingredients
                  </h3>
                  <p className="mt-1.5 text-sm" style={{ color: '#9DB8B5' }}>
                    {product.ingredients}
                  </p>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag className="h-3.5 w-3.5" style={{ color: 'rgba(157,184,181,0.5)' }} />
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2.5 py-0.5 text-xs"
                      style={{ backgroundColor: 'rgba(10,59,56,0.6)', color: '#9DB8B5', border: '1px solid rgba(157,184,181,0.15)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to Cart CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {user ? (
                  <AddToCartButton productId={product.id} inStock={inStock} />
                ) : (
                  <Link
                    href={ROUTES.LOGIN}
                    className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                      color: '#064E3B',
                    }}
                  >
                    Sign in to Purchase
                  </Link>
                )}
              </div>

              {/* Recently viewed note */}
              <RecentlyViewedTracker slug={product.slug ?? product.id} title={product.title} />
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-20">
              <div className="section-divider mb-10" />
              <h2
                className="text-2xl font-bold mb-8"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                You May Also Like
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={ROUTES.PRODUCT(p.slug ?? p.id)}
                    className="hover-card-gold group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: '#0A3B38',
                      borderColor: 'rgba(212,175,55,0.12)',
                    }}
                  >
                    <div
                      className="relative h-32 w-full overflow-hidden rounded-xl mb-3"
                      style={{ backgroundColor: '#082E2C' }}
                    >
                      <Image
                        src={p.image_url ?? PRODUCT_IMAGE_PLACEHOLDER}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-1" style={{ color: '#F5F0E8' }}>
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold" style={{ color: '#D4AF37' }}>
                      {formatPrice(p.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/** Client-side Add to Cart button — inline for simplicity */
function AddToCartButton({ productId, inStock }: { productId: string; inStock: boolean }) {
  // This is a server component context placeholder.
  // The actual cart functionality is in the CartContext (client).
  // For the detail page architecture, we link to a client wrapper.
  // Full implementation can use the existing /api/cart endpoint.
  return (
    <Link
      href={inStock ? `/cart` : '#'}
      className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02]"
      style={
        inStock
          ? { background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }
          : { backgroundColor: 'rgba(10,59,56,0.5)', color: '#9DB8B5', cursor: 'not-allowed', pointerEvents: 'none' }
      }
      aria-disabled={!inStock}
    >
      <Package className="h-5 w-5" />
      {inStock ? 'Add to Cart' : 'Out of Stock'}
    </Link>
  )
}

/** Tracks recently viewed products in localStorage (client-side via script) */
function RecentlyViewedTracker({ slug, title }: { slug: string; title: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const key = 'safir_recently_viewed';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            const entry = { slug: ${JSON.stringify(slug)}, title: ${JSON.stringify(title)}, ts: Date.now() };
            const filtered = existing.filter(e => e.slug !== entry.slug);
            const updated = [entry, ...filtered].slice(0, 10);
            localStorage.setItem(key, JSON.stringify(updated));
          } catch(e) {}
        `,
      }}
    />
  )
}
