import { cn } from '@/lib/utils'

interface ViralScoreProps {
  score: number
  className?: string
}

export function ViralScore({ score, className }: ViralScoreProps) {
  const isElite = score >= 90

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5',
        'px-1.5 py-0.5 rounded-[4px]',
        'font-mono text-[10px] font-bold',
        'border',
        isElite
          ? 'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border-[var(--color-accent)]/30'
          : 'bg-[var(--color-surface-3)] text-[var(--color-muted)] border-[var(--color-border)]',
        className
      )}
    >
      <span className="text-[8px] opacity-50 tracking-wider">VS</span>
      <span className="tracking-[-0.02em]">{score}</span>
    </div>
  )
}
