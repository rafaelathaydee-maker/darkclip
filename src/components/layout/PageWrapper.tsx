'use client'

import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen',
        'bg-[var(--color-bg)]',
        className
      )}
    >
      {children}
    </div>
  )
}
