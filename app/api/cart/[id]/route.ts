import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CartService } from '@/services/cart.service'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'quantity must be >= 1' }, { status: 400 })
    }

    const service = new CartService(supabase)
    const item = await service.updateCartItem(user.id, id, Number(quantity))
    return NextResponse.json({ data: item })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = new CartService(supabase)
    await service.removeFromCart(user.id, id)
    return NextResponse.json({ message: 'Item removed' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
