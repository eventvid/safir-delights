'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { APP_NAME } from '@/config/constants'
import { ROUTES } from '@/config/routes'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    if (!email) return 'Email is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    if (password !== confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw new Error(authError.message)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
        style={{ backgroundColor: '#071f1c' }}
      >
        <div className="w-full max-w-md text-center">
          <CheckCircle className="mx-auto h-16 w-16" style={{ color: '#D4AF37' }} />
          <h2
            className="mt-4 text-2xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Check your email
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#9DB8B5' }}>
            We sent a confirmation link to{' '}
            <strong style={{ color: '#F5F0E8' }}>{email}</strong>. Click the link to activate your
            account.
          </p>
          <Link href={ROUTES.LOGIN} className="mt-6 inline-block">
            <Button variant="outline">Back to sign in</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#071f1c' }}
    >
      <div className="w-full max-w-md">
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
            Create your account
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
            Join thousands of shoppers on {APP_NAME}
          </p>
        </div>

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
                placeholder="Min. 6 characters"
                required
                hint="At least 6 characters"
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

            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#9DB8B5' }}>
            Already have an account?{' '}
            <Link
              href={ROUTES.LOGIN}
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: '#D4AF37' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
