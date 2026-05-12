import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glow?: 'accent' | 'none'
  hoverable?: boolean
}

export function GlowCard({
  children,
  className,
  glow = 'accent',
  hoverable = true,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border)]',
        'transition-all duration-200',
        hoverable && cn(
          'cursor-pointer',
          'hover:border-[var(--color-border-2)]',
          glow === 'accent' && 'hover:shadow-[0_0_0_1px_var(--color-accent)/20%,0_0_24px_var(--color-accent)/8%]',
        ),
        className
      )}
    >
      {children}
    </div>
  )
}
