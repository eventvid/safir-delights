import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRepository } from '@/repositories/user.repository'
import { Sidebar } from '@/components/layout/Sidebar'
import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import type { ReactNode } from 'react'

const navItems = [
  { label: 'Overview', href: ROUTES.ADMIN, icon: LayoutDashboard },
  { label: 'Products', href: ROUTES.ADMIN_PRODUCTS, icon: Package },
  { label: 'Categories', href: ROUTES.ADMIN_CATEGORIES, icon: Tag },
  { label: 'Orders', href: ROUTES.ADMIN_ORDERS, icon: ShoppingBag },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const userRepo = new UserRepository(supabase)
  const isAdmin = await userRepo.isAdmin(user.id)
  if (!isAdmin) redirect(ROUTES.DASHBOARD)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <Sidebar items={navItems} title="Admin Panel" />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
