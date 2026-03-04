'use client'

import { useState } from 'react'
import { formatDate, formatPrice } from '@/utils/format'
import { OrderStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { Button } from '@/components/ui/Button'
import { ORDER_STATUS } from '@/config/constants'
import type { Order, OrderStatusType } from '@/types'

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, status: OrderStatusType) => Promise<void>
}

export function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleChange = async (orderId: string, status: OrderStatusType) => {
    setUpdating(orderId)
    try {
      await onStatusChange(orderId, status)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            <th className="px-4 py-3 font-semibold text-slate-600">Order ID</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Items</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Total</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                No orders yet.
              </td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs text-slate-500">
                #{order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="px-4 py-3 text-slate-600">{formatDate(order.created_at)}</td>
              <td className="px-4 py-3 text-slate-600">
                {order.order_items?.length ?? 0} items
              </td>
              <td className="px-4 py-3 font-semibold text-slate-900">
                {formatPrice(order.total_price)}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  disabled={updating === order.id}
                  onChange={(e) => handleChange(order.id, e.target.value as OrderStatusType)}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {Object.values(ORDER_STATUS).map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
