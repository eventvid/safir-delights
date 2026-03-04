import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProductService } from '@/services/product.service'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const service = new ProductService(supabase)
    const product = await service.getProductById(id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
