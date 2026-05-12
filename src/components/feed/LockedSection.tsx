'use client'

import { motion } from 'framer-motion'
import { Lock, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { staggerContainer, cardVariants, sectionVariants } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'
import { useFounder } from '@/lib/founder'
import { VideoCard } from '@/components/video/VideoCard'
import { MOCK_VIDEOS } from '@/lib/mock-data'
import type { VideoItem } from '@/types'

// These 6 high-score videos are the "Early Signals" Pro section
const EARLY_SIGNAL_VIDEOS = [...MOCK_VIDEOS]
  .sort((a, b) => b.viralScore - a.viralScore)
  .slice(6, 12)

export function LockedSection({ onOpen }: { onOpen?: (v: VideoItem) => void }) {
  const { openModal } = useConversion()
  const { isPro } = useFounder()

  const handleCTA = () => openModal('locked_section')

  return (
    <section className="mb-10 relative">
      {/* Section header */}
      <motion.header
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -20px 0px' }}
        className="flex items-center justify-between px-5 mb-4"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="text-[13px] font-semibold tracking-[0.04em] uppercase text-[var(--color-text)]">
            Early Signals
          </h2>
          <span className={cn(
            'flex items-center gap-1',
            'px-2 py-0.5 rounded-full',
            'text-[9px] font-mono font-bold uppercase tracking-wider',
            isPro
              ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
              : 'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
          )}>
            {isPro ? <><Crown size={7} /> PRO ✓</> : <><Lock size={7} /> PRO</>}
          </span>
        </div>
        <span className="text-[11px] text-[var(--color-faint)]">
          {isPro ? 'Founder access' : 'Updated hourly'}
        </span>
      </motion.header>

      {/* ── PRO UNLOCKED: scrollable real cards ──────────────────── */}
      {isPro ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2"
        >
          {EARLY_SIGNAL_VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              locked={false}
              onOpen={onOpen}
            />
          ))}
        </motion.div>
      ) : (
        /* ── FREE: blurred cards + lock overlay ─────────────────── */
        <div className="relative">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={cn(
              'flex gap-3',
              'overflow-x-hidden',
              'px-5 pb-2',
              'pointer-events-none select-none',
            )}
          >
            {EARLY_SIGNAL_VIDEOS.map((video) => (
              <motion.div
                key={video.id}
                variants={cardVariants}
                className={cn(
                  'relative overflow-hidden rounded-xl shrink-0',
                  'w-[200px] sm:w-[220px] h-[266px] sm:h-[292px]',
                  'border border-[var(--color-border)]',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt=""
                  className="w-full h-full object-cover brightness-[0.3] blur-[3px] scale-105"
                  draggable={false}
                />
                <div className="absolute top-2.5 right-2.5">
                  <div className={cn(
                    'px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono font-bold',
                    'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
                  )}>
                    VS {video.viralScore}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="text-[10px] font-mono font-semibold text-[var(--color-muted)] blur-[3px]">
                    ↑{video.growthPercent.toLocaleString()}%
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Lock overlay + CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(to right, transparent 0%, var(--color-bg)/80% 20%, var(--color-bg)/80% 80%, transparent 100%)',
            }}
          >
            <div className={cn(
              'flex flex-col items-center gap-4 text-center',
              'px-8 py-6 rounded-2xl',
              'glass border border-[var(--color-accent)]/20',
              'shadow-[0_0_40px_var(--color-accent)/6%]',
            )}>
              <div className={cn(
                'w-10 h-10 rounded-2xl flex items-center justify-center',
                'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30'
              )}>
                <Zap size={18} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[var(--color-text)] mb-1">
                  Criadores Pro estão vendo isso primeiro.
                </p>
                <p className="text-[12px] text-[var(--color-muted)] max-w-[220px]">
                  Desbloqueie os clips de hoje. Acesso por R$6/mês.
                </p>
              </div>
              <button
                onClick={handleCTA}
                className={cn(
                  'flex items-center gap-2',
                  'h-9 px-5 rounded-full',
                  'text-[12px] font-semibold',
                  'bg-[var(--color-accent)] text-black',
                  'hover:brightness-110 transition-all duration-150',
                  'active:scale-[0.97]',
                  'shadow-[0_0_16px_var(--color-accent)/25%]',
                  'pointer-events-auto'
                )}
              >
                Garantir acesso antecipado
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
