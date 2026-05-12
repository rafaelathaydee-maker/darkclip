'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Crown, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { useFounder } from '@/lib/founder'
import { useToast } from '@/lib/toast'

type SignInState = 'idle' | 'founder' | 'waitlist'

export function SignInModal() {
  const { isSignInOpen, closeSignIn, signIn } = useFounder()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SignInState>('idle')
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    const result = signIn(email)
    setState(result)

    if (result === 'founder') {
      setTimeout(() => {
        closeSignIn()
        setState('idle')
        setEmail('')
        toast('Founder Pro ativado — bem-vindo de volta', 'success')
      }, 1000)
    }
  }

  const handleClose = () => {
    closeSignIn()
    // Reset form state after exit animation (~220ms) completes
    // Component lives in layout.tsx so is never unmounted — setState is always safe
    setTimeout(() => { setState('idle'); setEmail('') }, 300)
  }

  return (
    <AnimatePresence>
      {isSignInOpen && (
        <>
          {/* Backdrop — key required for AnimatePresence exit tracking */}
          <motion.div
            key="signin-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal — positioned directly (no wrapper div) so exit animation plays */}
          <motion.div
            key="signin-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.22, ease: ease.out }}
            onClick={e => e.stopPropagation()}
            className={cn(
              'fixed z-[90]',
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[calc(100vw-32px)] max-w-[340px]',
              'glass border border-[var(--color-border-2)]',
              'rounded-2xl p-6',
              'shadow-[0_24px_80px_black/60%]',
            )}
          >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                    'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30',
                  )}>
                    <Zap size={14} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--color-text)] leading-tight">
                      Entrar no DarkTrend
                    </p>
                    <p className="text-[11px] text-[var(--color-faint)] mt-0.5">
                      Founders desbloqueiam tudo
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className={cn(
                    'w-6 h-6 flex items-center justify-center rounded-lg shrink-0',
                    'text-[var(--color-faint)] hover:text-[var(--color-text)]',
                    'hover:bg-[var(--color-surface-2)]',
                    'transition-colors duration-150'
                  )}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <Mail
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)] pointer-events-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setState('idle') }}
                    placeholder="seu@email.com"
                    autoFocus
                    className={cn(
                      'w-full h-10 pl-9 pr-3 rounded-xl',
                      'bg-[var(--color-surface-2)]',
                      'border border-[var(--color-border)]',
                      'text-[13px] text-[var(--color-text)]',
                      'placeholder:text-[var(--color-faint)]',
                      'outline-none',
                      'focus:border-[var(--color-accent)]/50',
                      'transition-colors duration-150',
                    )}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'h-10 rounded-xl text-[13px] font-semibold',
                    'transition-all duration-200',
                    state === 'founder'
                      ? 'bg-[var(--color-accent)] text-black brightness-110'
                      : 'bg-[var(--color-accent)] text-black hover:brightness-110',
                    'shadow-[0_0_16px_var(--color-accent)/20%]',
                  )}
                >
                  {state === 'founder' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Crown size={13} />
                      Founder Pro ativado!
                    </span>
                  ) : 'Continuar'}
                </motion.button>
              </form>

              {/* Waitlist result */}
              <AnimatePresence>
                {state === 'waitlist' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      'mt-3 px-3 py-2.5 rounded-xl',
                      'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                    )}
                  >
                    <p className="text-[12px] text-[var(--color-muted)] text-center leading-snug">
                      Você está na lista de espera ✓<br />
                      <span className="text-[var(--color-faint)]">Acesso Pro em breve.</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer hint */}
              {state === 'idle' && (
                <p className="mt-3 text-[11px] text-[var(--color-faint)] text-center">
                  Fundadores têm acesso completo imediatamente
                </p>
              )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
