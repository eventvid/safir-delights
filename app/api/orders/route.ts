import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = new OrderService(supabase)
    const orders = await service.getUserOrders(user.id)
    return NextResponse.json({ data: orders })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = new OrderService(supabase)
    const order = await service.createOrderFromCart(user.id)
    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'Cart is empty' ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
