'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'
import { useAnalytics } from '@/hooks/useAnalytics'

const PROOF_STATS = [
  { value: '847+',  label: 'clips indexados hoje' },
  { value: '23',    label: 'explodindo agora' },
  { value: '10',    label: 'nichos monitorados' },
  { value: '1h',    label: 'ciclo de atualização' },
]

export function BottomCTA() {
  const { openModal } = useConversion()
  const { track } = useAnalytics()

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)]">
      {/* Background glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[-20%] w-[70%] h-[140%] opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, oklch(72% 0.28 295) 0%, transparent 70%)' }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: [
              'linear-gradient(oklch(30% 0.015 280 / 0.4) 1px, transparent 1px)',
              'linear-gradient(90deg, oklch(30% 0.015 280 / 0.4) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '44px 44px',
          }}
        />
        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-20"
          style={{ background: 'linear-gradient(to bottom, var(--color-bg), transparent)' }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 py-20 sm:py-28">
        <div className="max-w-[640px] mx-auto text-center">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: ease.out }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Para criadores de dark page
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.05 }}
            className={cn(
              'text-[28px] sm:text-[38px] md:text-[44px]',
              'font-bold tracking-[-0.03em] leading-[1.1]',
              'text-[var(--color-text)]',
              'mb-5'
            )}
          >
            Pare de caçar clips
            <br />
            <span className="text-[var(--color-accent)]">
              manualmente.
            </span>
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: ease.out, delay: 0.1 }}
            className="text-[14px] sm:text-[15px] text-[var(--color-muted)] leading-relaxed mb-6 max-w-[440px] mx-auto"
          >
            Criadores Pro já estão vendo isso primeiro. Cada hora de atraso é uma tendência
            que alguém else já postou.
          </motion.p>

          {/* Urgency pill */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: ease.out, delay: 0.15 }}
            className="flex justify-center mb-8"
          >
            <span className={cn(
              'px-3 py-1.5 rounded-full',
              'text-[11px] font-mono',
              'border',
              'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/25'
            )}>
              Acesso antecipado por R$6/mês — apenas para os primeiros 100
            </span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: ease.out, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
          >
            {PROOF_STATS.map(s => (
              <div
                key={s.label}
                className={cn(
                  'flex flex-col items-center gap-0.5',
                  'py-3 rounded-xl',
                  'bg-[var(--color-surface)] border border-[var(--color-border)]'
                )}
              >
                <span className="text-[20px] font-bold font-mono text-[var(--color-text)]">{s.value}</span>
                <span className="text-[10px] text-[var(--color-faint)] text-center">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: ease.out, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => { track('bottom_cta_click', 'bottom_cta'); openModal('bottom_cta') }}
              className={cn(
                'flex items-center gap-2',
                'h-12 px-7 rounded-xl',
                'text-[14px] font-semibold text-black',
                'transition-all duration-150 active:scale-[0.97] hover:brightness-110',
                'w-full sm:w-auto justify-center'
              )}
              style={{
                background: 'linear-gradient(105deg, oklch(72% 0.28 295) 0%, oklch(78% 0.26 310) 100%)',
                boxShadow: '0 0 28px oklch(72% 0.28 295 / 0.35), 0 0 56px oklch(72% 0.28 295 / 0.12)',
              }}
            >
              <Zap size={15} className="fill-black" />
              Garantir acesso antecipado
              <ArrowRight size={14} />
            </button>

            <p className="text-[12px] text-[var(--color-faint)]">
              Grátis para explorar agora.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
