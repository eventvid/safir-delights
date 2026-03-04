'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Input, Textarea } from '@/components/ui/Input'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from '@/config/constants'

const CONTACT_ITEMS = [
  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Phone', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE}` },
  { icon: MapPin, label: 'Address', value: CONTACT_ADDRESS, href: '#' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9am – 6pm EST', href: '#' },
]

const FAQ = [
  {
    q: 'How long does shipping take?',
    a: 'Standard international shipping takes 5–10 business days. Express options (2–3 days) are available at checkout.',
  },
  {
    q: 'Are the sweets preservative-free?',
    a: 'Yes! We use only natural ingredients. Our products have a shelf life of 2–4 weeks depending on the item.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Complimentary gift wrapping is available on all orders. Add a personalized message at checkout.',
  },
  {
    q: 'Can I customize a gift box?',
    a: "Absolutely. Contact us directly and we'll curate a bespoke selection based on your preferences and budget.",
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
    toast.success('Message sent!', { description: "We'll get back to you within 24 hours." })
  }

  return (
    <div style={{ backgroundColor: '#071f1c', minHeight: '100vh' }}>
      {/* Header */}
      <section
        className="relative overflow-hidden py-20 text-center"
        style={{ backgroundColor: '#082E2C', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,95,70,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
            Get in Touch
          </p>
          <h1
            className="mt-3 text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
          >
            Contact Us
          </h1>
          <p className="mt-4 text-sm" style={{ color: '#9DB8B5' }}>
            Questions about an order? Interested in bulk or corporate gifting?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
            >
              How to Reach Us
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#9DB8B5' }}>
              Our customer happiness team is available to assist you.
            </p>

            <div className="mt-8 space-y-5">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'rgba(212,175,55,0.15)',
                    backgroundColor: '#0A3B38',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.15)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#D4AF37' }}>
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm" style={{ color: '#F5F0E8' }}>
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
              >
                Frequently Asked
              </h3>
              <div className="mt-6 space-y-5">
                {FAQ.map(({ q, a }) => (
                  <div
                    key={q}
                    className="rounded-2xl border p-5"
                    style={{
                      borderColor: 'rgba(212,175,55,0.15)',
                      backgroundColor: '#0A3B38',
                    }}
                  >
                    <p className="font-medium" style={{ color: '#F5F0E8' }}>
                      {q}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9DB8B5' }}>
                      {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div
              className="rounded-2xl border p-8"
              style={{
                borderColor: 'rgba(212,175,55,0.15)',
                backgroundColor: '#082E2C',
              }}
            >
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <CheckCircle className="h-16 w-16" style={{ color: '#D4AF37' }} />
                  <h3
                    className="mt-4 text-xl font-bold"
                    style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                  >
                    Message Received!
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: '#9DB8B5' }}>
                    Thank you for reaching out. We&apos;ll respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: '#D4AF37' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-playfair)', color: '#F5F0E8' }}
                  >
                    Send a Message
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: '#9DB8B5' }}>
                    We respond within 24 business hours.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="First name" name="firstName" placeholder="Sarah" required />
                      <Input label="Last name" name="lastName" placeholder="Johnson" required />
                    </div>
                    <Input label="Email" name="email" type="email" placeholder="sarah@example.com" required />
                    <Input label="Subject" name="subject" placeholder="Order inquiry, corporate gift, etc." required />
                    <Textarea
                      label="Message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold-shimmer flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all hover:scale-[1.01] disabled:opacity-60"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                        color: '#064E3B',
                      }}
                    >
                      {loading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
