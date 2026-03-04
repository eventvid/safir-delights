import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { UserRepository } from '@/repositories/user.repository'
import { createProductSchema } from '@/lib/validations'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const userRepo = new UserRepository(supabase)
  const isAdmin = await userRepo.isAdmin(user.id)
  return isAdmin ? user : null
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = await requireAdmin(supabase)
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const service = new AdminService(supabase)
    service.setSupabase(supabase)

    const { searchParams } = request.nextUrl
    const result = await service.getProducts({
      search: searchParams.get('search') ?? undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = await requireAdmin(supabase)
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const service = new AdminService(supabase)
    const product = await service.createProduct(parsed.data)
    return NextResponse.json({ data: product }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
