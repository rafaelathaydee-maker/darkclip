'use client'

import { motion } from 'framer-motion'
import { Check, Lock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sectionVariants, staggerContainer, ease } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'
import { useAnalytics } from '@/hooks/useAnalytics'

const FREE_FEATURES = [
  '2 clips por dia',
  '3 nichos disponíveis',
  'Viral Score básico',
  'Feed atualizado 1x/dia',
]

const PRO_FEATURES = [
  'Clips ilimitados, todo dia',
  'Todos os 10 nichos',
  'Viral Score + Early Signals',
  'Feed atualizado a cada hora',
  'Drawer de inteligência completo',
  'Clips similares por nicho',
  'Alertas de tendência explodindo',
  'Acesso antecipado a novos recursos',
]

export function PricingSection() {
  const { openModal } = useConversion()
  const { track } = useAnalytics()

  return (
    <section className="relative max-w-[1400px] mx-auto px-5 py-20">
      {/* Section header */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        className="text-center mb-12"
      >
        <span className={cn(
          'inline-flex items-center gap-1.5 mb-4',
          'px-3 py-1.5 rounded-full',
          'text-[11px] font-mono uppercase tracking-[0.12em]',
          'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/25 text-[var(--color-accent)]'
        )}>
          <Lock size={9} /> Acesso antecipado
        </span>
        <h2 className={cn(
          'text-[28px] sm:text-[34px] font-bold',
          'tracking-[-0.03em] leading-tight',
          'text-[var(--color-text)]',
          'mb-3'
        )}>
          Simples e sem surpresas.
        </h2>
        <p className="text-[14px] text-[var(--color-muted)] max-w-[400px] mx-auto">
          Criadores que entram agora travam o preço de fundador para sempre.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[740px] mx-auto"
      >
        {/* FREE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: ease.out }}
          className={cn(
            'flex flex-col',
            'p-6 rounded-2xl',
            'bg-[var(--color-surface)] border border-[var(--color-border)]',
          )}
        >
          <div className="mb-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-faint)] mb-2">
              Free
            </p>
            <div className="flex items-end gap-1.5 mb-1">
              <span className="text-[32px] font-bold text-[var(--color-text)] leading-none">R$0</span>
              <span className="text-[13px] text-[var(--color-muted)] pb-1">/mês</span>
            </div>
            <p className="text-[12px] text-[var(--color-muted)]">
              Para começar a explorar.
            </p>
          </div>

          <ul className="flex flex-col gap-2.5 mb-8 flex-1">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--color-muted)]">
                <Check size={13} className="text-[var(--color-border-2)] mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => openModal('pricing_free')}
            className={cn(
              'w-full h-10 rounded-xl',
              'text-[13px] font-medium',
              'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
              'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-2)]',
              'transition-all duration-150 active:scale-[0.97]'
            )}
          >
            Entrar na lista
          </button>
        </motion.div>

        {/* PRO FOUNDER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: ease.out, delay: 0.08 }}
          className={cn(
            'flex flex-col relative',
            'p-6 rounded-2xl',
            'border',
          )}
          style={{
            background: 'linear-gradient(145deg, oklch(13% 0.014 280) 0%, oklch(11% 0.012 295) 100%)',
            borderColor: 'oklch(72% 0.28 295 / 0.3)',
            boxShadow: '0 0 0 1px oklch(72% 0.28 295 / 0.08), 0 0 40px oklch(72% 0.28 295 / 0.08), inset 0 0 40px oklch(72% 0.28 295 / 0.02)',
          }}
        >
          {/* Founder badge */}
          <span className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2',
            'px-3 py-1 rounded-full whitespace-nowrap',
            'text-[10px] font-mono font-bold uppercase tracking-[0.1em]',
            'text-black',
          )}
            style={{ background: 'linear-gradient(90deg, oklch(72% 0.28 295) 0%, oklch(80% 0.24 310) 100%)' }}
          >
            ✦ Pro Fundador
          </span>

          <div className="mb-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-accent)] mb-2">
              Pro
            </p>
            <div className="flex items-end gap-1.5 mb-1">
              <span
                className="text-[32px] font-bold leading-none"
                style={{
                  background: 'linear-gradient(95deg, oklch(72% 0.28 295) 0%, oklch(85% 0.20 310) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                R$8
              </span>
              <span className="text-[13px] text-[var(--color-muted)] pb-1">/mês</span>
              <span className="text-[12px] text-[var(--color-faint)] line-through pb-1 ml-1">R$29</span>
            </div>
            <p className="text-[12px] text-[var(--color-muted)]">
              Preço travado para sempre.
            </p>
          </div>

          <ul className="flex flex-col gap-2.5 mb-8 flex-1">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--color-text)]">
                <Check size={13} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => { track('pricing_pro_click', 'pricing_section'); openModal('pricing_pro') }}
            className={cn(
              'w-full h-11 rounded-xl',
              'text-[13px] font-semibold text-black',
              'transition-all duration-150 active:scale-[0.97] hover:brightness-110',
            )}
            style={{
              background: 'linear-gradient(105deg, oklch(72% 0.28 295) 0%, oklch(78% 0.26 310) 100%)',
              boxShadow: '0 0 20px oklch(72% 0.28 295 / 0.3)',
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Zap size={14} className="fill-black" />
              Garantir R$8/mês
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center text-[11px] text-[var(--color-faint)] mt-6"
      >
        Acesso por email • Sem cartão de crédito necessário agora • Cancele quando quiser
      </motion.p>
    </section>
  )
}
