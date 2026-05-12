'use client'

/**
 * Founder Pro mode — client-only, localStorage-backed.
 *
 * Activation: sign in with the founder email → isPro = true.
 * All other emails → free/waitlist mode (no error, no special treatment).
 *
 * Storage key: `dt_founder` → stores the email string.
 * Clear with signOut() or the debug panel's "Clear localStorage" button.
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

export const FOUNDER_EMAIL = 'rafael.athaydee@gmail.com'
const STORAGE_KEY = 'dt_founder'

interface FounderContextValue {
  isPro:        boolean
  /** True once the localStorage read has completed — gates hydration-sensitive UI */
  hydrated:     boolean
  email:        string | null
  signIn:       (email: string) => 'founder' | 'waitlist'
  signOut:      () => void
  isSignInOpen: boolean
  openSignIn:   () => void
  closeSignIn:  () => void
}

const FounderContext = createContext<FounderContextValue | null>(null)

export function FounderProvider({ children }: { children: React.ReactNode }) {
  const [email,        setEmail]        = useState<string | null>(null)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [hydrated,     setHydrated]     = useState(false)

  // Read localStorage once on mount — avoids SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setEmail(stored)
    } catch {}
    setHydrated(true)
  }, [])

  // isPro is only true after hydration to prevent SSR flash
  const isPro = hydrated && email?.toLowerCase() === FOUNDER_EMAIL.toLowerCase()

  const signIn = useCallback((inputEmail: string): 'founder' | 'waitlist' => {
    const cleaned = inputEmail.trim().toLowerCase()
    if (cleaned === FOUNDER_EMAIL.toLowerCase()) {
      setEmail(cleaned)
      try { localStorage.setItem(STORAGE_KEY, cleaned) } catch {}
      return 'founder'
    }
    return 'waitlist'
  }, [])

  const signOut = useCallback(() => {
    setEmail(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const openSignIn  = useCallback(() => setIsSignInOpen(true), [])
  const closeSignIn = useCallback(() => setIsSignInOpen(false), [])

  return (
    <FounderContext.Provider value={{
      isPro, hydrated, email, signIn, signOut,
      isSignInOpen, openSignIn, closeSignIn,
    }}>
      {children}
    </FounderContext.Provider>
  )
}

export function useFounder() {
  const ctx = useContext(FounderContext)
  if (!ctx) throw new Error('useFounder must be inside FounderProvider')
  return ctx
}
