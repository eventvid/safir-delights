'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  const debouncedValue = useDebounce(value, 350)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue) {
      params.set('search', debouncedValue)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push(`/catalog?${params.toString()}`)
  }, [debouncedValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-sm">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: '#9DB8B5' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search sweets..."
        className="h-10 w-full rounded-xl pl-9 pr-9 text-sm outline-none transition-all"
        style={{
          backgroundColor: 'rgba(10,59,56,0.6)',
          border: '1px solid rgba(212,175,55,0.2)',
          color: '#F5F0E8',
        }}
        onFocus={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.45)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'
        }}
        onBlur={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.2)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
        aria-label="Search products"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
          style={{ color: '#9DB8B5' }}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
