'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface SidebarProps {
  items: NavItem[]
  title?: string
}

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 flex-shrink-0 lg:block">
      <div className="sticky top-24 rounded-xl border border-slate-200 bg-white shadow-sm">
        {title && (
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </p>
          </div>
        )}
        <nav className="p-2">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 flex-shrink-0',
                    active ? 'text-indigo-600' : 'text-slate-400'
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
