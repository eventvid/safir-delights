'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types'

interface CategoryFormProps {
  category?: Category
  onSubmit: (dto: CreateCategoryDto | UpdateCategoryDto) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    setIsSubmitting(true)
    try {
      await onSubmit({ name: name.trim() })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category name"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          setError('')
        }}
        error={error}
        placeholder="e.g. Electronics"
        autoFocus
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {category ? 'Save changes' : 'Create category'}
        </Button>
      </div>
    </form>
  )
}
