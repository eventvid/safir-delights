import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Product,
  Category,
  Order,
  OrderStatusType,
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ProductFilters,
  PaginatedResult,
} from '@/types'
import { ProductRepository } from '@/repositories/product.repository'
import { OrderRepository } from '@/repositories/order.repository'
import { UserRepository } from '@/repositories/user.repository'

export class AdminService {
  private productRepo: ProductRepository
  private orderRepo: OrderRepository
  private userRepo: UserRepository

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabase: SupabaseClient<any>) {
    this.productRepo = new ProductRepository(supabase)
    this.orderRepo = new OrderRepository(supabase)
    this.userRepo = new UserRepository(supabase)
  }

  // ─── Products ─────────────────────────────────────────────────────────────

  async getProducts(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    return this.productRepo.findAll(filters)
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    if (!dto.title?.trim()) throw new Error('Title is required')
    if (dto.price < 0) throw new Error('Price cannot be negative')
    return this.productRepo.create(dto)
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.productRepo.update(id, dto)
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productRepo.delete(id)
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private categorySupabase: SupabaseClient<any> | null = null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get supabase(): SupabaseClient<any> {
    return this.categorySupabase!
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSupabase(supabase: SupabaseClient<any>) {
    this.categorySupabase = supabase
  }

  async getCategories(): Promise<Category[]> {
    if (!this.categorySupabase) throw new Error('Supabase not initialised')
    const { data, error } = await this.categorySupabase
      .from('categories')
      .select('*')
      .order('name')
    if (error) throw new Error(error.message)
    return data as Category[]
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    if (!this.categorySupabase) throw new Error('Supabase not initialised')
    if (!dto.name?.trim()) throw new Error('Name is required')
    const { data, error } = await this.categorySupabase
      .from('categories')
      .insert({ name: dto.name.trim() })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Category
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    if (!this.categorySupabase) throw new Error('Supabase not initialised')
    const { data, error } = await this.categorySupabase
      .from('categories')
      .update({ name: dto.name?.trim() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Category
  }

  async deleteCategory(id: string): Promise<void> {
    if (!this.categorySupabase) throw new Error('Supabase not initialised')
    const { error } = await this.categorySupabase.from('categories').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  async getOrders(): Promise<Order[]> {
    return this.orderRepo.findAll()
  }

  async updateOrderStatus(orderId: string, status: OrderStatusType): Promise<Order> {
    return this.orderRepo.updateStatus(orderId, status)
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  async verifyAdmin(userId: string): Promise<boolean> {
    return this.userRepo.isAdmin(userId)
  }
}
