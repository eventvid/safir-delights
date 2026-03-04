import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: '#9DB8B5' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border px-4 text-sm',
            'transition-all duration-200',
            'focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500',
            className
          )}
          style={{
            backgroundColor: 'rgba(10,59,56,0.6)',
            borderColor: error ? '#ef4444' : 'rgba(212,175,55,0.2)',
            color: '#F5F0E8',
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'
            }
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }
            props.onBlur?.(e)
          }}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && (
          <p className="text-xs" style={{ color: '#9DB8B5' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: '#9DB8B5' }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm',
            'transition-all duration-200 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-500',
            className
          )}
          style={{
            backgroundColor: 'rgba(10,59,56,0.6)',
            borderColor: error ? '#ef4444' : 'rgba(212,175,55,0.2)',
            color: '#F5F0E8',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
            e.currentTarget.style.boxShadow = 'none'
            props.onBlur?.(e)
          }}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
