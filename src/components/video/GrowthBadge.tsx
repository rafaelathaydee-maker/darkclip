import { cn } from '@/lib/utils'
import { formatGrowth } from '@/lib/utils'

interface GrowthBadgeProps {
  percent: number
  className?: string
  compact?: boolean
}

export function GrowthBadge({ percent, className, compact }: GrowthBadgeProps) {
  const isHot = percent >= 500

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5',
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]',
        'rounded-[4px] font-mono font-semibold',
        'border',
        isHot
          ? 'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border-[var(--color-accent)]/25'
          : 'bg-[var(--color-surface-3)] text-[var(--color-muted)] border-[var(--color-border)]',
        className
      )}
    >
      <span className="opacity-80">↑</span>
      {formatGrowth(percent)}
    </div>
  )
}
