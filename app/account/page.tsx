import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { OrderService } from '@/services/order.service'
import { OrderCard } from '@/components/dashboard/OrderCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Package, ShoppingBag, Clock, Star, Settings, Heart } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { formatPrice } from '@/utils/format'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your orders, profile, and preferences.',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const orderService = new OrderService(supabase)
  const orders = await orderService.getUserOrders(user.id)

  const totalSpent = orders.reduce((sum, o) => sum + o.total_price, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length

  const displayName = user.email?.split('@')[0] ?? 'Customer'

  return (
    <div>
      {/* Header */}
      <div className="border-b py-10" style={{ backgroundColor: '#064E3B', borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }}
            >
              {displayName[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                Welcome back
              </p>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-playfair)', color: '#FFF8ED' }}
              >
                {displayName}
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,248,237,0.6)' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar nav */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { icon: ShoppingBag, label: 'Orders', active: true },
                { icon: Heart, label: 'Wishlist', active: false },
                { icon: Star, label: 'Reviews', active: false },
                { icon: Settings, label: 'Settings', active: false },
              ].map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: active ? 'rgba(6,78,59,0.08)' : 'transparent',
                    color: active ? '#064E3B' : '#7C6A50',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: ShoppingBag,
                  label: 'Total Orders',
                  value: orders.length,
                  sub: 'All time',
                  color: '#064E3B',
                  bg: 'rgba(6,78,59,0.08)',
                },
                {
                  icon: Clock,
                  label: 'In Progress',
                  value: pendingOrders,
                  sub: 'Pending / processing',
                  color: '#D4AF37',
                  bg: 'rgba(212,175,55,0.1)',
                },
                {
                  icon: Package,
                  label: 'Total Spent',
                  value: formatPrice(totalSpent),
                  sub: `${deliveredOrders} delivered`,
                  color: '#065F46',
                  bg: 'rgba(6,95,70,0.08)',
                },
              ].map(({ icon: Icon, label, value, sub, color, bg }) => (
                <div
                  key={label}
                  className="rounded-2xl border p-5"
                  style={{ borderColor: '#E8DCC8', backgroundColor: '#FFFFFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#7C6A50' }}>{label}</p>
                      <p
                        className="text-xl font-bold"
                        style={{ fontFamily: 'var(--font-playfair)', color: '#064E3B' }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs" style={{ color: '#7C6A50' }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Order history */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#064E3B' }}
                >
                  Order History
                </h2>
                <Link
                  href={ROUTES.SHOP}
                  className="text-sm font-medium"
                  style={{ color: '#D4AF37' }}
                >
                  + New order
                </Link>
              </div>

              {orders.length === 0 ? (
                <EmptyState
                  emoji="🛍️"
                  title="No orders yet"
                  description="Your order history will appear here once you make your first purchase."
                  actionLabel="Start Shopping"
                  actionHref={ROUTES.SHOP}
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
