import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { UserRepository } from '@/repositories/user.repository'
import type { OrderStatusType } from '@/types'

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const isAdmin = await new UserRepository(supabase).isAdmin(user.id)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { status }: { status: OrderStatusType } = await request.json()
    const service = new AdminService(supabase)
    const order = await service.updateOrderStatus(id, status)
    return NextResponse.json({ data: order })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
