import { Badge } from '@/components/ui/Badge'
import { capitalize } from '@/utils/format'
import type { OrderStatusType } from '@/types'

const statusVariant: Record<OrderStatusType, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'default',
  processing: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'danger',
}

interface OrderStatusBadgeProps {
  status: OrderStatusType
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={statusVariant[status]}>{capitalize(status)}</Badge>
}
