import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { UserRepository } from '@/repositories/user.repository'

interface Params { params: Promise<{ id: string }> }

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return (await new UserRepository(supabase).isAdmin(user.id)) ? user : null
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    if (!(await requireAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const service = new AdminService(supabase)
    service.setSupabase(supabase)
    const category = await service.updateCategory(id, body)
    return NextResponse.json({ data: category })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    if (!(await requireAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const service = new AdminService(supabase)
    service.setSupabase(supabase)
    await service.deleteCategory(id)
    return NextResponse.json({ message: 'Category deleted' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
