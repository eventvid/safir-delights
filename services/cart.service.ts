import type { SupabaseClient } from '@supabase/supabase-js'
import type { CartItem } from '@/types'
import { CartRepository } from '@/repositories/cart.repository'
import { ProductRepository } from '@/repositories/product.repository'

export class CartService {
  private cartRepo: CartRepository
  private productRepo: ProductRepository

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabase: SupabaseClient<any>) {
    this.cartRepo = new CartRepository(supabase)
    this.productRepo = new ProductRepository(supabase)
  }

  async getUserCart(userId: string): Promise<CartItem[]> {
    return this.cartRepo.findByUserId(userId)
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0')

    const product = await this.productRepo.findById(productId)
    if (!product) throw new Error('Product not found')
    if (product.stock < quantity) throw new Error(`Only ${product.stock} units available`)

    return this.cartRepo.upsertItem(userId, productId, quantity)
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<CartItem> {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0')

    const items = await this.cartRepo.findByUserId(userId)
    const item = items.find((i) => i.id === itemId)
    if (!item) throw new Error('Cart item not found')

    const product = await this.productRepo.findById(item.product_id)
    if (product && product.stock < quantity) {
      throw new Error(`Only ${product.stock} units available`)
    }

    return this.cartRepo.updateQuantity(itemId, quantity)
  }

  async removeFromCart(userId: string, itemId: string): Promise<void> {
    const items = await this.cartRepo.findByUserId(userId)
    const item = items.find((i) => i.id === itemId)
    if (!item) throw new Error('Cart item not found')
    return this.cartRepo.removeItem(itemId)
  }

  async getCartTotal(userId: string): Promise<number> {
    const items = await this.cartRepo.findByUserId(userId)
    return items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0)
  }

  async clearCart(userId: string): Promise<void> {
    return this.cartRepo.clearCart(userId)
  }
}
