'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export type ConversionSource =
  | 'navbar_get_access'
  | 'navbar_sign_in'
  | 'locked_card'
  | 'locked_section'
  | 'drawer_download'
  | 'drawer_similar'
  | 'drawer_source'
  | 'pricing_free'
  | 'pricing_pro'
  | 'bottom_cta'
  | 'early_access_modal'

interface ConversionContextValue {
  openModal:  (source?: ConversionSource) => void
  closeModal: () => void
  isOpen:     boolean
  source:     ConversionSource | null
}

const ConversionContext = createContext<ConversionContextValue | null>(null)

export function ConversionProvider({ children }: { children: React.ReactNode }) {
  const [isOpen,  setIsOpen]  = useState(false)
  const [source,  setSource]  = useState<ConversionSource | null>(null)

  const openModal  = useCallback((src?: ConversionSource) => {
    setSource(src ?? null)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <ConversionContext.Provider value={{ openModal, closeModal, isOpen, source }}>
      {children}
    </ConversionContext.Provider>
  )
}

export function useConversion() {
  const ctx = useContext(ConversionContext)
  if (!ctx) throw new Error('useConversion must be inside ConversionProvider')
  return ctx
}
