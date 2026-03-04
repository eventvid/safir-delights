import { z } from 'zod'

// ─── Product schemas ──────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000).optional(),
  price: z.number().nonnegative('Price must be ≥ 0'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  stock: z.number().int().nonnegative('Stock must be ≥ 0'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  ingredients: z.string().max(1000).optional(),
  weight_grams: z.number().int().positive().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  is_featured: z.boolean().optional(),
  is_best_seller: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  category_ids: z.array(z.string().uuid()).optional(),
})

export const updateProductSchema = createProductSchema.partial()

// ─── Category schemas ─────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
})

export const updateCategorySchema = createCategorySchema.partial()

// ─── Cart schemas ─────────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be ≥ 1').max(99),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be ≥ 1').max(99),
})

// ─── Order schemas ────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  note: z.string().max(500).optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ─── Type exports ─────────────────────────────────────────────────────────────

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
