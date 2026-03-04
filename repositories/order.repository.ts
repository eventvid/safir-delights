import type { SupabaseClient } from '@supabase/supabase-js'
import type { Order, OrderItem, OrderStatusType, Product } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseDB = SupabaseClient<any>

interface RawOrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  products: Product | null
}

interface RawOrder {
  id: string
  user_id: string
  total_price: number
  status: OrderStatusType
  created_at: string
  order_items: RawOrderItem[]
}

function mapOrderItem(raw: RawOrderItem): OrderItem {
  return {
    id: raw.id,
    order_id: raw.order_id,
    product_id: raw.product_id,
    quantity: raw.quantity,
    price: raw.price,
    created_at: raw.created_at,
    product: raw.products ?? undefined,
  }
}

function mapOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    user_id: raw.user_id,
    total_price: raw.total_price,
    status: raw.status,
    created_at: raw.created_at,
    order_items: (raw.order_items ?? []).map(mapOrderItem),
  }
}

export class OrderRepository {
  constructor(private supabase: SupabaseDB) {}

  async findByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`*, order_items(*, products(*))`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as unknown as RawOrder[]).map(mapOrder)
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`*, order_items(*, products(*))`)
      .eq('id', id)
      .single()

    if (error) return null
    return mapOrder(data as unknown as RawOrder)
  }

  async findAll(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`*, order_items(*, products(*))`)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as unknown as RawOrder[]).map(mapOrder)
  }

  async create(userId: string, totalPrice: number): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert({ user_id: userId, total_price: totalPrice, status: 'pending' })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return { ...data, order_items: [] } as Order
  }

  async createItems(
    orderId: string,
    items: Array<{ product_id: string; quantity: number; price: number }>
  ): Promise<void> {
    const rows = items.map((item) => ({ order_id: orderId, ...item }))
    const { error } = await this.supabase.from('order_items').insert(rows)
    if (error) throw new Error(error.message)
  }

  async updateStatus(id: string, status: OrderStatusType): Promise<Order> {
    const { error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) throw new Error(error.message)
    return (await this.findById(id))!
  }
}
