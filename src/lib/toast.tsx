'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'

type ToastType = 'locked' | 'success' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  cta?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, cta?: Toast['cta']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((
    message: string,
    type: ToastType = 'info',
    cta?: Toast['cta']
  ) => {
    const id = `toast-${++counterRef.current}`
    setToasts(prev => [...prev.slice(-2), { id, message, type, cta }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.22, ease: ease.out }}
              className={cn(
                'pointer-events-auto',
                'flex items-start gap-3',
                'min-w-[280px] max-w-[340px]',
                'px-4 py-3 rounded-xl',
                'border shadow-xl',
                'glass',
                t.type === 'locked' && 'border-[var(--color-accent)]/30',
                t.type === 'success' && 'border-[var(--color-accent)]/30',
                t.type === 'info' && 'border-[var(--color-border-2)]',
              )}
            >
              {/* Icon */}
              <span className="mt-0.5 shrink-0">
                {t.type === 'locked' && <Lock size={14} className="text-[var(--color-accent)]" />}
                {t.type === 'success' && <CheckCircle2 size={14} className="text-[var(--color-accent)]" />}
                {t.type === 'info' && <Info size={14} className="text-[var(--color-muted)]" />}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[var(--color-text)] leading-snug">{t.message}</p>
                {t.cta && (
                  <button
                    onClick={t.cta.onClick}
                    className="mt-1.5 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {t.cta.label} →
                  </button>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={() => dismiss(t.id)}
                className="mt-0.5 shrink-0 text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx.toast
}
