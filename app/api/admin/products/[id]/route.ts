import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { UserRepository } from '@/repositories/user.repository'
import type { UpdateProductDto } from '@/types'

interface Params { params: Promise<{ id: string }> }

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const userRepo = new UserRepository(supabase)
  return (await userRepo.isAdmin(user.id)) ? user : null
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    if (!(await requireAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body: UpdateProductDto = await request.json()
    const service = new AdminService(supabase)
    const product = await service.updateProduct(id, body)
    return NextResponse.json({ data: product })
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
    await service.deleteProduct(id)
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
