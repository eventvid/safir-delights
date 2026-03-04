'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ProductForm } from '@/components/admin/ProductForm'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice } from '@/utils/format'
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/config/constants'
import { API_ROUTES } from '@/config/routes'
import type { Product, Category, CreateProductDto, UpdateProductDto } from '@/types'
import Image from 'next/image'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(API_ROUTES.ADMIN_PRODUCTS),
        fetch(API_ROUTES.ADMIN_CATEGORIES),
      ])
      const [productsJson, categoriesJson] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
      ])
      setProducts(productsJson.data?.data ?? [])
      setCategories(categoriesJson.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleCreate = async (dto: CreateProductDto | UpdateProductDto) => {
    const res = await fetch(API_ROUTES.ADMIN_PRODUCTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (res.ok) {
      setModalOpen(false)
      await fetchData()
    }
  }

  const handleUpdate = async (dto: CreateProductDto | UpdateProductDto) => {
    if (!editingProduct) return
    const res = await fetch(API_ROUTES.ADMIN_PRODUCT(editingProduct.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (res.ok) {
      setModalOpen(false)
      setEditingProduct(undefined)
      await fetchData()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(id)
    try {
      await fetch(API_ROUTES.ADMIN_PRODUCT(id), { method: 'DELETE' })
      await fetchData()
    } finally {
      setDeletingId(null)
    }
  }

  const openCreate = () => { setEditingProduct(undefined); setModalOpen(true) }
  const openEdit = (p: Product) => { setEditingProduct(p); setModalOpen(true) }

  if (isLoading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{products.length} products total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 font-semibold text-slate-600">Product</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Price</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Stock</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Categories</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  <Package className="mx-auto h-10 w-10 text-slate-200" />
                  <p className="mt-2">No products yet</p>
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100 flex-shrink-0">
                      <Image
                        src={product.image_url ?? PRODUCT_IMAGE_PLACEHOLDER}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <span className="font-medium text-slate-900">{product.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(product.categories ?? []).map((cat) => (
                      <Badge key={cat.id} variant="emerald">{cat.name}</Badge>
                    ))}
                    {(!product.categories || product.categories.length === 0) && (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
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
        onClose={() => { setModalOpen(false); setEditingProduct(undefined) }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingProduct(undefined) }}
        />
      </Modal>
    </div>
  )
}
