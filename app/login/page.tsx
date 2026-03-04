'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { APP_NAME } from '@/config/constants'
import { ROUTES } from '@/config/routes'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw new Error(authError.message)

      router.push(ROUTES.DASHBOARD)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#071f1c' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)', color: '#064E3B' }}
          >
            ✦
          </div>
          <h1
            className="mt-4 text-2xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Welcome back
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
            Sign in to your {APP_NAME} account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            backgroundColor: '#082E2C',
            borderColor: 'rgba(212,175,55,0.15)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-8 transition-opacity hover:opacity-70"
                style={{ color: '#9DB8B5' }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#9DB8B5' }}>
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.REGISTER}
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: '#D4AF37' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
