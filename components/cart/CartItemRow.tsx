'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/config/constants'
import type { CartItem } from '@/types'

interface CartItemRowProps {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateItem, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantity = async (newQty: number) => {
    if (newQty < 1) return
    setIsUpdating(true)
    try {
      await updateItem(item.id, newQty)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeItem(item.id)
    } finally {
      setIsUpdating(false)
    }
  }

  const product = item.product

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <Image
          src={product?.image_url ?? PRODUCT_IMAGE_PLACEHOLDER}
          alt={product?.title ?? 'Product'}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">{product?.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatPrice(product?.price ?? 0)} each
            </p>
          </div>
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-slate-400 hover:text-red-500 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity control */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200">
            <button
              onClick={() => handleQuantity(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="flex h-7 w-7 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantity(item.quantity + 1)}
              disabled={isUpdating}
              className="flex h-7 w-7 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Subtotal */}
          <span className="text-sm font-bold text-slate-900">
            {formatPrice((product?.price ?? 0) * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
