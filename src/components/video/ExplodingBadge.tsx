import { cn } from '@/lib/utils'

interface ExplodingBadgeProps {
  className?: string
}

export function ExplodingBadge({ className }: ExplodingBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'px-1.5 py-[3px] rounded-[4px]',
        'text-[9px] font-mono font-bold uppercase tracking-[0.14em]',
        'bg-[var(--color-accent)]/12 border border-[var(--color-accent)]/30',
        'text-[var(--color-accent)]',
        'animate-[signal-flicker_6s_ease-in-out_infinite]',
        className
      )}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-[5px] w-[5px] shrink-0">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{
            background: 'var(--color-accent)',
            animation: 'ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        <span
          className="relative inline-flex rounded-full h-[5px] w-[5px]"
          style={{ background: 'var(--color-accent)' }}
        />
      </span>
      LIVE
    </span>
  )
}
