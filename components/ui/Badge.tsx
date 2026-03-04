import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'emerald'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { backgroundColor: '#f0e8d8', color: '#7C6A50' },
  success: { backgroundColor: '#D1FAE5', color: '#065F46' },
  warning: { backgroundColor: '#FEF3C7', color: '#92400E' },
  danger: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  info: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
  gold: {
    background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(240,208,96,0.2))',
    color: '#A0852A',
    border: '1px solid rgba(212,175,55,0.4)',
  },
  emerald: {
    background: 'linear-gradient(135deg, rgba(6,78,59,0.1), rgba(6,95,70,0.1))',
    color: '#064E3B',
    border: '1px solid rgba(6,78,59,0.2)',
  },
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      style={variantStyles[variant]}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        className
      )}
    >
      {children}
    </span>
  )
}
