'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, CheckCircle2, Lock, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease, transition } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'
import { useAnalytics } from '@/hooks/useAnalytics'

const NICHES = [
  { id: 'cars',       label: 'Cars'       },
  { id: 'luxury',     label: 'Luxury'     },
  { id: 'gym',        label: 'Gym'        },
  { id: 'motivation', label: 'Motivation' },
  { id: 'asmr',       label: 'ASMR'       },
  { id: 'anime',      label: 'Anime'      },
  { id: 'football',   label: 'Football'   },
  { id: 'ai',         label: 'AI'         },
  { id: 'cinematic',  label: 'Cinematic'  },
  { id: 'lifestyle',  label: 'Lifestyle'  },
]

const SOCIAL_PROOF = [
  'Rafael M. just joined',
  'Lucas F. just joined',
  'Mateus C. just joined',
  'André P. just joined',
]

// Deterministic fake waitlist position — same value per session
function useWaitlistPosition() {
  return useMemo(() => {
    return Math.floor(Math.random() * 71) + 240  // 240–310
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function EarlyAccessModal() {
  const { isOpen, closeModal, source } = useConversion()
  const { track } = useAnalytics()
  const [email, setEmail]         = useState('')
  const [whatsapp, setWhatsapp]   = useState('')
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [proofIdx, setProofIdx]   = useState(0)
  const emailRef = useRef<HTMLInputElement>(null)
  const position = useWaitlistPosition()

  // Social proof rotator
  useEffect(() => {
    if (!isOpen || submitted) return
    const id = setInterval(() => setProofIdx(i => (i + 1) % SOCIAL_PROOF.length), 2800)
    return () => clearInterval(id)
  }, [isOpen, submitted])

  // Focus email on open
  useEffect(() => {
    if (isOpen && !submitted) {
      const t = setTimeout(() => emailRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen, submitted])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeModal])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setEmail(''); setWhatsapp(''); setSelectedNiche(null)
        setSubmitted(false); setLoading(false); setError('')
      }, 400)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailTrimmed = email.trim()
    if (!emailTrimmed) { setError('Digite seu email para continuar.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setError('Email inválido.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    emailTrimmed,
          whatsapp: whatsapp.trim() || undefined,
          niche:    selectedNiche   || undefined,
          source:   source ?? 'early_access_modal',
        }),
      })

      const data: { error?: string } = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Algo deu errado. Tente novamente.')
        setLoading(false)
        return
      }

      setLoading(false)
      setSubmitted(true)
      track('modal_submit_success', source ?? 'unknown')
    } catch {
      setError('Erro de conexão. Verifique sua internet.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className={cn(
              'fixed z-[90]',
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[calc(100vw-32px)] max-w-[440px]',
              'rounded-2xl overflow-hidden',
              'bg-[var(--color-surface)]',
              'border border-[var(--color-border-2)]',
              'shadow-[0_0_80px_oklch(72%_0.28_295_/_0.12),0_24px_64px_black/60%]',
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Accent glow header strip */}
            <div
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, transparent 0%, oklch(72% 0.28 295) 40%, oklch(80% 0.24 310) 60%, transparent 100%)' }}
            />

            {/* Close */}
            <button
              onClick={closeModal}
              className={cn(
                'absolute top-4 right-4 z-10',
                'w-7 h-7 flex items-center justify-center rounded-lg',
                'text-[var(--color-faint)] hover:text-[var(--color-text)]',
                'hover:bg-[var(--color-surface-2)]',
                'transition-colors duration-150'
              )}
            >
              <X size={15} />
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                /* ── JOIN FORM ───────────────────────────────────────── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="px-7 pt-7 pb-8"
                >
                  {/* Icon + heading */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      'w-10 h-10 rounded-xl shrink-0',
                      'flex items-center justify-center',
                      'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30'
                    )}>
                      <Zap size={18} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[var(--color-text)] leading-none mb-1">
                        Get Early Access
                      </h2>
                      <p className="text-[12px] text-[var(--color-muted)]">
                        Join before public launch. Lock in R$8/mo.
                      </p>
                    </div>
                  </div>

                  {/* Social proof pill */}
                  <div className={cn(
                    'flex items-center gap-2 mb-5',
                    'px-3 py-2 rounded-xl',
                    'bg-[var(--color-surface-2)] border border-[var(--color-border)]'
                  )}>
                    {/* Avatars */}
                    <div className="flex -space-x-1.5 shrink-0">
                      {[295, 280, 308, 268].map((hue, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-[var(--color-surface-2)]"
                          style={{ background: `oklch(${48 + i * 4}% 0.16 ${hue})` }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={proofIdx}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18 }}
                          className="block text-[11px] text-[var(--color-muted)] truncate"
                        >
                          {SOCIAL_PROOF[proofIdx]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--color-faint)] shrink-0">
                      #{position} in line
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--color-faint)] uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        placeholder="you@email.com"
                        className={cn(
                          'w-full h-10 px-3 rounded-xl',
                          'bg-[var(--color-surface-2)]',
                          'border transition-colors duration-150',
                          error
                            ? 'border-[var(--color-error)]/60'
                            : 'border-[var(--color-border)] focus:border-[var(--color-accent)]/60',
                          'text-[13px] text-[var(--color-text)]',
                          'placeholder:text-[var(--color-faint)]',
                          'outline-none'
                        )}
                      />
                      <AnimatePresence>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-[11px] text-[var(--color-error)]"
                          >
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* WhatsApp (optional) */}
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--color-faint)] uppercase tracking-wider mb-1.5">
                        WhatsApp <span className="normal-case tracking-normal text-[var(--color-faint)]/60">(opcional — alertas de tendência)</span>
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        placeholder="+55 11 9 0000-0000"
                        className={cn(
                          'w-full h-10 px-3 rounded-xl',
                          'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                          'text-[13px] text-[var(--color-text)]',
                          'placeholder:text-[var(--color-faint)]',
                          'outline-none focus:border-[var(--color-accent)]/60',
                          'transition-colors duration-150'
                        )}
                      />
                    </div>

                    {/* Niche interest */}
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--color-faint)] uppercase tracking-wider mb-2">
                        Niche de interesse
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {NICHES.map(n => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => setSelectedNiche(n.id === selectedNiche ? null : n.id)}
                            className={cn(
                              'flex items-center gap-1',
                              'px-2.5 py-1 rounded-full',
                              'text-[11px] font-mono',
                              'border transition-all duration-150',
                              'active:scale-[0.95]',
                              selectedNiche === n.id
                                ? 'bg-[var(--color-accent)]/15 border-[var(--color-accent)]/50 text-[var(--color-accent)]'
                                : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-2)]'
                            )}
                          >
                            {n.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        'relative mt-1 w-full h-11 rounded-xl',
                        'text-[13px] font-semibold text-black',
                        'transition-all duration-150 active:scale-[0.98]',
                        loading && 'opacity-80 cursor-not-allowed',
                        !loading && 'hover:brightness-110'
                      )}
                      style={{
                        background: 'linear-gradient(105deg, oklch(72% 0.28 295) 0%, oklch(78% 0.26 310) 100%)',
                        boxShadow: '0 0 24px oklch(72% 0.28 295 / 0.3)',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <span
                              className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"
                            />
                            Aguarde…
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Zap size={14} className="fill-black" />
                            Entrar na lista de acesso
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <p className="text-center text-[10px] text-[var(--color-faint)]">
                      Sem spam. Sem cartão de crédito. Cancele quando quiser.
                    </p>
                  </form>
                </motion.div>
              ) : (
                /* ── SUCCESS STATE ───────────────────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: ease.out }}
                  className="px-7 pt-10 pb-10 flex flex-col items-center text-center gap-5"
                >
                  {/* Animated check */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.35, delay: 0.05 }}
                    className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center',
                      'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30'
                    )}
                  >
                    <CheckCircle2 size={28} className="text-[var(--color-accent)]" />
                  </motion.div>

                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3, ease: ease.out }}
                      className="text-[18px] font-bold text-[var(--color-text)] mb-2"
                    >
                      Você está na lista
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.3, ease: ease.out }}
                      className="text-[13px] text-[var(--color-muted)] leading-relaxed max-w-[300px]"
                    >
                      Você é o <span className="font-mono font-bold text-[var(--color-accent)]">#{position}</span> da fila.
                      Avisaremos em <span className="text-[var(--color-text)]">{email}</span> quando o acesso abrir.
                    </motion.p>
                  </div>

                  {/* Waitlist progress bar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-[var(--color-faint)]">
                      <span>Progresso da lista</span>
                      <span className="text-[var(--color-accent)]">
                        {Math.round(((400 - position) / 400) * 100)}% cheio
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-surface-3)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, oklch(72% 0.28 295) 0%, oklch(80% 0.24 310) 100%)' }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${((400 - position) / 400) * 100}%` }}
                        transition={{ delay: 0.45, duration: 0.8, ease: ease.out }}
                      />
                    </div>
                  </motion.div>

                  {/* Locked pill tease */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className={cn(
                      'flex items-center gap-2 w-full',
                      'px-4 py-3 rounded-xl',
                      'bg-[var(--color-accent)]/6 border border-[var(--color-accent)]/20'
                    )}
                  >
                    <Lock size={13} className="text-[var(--color-accent)] shrink-0" />
                    <p className="text-[12px] text-[var(--color-muted)] text-left">
                      Pro founders pagam <span className="text-[var(--color-accent)] font-semibold">R$8/mês</span> — depois sobe para R$29/mês.
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={closeModal}
                    className={cn(
                      'h-9 px-6 rounded-xl',
                      'text-[12px] font-medium',
                      'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                      'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-2)]',
                      'transition-all duration-150 active:scale-[0.97]'
                    )}
                  >
                    Continuar navegando
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
