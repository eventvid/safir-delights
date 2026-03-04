import type { OrderStatusType, UserRoleType } from './database.types'

export type { OrderStatusType, UserRoleType }

export interface Category {
  id: string
  name: string
  slug?: string
  description?: string | null
  image_url?: string | null
  created_at?: string
}

export interface Product {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  slug?: string | null
  ingredients?: string | null
  weight_grams?: number | null
  weight_display?: string | null
  discount_percent?: number | null
  is_featured?: boolean
  is_best_seller?: boolean
  tags?: string[] | null
  created_at: string
  updated_at?: string
  categories?: Category[]
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at?: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_price: number
  status: OrderStatusType
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at?: string
  product?: Product
}

export interface UserRole {
  user_id: string
  role: UserRoleType
  created_at?: string
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateProductDto {
  title: string
  description?: string
  price: number
  image_url?: string
  stock: number
  slug?: string
  ingredients?: string
  weight_grams?: number
  discount_percent?: number
  is_featured?: boolean
  is_best_seller?: boolean
  tags?: string[]
  category_ids?: string[]
}

export interface UpdateProductDto {
  title?: string
  description?: string
  price?: number
  image_url?: string
  stock?: number
  slug?: string
  ingredients?: string
  weight_grams?: number
  discount_percent?: number
  is_featured?: boolean
  is_best_seller?: boolean
  tags?: string[]
  category_ids?: string[]
}

export interface CreateCategoryDto {
  name: string
  slug?: string
  description?: string
  image_url?: string
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string
  image_url?: string
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  categoryId?: string
  categorySlug?: string
  search?: string
  tags?: string[]
  isFeatured?: boolean
  isBestSeller?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

// ─── Generic results ──────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = null> {
  data?: T
  error?: string
  message?: string
}
