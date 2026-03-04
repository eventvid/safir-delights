import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { OrderCard } from '@/components/dashboard/OrderCard'
import { Package, ShoppingBag, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { ROUTES } from '@/config/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const orderService = new OrderService(supabase)
  const orders = await orderService.getUserOrders(user.id)

  const totalSpent = orders.reduce((sum, o) => sum + o.total_price, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, <span className="font-medium">{user.email}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: ShoppingBag,
            label: 'Total Orders',
            value: orders.length,
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            icon: Clock,
            label: 'Pending',
            value: pendingOrders,
            color: 'text-amber-600 bg-amber-50',
          },
          {
            icon: Package,
            label: 'Total Spent',
            value: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(totalSpent),
            color: 'text-emerald-600 bg-emerald-50',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Orders */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Order History</h2>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-slate-300" />
            <h3 className="mt-3 font-semibold text-slate-600">No orders yet</h3>
            <p className="mt-1 text-sm text-slate-500">Your order history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
