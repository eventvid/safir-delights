'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') ?? ''

  const handleSelect = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug) {
      params.set('category', categorySlug)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/catalog?${params.toString()}`)
  }

  const allCategories = [{ id: '_all', name: 'All', slug: '' }, ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => {
        const slug = 'slug' in cat ? (cat.slug ?? '') : ''
        const isActive = slug === '' ? currentCategory === '' : currentCategory === slug
        return (
          <motion.button
            key={cat.id}
            onClick={() => handleSelect(slug)}
            className="relative rounded-full px-4 py-1.5 text-sm font-medium overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              color: isActive ? '#064E3B' : 'rgba(157,184,181,0.85)',
              background: isActive
                ? 'linear-gradient(135deg, #D4AF37, #F0D060)'
                : 'rgba(10,59,56,0.5)',
              border: isActive ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.15)',
              transition: 'background 0.22s ease, color 0.22s ease, border-color 0.22s ease',
            }}
            aria-pressed={isActive}
          >
            {cat.name}
          </motion.button>
        )
      })}
    </div>
  )
}
