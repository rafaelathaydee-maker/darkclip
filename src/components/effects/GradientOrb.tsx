'use client'

import { cn } from '@/lib/utils'

interface GradientOrbProps {
  className?: string
}

export function GradientOrb({ className }: GradientOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}
    >
      {/* Single faint accent bleed — top left only */}
      <div
        className="absolute -top-[15%] -left-[8%] w-[45%] h-[60%] opacity-[0.05]"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 25% 40%, oklch(72% 0.28 295) 0%, transparent 70%)',
        }}
      />

      {/* Horizontal accent line — very subtle top rule */}
      <div
        className="absolute top-0 left-0 w-full h-px opacity-[0.06]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, oklch(72% 0.28 295) 40%, transparent 100%)',
        }}
      />
    </div>
  )
}
