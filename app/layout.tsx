import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/ui/PageTransition'
import { UserRepository } from '@/repositories/user.repository'
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '@/config/constants'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Authentic Turkish & Middle Eastern Sweets`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: `${APP_NAME} — Authentic Turkish & Middle Eastern Sweets`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  keywords: [
    'Turkish sweets',
    'baklava',
    'Turkish delight',
    'lokum',
    'Middle Eastern sweets',
    'kunefe',
    'halva',
    'dates',
    'online sweet shop',
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const userRepo = new UserRepository(supabase)
    isAdmin = await userRepo.isAdmin(user.id)
  }

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen" style={{ backgroundColor: '#071f1c', color: '#F5F0E8' }}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header user={user} isAdmin={isAdmin} />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1C1C1C',
              color: '#FFF8ED',
              border: '1px solid #D4AF37',
              borderRadius: '12px',
              fontFamily: 'var(--font-dm-sans)',
            },
          }}
        />
      </body>
    </html>
  )
}
