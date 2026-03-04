import type { SupabaseClient } from '@supabase/supabase-js'
import type { CartItem, Product } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseDB = SupabaseClient<any>

interface RawCartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products: Product | null
}

function mapCartItem(raw: RawCartItem): CartItem {
  return {
    id: raw.id,
    user_id: raw.user_id,
    product_id: raw.product_id,
    quantity: raw.quantity,
    created_at: raw.created_at,
    product: raw.products ?? undefined,
  }
}

export class CartRepository {
  constructor(private supabase: SupabaseDB) {}

  async findByUserId(userId: string): Promise<CartItem[]> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .select(`*, products(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as unknown as RawCartItem[]).map(mapCartItem)
  }

  async findItem(userId: string, productId: string): Promise<CartItem | null> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .select(`*, products(*)`)
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (error) return null
    return mapCartItem(data as unknown as RawCartItem)
  }

  async upsertItem(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const existing = await this.findItem(userId, productId)

    if (existing) {
      const { data, error } = await this.supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select(`*, products(*)`)
        .single()

      if (error) throw new Error(error.message)
      return mapCartItem(data as unknown as RawCartItem)
    }

    const { data, error } = await this.supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select(`*, products(*)`)
      .single()

    if (error) throw new Error(error.message)
    return mapCartItem(data as unknown as RawCartItem)
  }

  async updateQuantity(id: string, quantity: number): Promise<CartItem> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select(`*, products(*)`)
      .single()

    if (error) throw new Error(error.message)
    return mapCartItem(data as unknown as RawCartItem)
  }

  async removeItem(id: string): Promise<void> {
    const { error } = await this.supabase.from('cart_items').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }

  async clearCart(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
}
