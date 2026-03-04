import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ProductService } from '@/services/product.service'
import type { ProductFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const service = new ProductService(supabase)

    const { searchParams } = request.nextUrl
    const filters: ProductFilters = {
      search: searchParams.get('search') ?? undefined,
      categoryId: searchParams.get('category') ?? undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    }

    const result = await service.getProducts(filters)
    return NextResponse.json({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
