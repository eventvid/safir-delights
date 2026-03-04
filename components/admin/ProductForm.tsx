'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { Category, CreateProductDto, Product, UpdateProductDto } from '@/types'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (dto: CreateProductDto | UpdateProductDto) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    title: product?.title ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    image_url: product?.image_url ?? '',
    stock: product?.stock?.toString() ?? '0',
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories?.map((c) => c.id) ?? []
  )
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const errs: Partial<typeof form> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.price || Number(form.price) < 0) errs.price = 'Valid price is required'
    if (form.stock === '' || Number(form.stock) < 0) errs.stock = 'Valid stock is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        image_url: form.image_url.trim() || undefined,
        stock: Number(form.stock),
        category_ids: selectedCategories,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        error={errors.title}
        placeholder="Product name"
      />

      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="Product description"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          error={errors.price}
          placeholder="0.00"
        />
        <Input
          label="Stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          error={errors.stock}
          placeholder="0"
        />
      </div>

      <Input
        label="Image URL"
        value={form.image_url}
        onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
        placeholder="https://..."
      />

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {product ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </form>
  )
}
