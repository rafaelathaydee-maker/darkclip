'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { staggerContainer } from '@/lib/motion'
import { VideoCard } from '@/components/video/VideoCard'
import type { VideoItem } from '@/types'

interface FeedRowProps {
  videos: VideoItem[]
  lockedCount?: number
  onOpen?: (video: VideoItem) => void
}

export function FeedRow({ videos, lockedCount = 2, onOpen }: FeedRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 500 : -500, behavior: 'smooth' })
  }

  if (videos.length === 0) return null

  return (
    <div className="relative group/row">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className={cn(
          'absolute left-1 top-1/2 -translate-y-1/2 z-10',
          'w-8 h-8 rounded-full flex items-center justify-center',
          'bg-[var(--color-surface-2)]/90 border border-[var(--color-border-2)]',
          'text-[var(--color-muted)] hover:text-[var(--color-text)]',
          'opacity-0 group-hover/row:opacity-100',
          'transition-all duration-150 active:scale-[0.92]',
          'backdrop-blur-sm'
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft size={15} />
      </button>
      <button
        onClick={() => scroll('right')}
        className={cn(
          'absolute right-1 top-1/2 -translate-y-1/2 z-10',
          'w-8 h-8 rounded-full flex items-center justify-center',
          'bg-[var(--color-surface-2)]/90 border border-[var(--color-border-2)]',
          'text-[var(--color-muted)] hover:text-[var(--color-text)]',
          'opacity-0 group-hover/row:opacity-100',
          'transition-all duration-150 active:scale-[0.92]',
          'backdrop-blur-sm'
        )}
        aria-label="Scroll right"
      >
        <ChevronRight size={15} />
      </button>

      {/* Row scroll container */}
      <motion.div
        ref={scrollRef}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -60px 0px' }}
        className={cn(
          'flex gap-3',
          'overflow-x-auto no-scrollbar',
          'px-5 pb-2',
        )}
      >
        <span className="shrink-0 w-0" aria-hidden />

        {videos.map((video, i) => {
          const isLocked = lockedCount > 0 && i >= videos.length - lockedCount
          return (
            <VideoCard
              key={video.id}
              video={video}
              locked={isLocked}
              onOpen={onOpen}
            />
          )
        })}

        <span className="shrink-0 w-4" aria-hidden />
      </motion.div>

      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-2 w-16 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to left, var(--color-bg) 20%, transparent)' }}
      />
    </div>
  )
}
