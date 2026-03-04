'use client'

import { useEffect, useState, useCallback } from 'react'
import { OrderTable } from '@/components/admin/OrderTable'
import { PageSpinner } from '@/components/ui/Spinner'
import { API_ROUTES } from '@/config/routes'
import type { Order, OrderStatusType } from '@/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ROUTES.ADMIN_ORDERS)
      const json = await res.json()
      setOrders(json.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId: string, status: OrderStatusType) => {
    await fetch(API_ROUTES.ADMIN_ORDER(orderId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchOrders()
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          {orders.length} order{orders.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  )
}
