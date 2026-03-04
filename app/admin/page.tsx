import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/services/admin.service'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Tag, ShoppingBag, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Overview' }

export default async function AdminOverviewPage() {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)
  adminService.setSupabase(supabase)

  const [productsResult, categories, orders] = await Promise.all([
    adminService.getProducts({ limit: 1, page: 1 }),
    adminService.getCategories(),
    adminService.getOrders(),
  ])

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0)

  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: productsResult.total,
      href: ROUTES.ADMIN_PRODUCTS,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Tag,
      label: 'Categories',
      value: categories.length,
      href: ROUTES.ADMIN_CATEGORIES,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: orders.length,
      href: ROUTES.ADMIN_ORDERS,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      href: ROUTES.ADMIN_ORDERS,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Platform metrics at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 py-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Orders</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-slate-600">Order ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Items</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Total</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {order.order_items?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatPrice(order.total_price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
