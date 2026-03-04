import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { UserRepository } from '@/repositories/user.repository'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const isAdmin = await new UserRepository(supabase).isAdmin(user.id)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const service = new AdminService(supabase)
    const orders = await service.getOrders()
    return NextResponse.json({ data: orders })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
