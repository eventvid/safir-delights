import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Product,
  Category,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  PaginatedResult,
} from '@/types'
import { PAGINATION } from '@/config/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseDB = SupabaseClient<any>

/**
 * Raw shape returned by Supabase when selecting products with categories.
 */
interface RawProduct {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  slug: string | null
  ingredients: string | null
  weight_grams: number | null
  weight_display: string | null
  discount_percent: number | null
  is_featured: boolean
  is_best_seller: boolean
  tags: string[] | null
  sort_order: number | null
  created_at: string
  updated_at: string
  product_categories: Array<{
    categories: { id: string; name: string; slug?: string } | null
  }>
}

function mapProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    price: raw.price,
    image_url: raw.image_url,
    stock: raw.stock,
    slug: raw.slug,
    ingredients: raw.ingredients,
    weight_grams: raw.weight_grams,
    weight_display: raw.weight_display,
    discount_percent: raw.discount_percent,
    is_featured: raw.is_featured,
    is_best_seller: raw.is_best_seller,
    tags: raw.tags,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    categories: raw.product_categories
      .map((pc) => pc.categories)
      .filter((c): c is Category => c !== null),
  }
}

const PRODUCT_SELECT = `
  id, title, description, price, image_url, stock,
  slug, ingredients, weight_grams, weight_display,
  discount_percent, is_featured, is_best_seller, tags, sort_order,
  created_at, updated_at,
  product_categories(categories(id, name, slug))
`

export class ProductRepository {
  constructor(private supabase: SupabaseDB) {}

  async findAll(filters: ProductFilters = {}): Promise<PaginatedResult<Product>> {
    const page = filters.page ?? PAGINATION.DEFAULT_PAGE
    const limit = Math.min(filters.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const offset = (page - 1) * limit

    // Resolve category slug to ID if needed
    let resolvedCategoryId: string | undefined = filters.categoryId

    if (!resolvedCategoryId && filters.categorySlug) {
      const { data: catData } = await this.supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single()
      resolvedCategoryId = catData?.id ?? undefined
    }

    let query = this.supabase
      .from('products')
      .select(PRODUCT_SELECT, { count: 'exact' })

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    if (resolvedCategoryId) {
      const { data: matchingIds } = await this.supabase
        .from('product_categories')
        .select('product_id')
        .eq('category_id', resolvedCategoryId)

      const ids = (matchingIds ?? []).map((r: { product_id: string }) => r.product_id)
      if (ids.length === 0) {
        return { data: [], total: 0, page, limit, totalPages: 0 }
      }
      query = query.in('id', ids)
    }

    if (filters.isFeatured) {
      query = query.eq('is_featured', true)
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'popular':
        query = query.order('is_best_seller', { ascending: false }).order('created_at', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1)

    if (error) throw new Error(error.message)

    const total = count ?? 0
    return {
      data: (data as unknown as RawProduct[]).map(mapProduct),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .single()

    if (error) return null
    return mapProduct(data as unknown as RawProduct)
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .single()

    if (error) return null
    return mapProduct(data as unknown as RawProduct)
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const { category_ids, ...productData } = dto

    const { data: product, error } = await this.supabase
      .from('products')
      .insert({ ...productData })
      .select()
      .single()

    if (error) throw new Error(error.message)

    if (category_ids && category_ids.length > 0) {
      const relations = category_ids.map((cid) => ({
        product_id: product.id,
        category_id: cid,
      }))
      const { error: relError } = await this.supabase
        .from('product_categories')
        .insert(relations)
      if (relError) throw new Error(relError.message)
    }

    return (await this.findById(product.id))!
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { category_ids, ...productData } = dto

    const { error } = await this.supabase
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)

    if (category_ids !== undefined) {
      await this.supabase.from('product_categories').delete().eq('product_id', id)
      if (category_ids.length > 0) {
        const relations = category_ids.map((cid) => ({
          product_id: id,
          category_id: cid,
        }))
        await this.supabase.from('product_categories').insert(relations)
      }
    }

    return (await this.findById(id))!
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
