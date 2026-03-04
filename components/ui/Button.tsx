import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'text-white focus-visible:ring-emerald-500 disabled:opacity-60',
  gold:
    'font-semibold focus-visible:ring-yellow-400 disabled:opacity-60',
  secondary:
    'border font-medium focus-visible:ring-emerald-400 disabled:opacity-60',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
  ghost:
    'bg-transparent focus-visible:ring-emerald-400 disabled:opacity-60',
  outline:
    'border bg-transparent focus-visible:ring-emerald-400 disabled:opacity-60',
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #064E3B, #065F46)',
    color: '#FFF8ED',
  },
  gold: {
    background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
    color: '#064E3B',
  },
  secondary: {
    backgroundColor: 'rgba(6,78,59,0.08)',
    borderColor: 'rgba(6,78,59,0.2)',
    color: '#064E3B',
  },
  danger: {},
  ghost: {
    color: '#064E3B',
  },
  outline: {
    borderColor: '#064E3B',
    color: '#064E3B',
  },
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-4 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading, disabled, className, style, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{ ...variantStyles[variant], ...style }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
          'transition-all duration-200 hover:scale-[1.02] hover:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
