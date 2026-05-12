import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'signal' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  pulse?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-3)] text-[var(--color-muted)] border-[var(--color-border)]',
  accent:  'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border-[var(--color-accent)]/30',
  signal:  'bg-[var(--color-accent)]/8 text-[var(--color-accent)]/80 border-[var(--color-accent)]/20',
  muted:   'bg-transparent text-[var(--color-faint)] border-[var(--color-border)]',
}

export function Badge({ children, variant = 'default', className, pulse }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'px-1.5 py-0.5 rounded-md',
        'text-[10px] font-mono font-semibold tracking-wide uppercase',
        'border',
        variantClasses[variant],
        pulse && 'animate-[pulse-glow_2s_ease-in-out_infinite]',
        className
      )}
    >
      {children}
    </span>
  )
}
