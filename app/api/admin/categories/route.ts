import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { UserRepository } from '@/repositories/user.repository'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const userRepo = new UserRepository(supabase)
  return (await userRepo.isAdmin(user.id)) ? user : null
}

export async function GET() {
  try {
    const supabase = await createClient()
    if (!(await requireAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const service = new AdminService(supabase)
    service.setSupabase(supabase)
    const categories = await service.getCategories()
    return NextResponse.json({ data: categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    if (!(await requireAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const service = new AdminService(supabase)
    service.setSupabase(supabase)
    const category = await service.createCategory(body)
    return NextResponse.json({ data: category }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
