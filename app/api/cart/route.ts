import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CartService } from '@/services/cart.service'

async function getAuthenticatedUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  try {
    const supabase = await createClient()
    const user = await getAuthenticatedUser(supabase)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const service = new CartService(supabase)
    const items = await service.getUserCart(user.id)
    return NextResponse.json({ data: items })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getAuthenticatedUser(supabase)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { product_id, quantity = 1 } = body

    if (!product_id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    const service = new CartService(supabase)
    const item = await service.addToCart(user.id, product_id, Number(quantity))
    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('not found') ? 404 : message.includes('available') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
