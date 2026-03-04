// ─── Brand ────────────────────────────────────────────────────────────────────
export const APP_NAME = 'Safir Delights'
export const APP_TAGLINE = 'Authentic Turkish & Middle Eastern Sweets — Delivered Worldwide'
export const APP_DESCRIPTION =
  'Discover the finest Turkish baklava, kunefe, Turkish delight, and Middle Eastern sweets. Handcrafted with centuries-old recipes, delivered worldwide.'
export const APP_VERSION = '1.0.0'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://safirdelights.com'

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const

// ─── Order status ─────────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

// ─── User roles ───────────────────────────────────────────────────────────────
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const

// ─── Brand colors ─────────────────────────────────────────────────────────────
export const BRAND_COLORS = {
  EMERALD: '#064E3B',
  EMERALD_LIGHT: '#065F46',
  GOLD: '#D4AF37',
  GOLD_LIGHT: '#F0D060',
  CREAM: '#FFF8ED',
  CHARCOAL: '#1C1C1C',
} as const

// ─── Images ───────────────────────────────────────────────────────────────────
export const PRODUCT_IMAGE_PLACEHOLDER =
  'https://placehold.co/600x400/064E3B/D4AF37?text=Safir+Delights'

// ─── Social ───────────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/safirdelights',
  FACEBOOK: 'https://facebook.com/safirdelights',
  TWITTER: 'https://twitter.com/safirdelights',
  TIKTOK: 'https://tiktok.com/@safirdelights',
} as const

// ─── Contact ──────────────────────────────────────────────────────────────────
export const CONTACT_EMAIL = 'hello@safirdelights.com'
export const CONTACT_PHONE = '+1 (555) 123-4567'
export const CONTACT_ADDRESS = '123 Sweet Street, Istanbul District, NY 10001'

// ─── Categories (display names) ───────────────────────────────────────────────
export const FEATURED_CATEGORIES = [
  { slug: 'baklava',           name: 'Baklava',       emoji: '🥐', description: 'Crispy phyllo layers with premium nuts & honey' },
  { slug: 'lokum',             name: 'Lokum',         emoji: '🌸', description: 'Artisan Turkish delight in every flavor imaginable' },
  { slug: 'halva',             name: 'Halva',         emoji: '🍫', description: 'Sesame & pistachio confections, crumbly and rich' },
  { slug: 'date-based-sweets', name: 'Date Sweets',   emoji: '🌴', description: 'Premium dates and date confections from the region' },
  { slug: 'premium-gift-boxes',name: 'Gift Boxes',    emoji: '🎁', description: 'Curated luxury assortments for every occasion' },
  { slug: 'arabic-sweets',     name: 'Arabic Sweets', emoji: '✨', description: 'Traditional Middle Eastern pastries and confections' },
] as const
