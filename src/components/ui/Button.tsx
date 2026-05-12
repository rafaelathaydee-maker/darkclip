import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-[var(--color-accent)] text-white font-medium',
    'hover:brightness-110',
    'shadow-[0_0_16px_var(--color-accent)/20%]',
    'hover:shadow-[0_0_24px_var(--color-accent)/30%]'
  ),
  ghost: cn(
    'bg-transparent text-[var(--color-muted)]',
    'hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
  ),
  outline: cn(
    'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
    'border border-[var(--color-accent)]/30',
    'hover:bg-[var(--color-accent)]/18 hover:border-[var(--color-accent)]/50'
  ),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-[12px] rounded-md gap-1.5',
  md: 'h-9 px-4 text-[13px] rounded-lg gap-2',
  lg: 'h-11 px-6 text-[14px] rounded-xl gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'font-medium',
        'transition-all duration-150',
        'active:scale-[0.97]',
        'disabled:opacity-40 disabled:pointer-events-none',
        'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
