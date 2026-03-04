import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { LayoutDashboard, ShoppingBag } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import type { ReactNode } from 'react'

const navItems = [
  { label: 'Overview', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Orders', href: ROUTES.DASHBOARD, icon: ShoppingBag },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <Sidebar items={navItems} title="Dashboard" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
