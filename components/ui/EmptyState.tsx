import Link from 'next/link'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  emoji?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  emoji = '🍬',
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border py-16 px-8 text-center',
        className
      )}
      style={{ borderColor: '#E8DCC8', backgroundColor: 'rgba(255,248,237,0.5)' }}
    >
      <div className="text-5xl">{emoji}</div>

      <h3
        className="mt-4 text-xl font-semibold"
        style={{ fontFamily: 'var(--font-playfair)', color: '#064E3B' }}
      >
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm" style={{ color: '#7C6A50' }}>
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105 hover:shadow-md"
          style={{
            background: 'linear-gradient(135deg, #064E3B, #065F46)',
            color: '#FFF8ED',
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
