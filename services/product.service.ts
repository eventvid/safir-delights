import type { SupabaseClient } from '@supabase/supabase-js'
// Database generic not needed — repositories accept SupabaseClient<any>
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  PaginatedResult,
} from '@/types'
import { ProductRepository } from '@/repositories/product.repository'

export class ProductService {
  private repo: ProductRepository

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabase: SupabaseClient<any>) {
    this.repo = new ProductRepository(supabase)
  }

  async getProducts(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    return this.repo.findAll(filters)
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.repo.findById(id)
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.repo.findBySlug(slug)
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    if (!dto.title?.trim()) throw new Error('Product title is required')
    if (dto.price < 0) throw new Error('Price cannot be negative')
    if (dto.stock < 0) throw new Error('Stock cannot be negative')
    return this.repo.create(dto)
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.repo.findById(id)
    if (!existing) throw new Error('Product not found')

    if (dto.price !== undefined && dto.price < 0) throw new Error('Price cannot be negative')
    if (dto.stock !== undefined && dto.stock < 0) throw new Error('Stock cannot be negative')

    return this.repo.update(id, dto)
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await this.repo.findById(id)
    if (!existing) throw new Error('Product not found')
    return this.repo.delete(id)
  }
}
