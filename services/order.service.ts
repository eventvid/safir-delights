import type { SupabaseClient } from '@supabase/supabase-js'
import type { Order, OrderStatusType } from '@/types'
import { OrderRepository } from '@/repositories/order.repository'
import { CartRepository } from '@/repositories/cart.repository'

export class OrderService {
  private orderRepo: OrderRepository
  private cartRepo: CartRepository

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(supabase: SupabaseClient<any>) {
    this.orderRepo = new OrderRepository(supabase)
    this.cartRepo = new CartRepository(supabase)
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId)
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepo.findById(orderId)
    if (!order) throw new Error('Order not found')
    if (order.user_id !== userId) throw new Error('Forbidden')
    return order
  }

  /**
   * Converts the user's cart into a new order and clears the cart.
   */
  async createOrderFromCart(userId: string): Promise<Order> {
    const cartItems = await this.cartRepo.findByUserId(userId)
    if (cartItems.length === 0) throw new Error('Cart is empty')

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    )

    const order = await this.orderRepo.create(userId, totalPrice)

    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price ?? 0,
    }))

    await this.orderRepo.createItems(order.id, orderItems)
    await this.cartRepo.clearCart(userId)

    return (await this.orderRepo.findById(order.id))!
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepo.findAll()
  }

  async updateOrderStatus(orderId: string, status: OrderStatusType): Promise<Order> {
    const order = await this.orderRepo.findById(orderId)
    if (!order) throw new Error('Order not found')
    return this.orderRepo.updateStatus(orderId, status)
  }
}
