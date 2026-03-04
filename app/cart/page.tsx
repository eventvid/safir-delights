'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice } from '@/utils/format'
import { ROUTES, API_ROUTES } from '@/config/routes'

export default function CartPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, isLoading, refreshCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setError('')
    try {
      const res = await fetch(API_ROUTES.ORDERS, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Checkout failed')
      await refreshCart()
      router.push(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) return <PageSpinner />

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={ROUTES.CATALOG}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
        <ShoppingCart className="h-6 w-6" />
        Shopping Cart
        {totalItems > 0 && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-700">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <Package className="h-20 w-20 text-slate-200" />
          <h2 className="mt-4 text-xl font-semibold text-slate-700">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Add some products from the catalog.</p>
          <Link href={ROUTES.CATALOG} className="mt-6">
            <Button>Browse products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="divide-y divide-slate-100 py-0 px-6">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <h2 className="font-semibold text-slate-900">Order Summary</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                {error && (
                  <div className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                  className="w-full"
                  size="lg"
                >
                  Place Order — {formatPrice(totalPrice)}
                </Button>
                <p className="text-center text-xs text-slate-400">
                  By placing your order you agree to our terms.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
