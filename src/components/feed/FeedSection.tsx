'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sectionVariants } from '@/lib/motion'
import { FeedRow } from './FeedRow'
import type { FeedSectionConfig, VideoItem } from '@/types'

interface FeedSectionProps {
  section: FeedSectionConfig
  videos: VideoItem[]
  onOpen?: (video: VideoItem) => void
}

export function FeedSection({ section, videos, onOpen }: FeedSectionProps) {
  const filtered = section.filter(videos)

  if (filtered.length === 0) return null

  return (
    <section className="mb-10">
      {/* Section header */}
      <motion.header
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -20px 0px' }}
        className="flex items-center justify-between px-5 mb-4"
      >
        <div className="flex items-center gap-2.5">
          <h2 className={cn(
            'text-[13px] font-semibold tracking-[0.04em] uppercase',
            'text-[var(--color-text)]'
          )}>
            {section.title}
          </h2>
          <span className={cn(
            'px-1.5 py-0.5 rounded-[3px]',
            'text-[9px] font-mono text-[var(--color-faint)] tracking-[0.06em]',
            'bg-[var(--color-surface-2)] border border-[var(--color-border)]'
          )}>
            {filtered.length}
          </span>
        </div>

        <button className={cn(
          'flex items-center gap-1',
          'text-[12px] text-[var(--color-muted)]',
          'hover:text-[var(--color-accent)]',
          'transition-colors duration-150',
          'active:scale-[0.97]'
        )}>
          See all
          <ArrowRight size={12} />
        </button>
      </motion.header>

      {/* Content row */}
      <FeedRow videos={filtered} onOpen={onOpen} />
    </section>
  )
}
