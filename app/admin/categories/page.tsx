'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatDate } from '@/utils/format'
import { API_ROUTES } from '@/config/routes'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(API_ROUTES.ADMIN_CATEGORIES)
      const json = await res.json()
      setCategories(json.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleCreate = async (dto: CreateCategoryDto | UpdateCategoryDto) => {
    const res = await fetch(API_ROUTES.ADMIN_CATEGORIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (res.ok) { setModalOpen(false); await fetchCategories() }
  }

  const handleUpdate = async (dto: CreateCategoryDto | UpdateCategoryDto) => {
    if (!editingCategory) return
    const res = await fetch(API_ROUTES.ADMIN_CATEGORY(editingCategory.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (res.ok) { setModalOpen(false); setEditingCategory(undefined); await fetchCategories() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    setDeletingId(id)
    try {
      await fetch(API_ROUTES.ADMIN_CATEGORY(id), { method: 'DELETE' })
      await fetchCategories()
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">{categories.length} categories</p>
        </div>
        <Button onClick={() => { setEditingCategory(undefined); setModalOpen(true) }}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Created</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center">
                  <Tag className="mx-auto h-10 w-10 text-slate-200" />
                  <p className="mt-2 text-slate-400">No categories yet</p>
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{cat.name}</td>
                <td className="px-4 py-3 text-slate-500">
                  {cat.created_at ? formatDate(cat.created_at) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingCategory(cat); setModalOpen(true) }}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deletingId === cat.id}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCategory(undefined) }}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingCategory(undefined) }}
        />
      </Modal>
    </div>
  )
}
