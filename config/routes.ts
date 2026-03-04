export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  CATALOG: '/shop',               // alias — kept for backwards compat
  CATEGORY: (slug: string) => `/category/${slug}`,
  PRODUCT: (id: string) => `/product/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  DASHBOARD: '/dashboard',        // alias — kept for backwards compat
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
} as const

export const PROTECTED_ROUTES = ['/dashboard', '/account', '/cart', '/checkout']
export const ADMIN_ROUTES = ['/admin']

export const API_ROUTES = {
  PRODUCTS: '/api/products',
  PRODUCT: (id: string) => `/api/products/${id}`,
  CATEGORIES: '/api/categories',
  CART: '/api/cart',
  CART_ITEM: (id: string) => `/api/cart/${id}`,
  ORDERS: '/api/orders',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_PRODUCT: (id: string) => `/api/admin/products/${id}`,
  ADMIN_CATEGORIES: '/api/admin/categories',
  ADMIN_CATEGORY: (id: string) => `/api/admin/categories/${id}`,
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_ORDER: (id: string) => `/api/admin/orders/${id}`,
} as const
