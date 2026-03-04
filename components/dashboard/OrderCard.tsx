import { formatDate, formatPrice } from '@/utils/format'
import { OrderStatusBadge } from './OrderStatusBadge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Package, ChevronDown } from 'lucide-react'
import type { Order } from '@/types'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm font-bold text-slate-900">
              {formatPrice(order.total_price)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-slate-100">
          {(order.order_items ?? []).map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {item.product?.title ?? 'Product'}
                </span>
                <span className="text-xs text-slate-400">× {item.quantity}</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
