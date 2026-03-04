import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductService } from '@/services/product.service'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { SearchBar } from '@/components/catalog/SearchBar'
import { Pagination } from '@/components/catalog/Pagination'
import { PageSpinner } from '@/components/ui/Spinner'
import { Package } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop — Safir Delights',
  description: 'Browse our full collection of authentic Turkish and Middle Eastern sweets. Baklava, lokum, halva, premium dates and more.',
}

type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'popular'

interface CatalogPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: SortOption
    featured?: string
    page?: string
  }>
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const productService = new ProductService(supabase)

  const [productsResult, categoriesData] = await Promise.all([
    productService.getProducts({
      search: params.search,
      categorySlug: params.category,
      isFeatured: params.featured === 'true' ? true : undefined,
      sort: params.sort,
      page: params.page ? Number(params.page) : 1,
      limit: 15,
    }),
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
  ])

  const categories = categoriesData.data ?? []

  return (
    <div>
      {/* Filters bar */}
      <div
        className="border-b py-4"
        style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.12)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Suspense fallback={<div className="h-10 w-72 rounded-xl shimmer" />}>
              <SearchBar />
            </Suspense>

            <p className="whitespace-nowrap text-sm" style={{ color: '#9DB8B5' }}>
              <span className="font-semibold" style={{ color: '#F5F0E8' }}>
                {productsResult.total}
              </span>{' '}
              item{productsResult.total !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="mt-4">
              <Suspense fallback={null}>
                <CategoryFilter categories={categories} />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div
        className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#071f1c' }}
      >
        <div className="mx-auto max-w-7xl">
          {productsResult.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Package className="h-16 w-16" style={{ color: 'rgba(157,184,181,0.3)' }} />
              <h3 className="mt-4 text-lg font-semibold" style={{ color: '#F5F0E8' }}>
                No sweets found
              </h3>
              <p className="mt-2 text-sm" style={{ color: '#9DB8B5' }}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {productsResult.data.map((product) => (
                  <ProductCard key={product.id} product={product} isLoggedIn={!!user} />
                ))}
              </div>

              <div className="mt-10">
                <Suspense fallback={null}>
                  <Pagination
                    page={productsResult.page}
                    totalPages={productsResult.totalPages}
                    total={productsResult.total}
                    limit={productsResult.limit}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <div style={{ backgroundColor: '#071f1c', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        className="relative overflow-hidden border-b py-12"
        style={{ backgroundColor: '#082E2C', borderColor: 'rgba(212,175,55,0.12)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,95,70,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: '#D4AF37' }}
          >
            ✦ Our Collection
          </p>
          <h1
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Shop All Sweets
          </h1>
          <p className="mt-2 text-base max-w-xl" style={{ color: '#9DB8B5' }}>
            Handcrafted with centuries-old recipes, delivered fresh from Istanbul to your door.
          </p>
        </div>
      </div>

      <Suspense fallback={<PageSpinner />}>
        <CatalogContent {...props} />
      </Suspense>
    </div>
  )
}
