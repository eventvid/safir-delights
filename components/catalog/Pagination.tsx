'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
}

export function Pagination({ page, totalPages, total, limit }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`/catalog?${params.toString()}`)
  }

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const pages: number[] = []
  const windowSize = Math.min(5, totalPages)
  let startPage = Math.max(1, page - Math.floor(windowSize / 2))
  const endPage = Math.min(totalPages, startPage + windowSize - 1)
  startPage = Math.max(1, endPage - windowSize + 1)
  for (let i = startPage; i <= endPage; i++) pages.push(i)

  return (
    <div
      className="flex items-center justify-between border-t pt-5"
      style={{ borderColor: 'rgba(212,175,55,0.12)' }}
    >
      <p className="text-sm" style={{ color: '#9DB8B5' }}>
        Showing <span className="font-semibold" style={{ color: '#F5F0E8' }}>{start}</span>–
        <span className="font-semibold" style={{ color: '#F5F0E8' }}>{end}</span> of{' '}
        <span className="font-semibold" style={{ color: '#F5F0E8' }}>{total}</span> products
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#9DB8B5', backgroundColor: 'rgba(10,59,56,0.5)' }}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-105"
            style={
              pageNum === page
                ? {
                    background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                    borderColor: '#D4AF37',
                    color: '#064E3B',
                  }
                : {
                    borderColor: 'rgba(212,175,55,0.15)',
                    color: '#9DB8B5',
                    backgroundColor: 'rgba(10,59,56,0.5)',
                  }
            }
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === page ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#9DB8B5', backgroundColor: 'rgba(10,59,56,0.5)' }}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
