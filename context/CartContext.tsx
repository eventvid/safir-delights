'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { CartItem } from '@/types'
import { API_ROUTES } from '@/config/routes'

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(API_ROUTES.CART)
      if (res.ok) {
        const json = await res.json()
        setItems(json.data ?? [])
      } else {
        setItems([])
      }
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  )

  const addItem = async (productId: string, quantity = 1) => {
    const res = await fetch(API_ROUTES.CART, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
    if (res.ok) await refreshCart()
    else {
      const json = await res.json()
      throw new Error(json.error ?? 'Failed to add item')
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    const res = await fetch(API_ROUTES.CART_ITEM(itemId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
    if (res.ok) await refreshCart()
  }

  const removeItem = async (itemId: string) => {
    const res = await fetch(API_ROUTES.CART_ITEM(itemId), {
      method: 'DELETE',
    })
    if (res.ok) await refreshCart()
  }

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, isLoading, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
