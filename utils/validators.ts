export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isValidPrice(price: number): boolean {
  return price >= 0 && Number.isFinite(price)
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0
}

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}
