'use client'

/**
 * Founder Debug Panel — visible only when Founder Pro is active.
 * Fixed bottom-left corner. Works on both local and production.
 * Use the "Clear localStorage" button to sign out.
 */

import { useState } from 'react'
import { Crown, ChevronDown, ChevronUp, Trash2, TestTube, Download, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFounder } from '@/lib/founder'
import { useToast } from '@/lib/toast'
import { MOCK_VIDEOS } from '@/lib/mock-data'

const TOTAL_CLIPS   = MOCK_VIDEOS.length
const DEMO_AVAILABLE = 5

export function FounderPanel() {
  const { isPro, email, signOut } = useFounder()
  const [open, setOpen] = useState(false)
  const toast = useToast()

  // Only visible when Pro
  if (!isPro) return null

  const handleClearStorage = () => {
    signOut()
    toast('localStorage cleared — Founder Pro desativado', 'info')
  }

  const handleTestWaitlist = async () => {
    try {
      const testEmail = `test+${Date.now()}@darktrend.test`
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          source: 'founder_debug_panel',
          niche: 'cars',
        }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (res.ok) {
        toast(`Lead de teste enviado ✓ (${testEmail.slice(0, 24)}…)`, 'success')
      } else {
        toast(`Erro: ${data.error ?? `HTTP ${res.status}`}`, 'info')
      }
    } catch {
      toast('Erro de rede ao testar waitlist', 'info')
    }
  }

  return (
    <div className={cn(
      'fixed bottom-5 left-5 z-[200]',
      'font-mono text-[11px]',
    )}>
      <div className={cn(
        'glass border border-[var(--color-accent)]/35',
        'rounded-xl overflow-hidden',
        'shadow-[0_8px_32px_black/50%,0_0_0_1px_var(--color-accent)/5%]',
        'min-w-[220px]',
      )}>

        {/* Toggle header */}
        <button
          onClick={() => setOpen(p => !p)}
          className={cn(
            'w-full flex items-center justify-between gap-3',
            'px-3 py-2.5',
            'bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/15',
            'transition-colors duration-150',
          )}
        >
          <div className="flex items-center gap-1.5">
            <Crown size={11} className="text-[var(--color-accent)]" />
            <span className="text-[var(--color-accent)] font-bold uppercase tracking-[0.12em] text-[10px]">
              Founder Debug
            </span>
          </div>
          {open
            ? <ChevronUp   size={11} className="text-[var(--color-faint)]" />
            : <ChevronDown size={11} className="text-[var(--color-faint)]" />
          }
        </button>

        {/* Panel body */}
        {open && (
          <div className="px-3 py-3 flex flex-col gap-2 border-t border-[var(--color-border)]">

            {/* Mode indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-faint)]">Mode</span>
              <span className={cn(
                'flex items-center gap-1',
                'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                'bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
                'border border-[var(--color-accent)]/25',
              )}>
                <Crown size={8} />
                Founder Pro
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[var(--color-faint)]">Email</span>
              <span className="text-[var(--color-muted)] truncate max-w-[130px]">
                {email}
              </span>
            </div>

            {/* Unlocked clips */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-faint)]">Clips desbloqueados</span>
              <span className="flex items-center gap-1 text-[var(--color-text)] font-bold">
                <Zap size={9} className="text-[var(--color-accent)]" />
                {TOTAL_CLIPS}
              </span>
            </div>

            {/* Demo clips */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-faint)]">Demo clips</span>
              <span className="flex items-center gap-1 text-[var(--color-accent)]">
                <Download size={9} />
                {DEMO_AVAILABLE} disponíveis
              </span>
            </div>

            <div className="h-px bg-[var(--color-border)] my-0.5" />

            {/* Test waitlist */}
            <button
              onClick={handleTestWaitlist}
              className={cn(
                'flex items-center gap-1.5',
                'h-7 px-2.5 rounded-lg w-full',
                'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                'text-[var(--color-muted)] hover:text-[var(--color-text)]',
                'hover:border-[var(--color-border-2)]',
                'transition-colors duration-150 active:scale-[0.97]',
              )}
            >
              <TestTube size={10} />
              Testar submit de lead
            </button>

            {/* Clear localStorage / sign out */}
            <button
              onClick={handleClearStorage}
              className={cn(
                'flex items-center gap-1.5',
                'h-7 px-2.5 rounded-lg w-full',
                'bg-[var(--color-error)]/8 border border-[var(--color-error)]/20',
                'text-[var(--color-error)]/70 hover:text-[var(--color-error)]',
                'hover:border-[var(--color-error)]/35',
                'transition-colors duration-150 active:scale-[0.97]',
              )}
            >
              <Trash2 size={10} />
              Limpar localStorage (sign out)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
