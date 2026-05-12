'use client'

import { useCallback } from 'react'

type TrackableEvent =
  | 'get_access_click'
  | 'locked_card_click'
  | 'pricing_pro_click'
  | 'bottom_cta_click'
  | 'modal_submit_success'

export function useAnalytics() {
  const track = useCallback((event: TrackableEvent, source?: string) => {
    // Fire-and-forget — never blocks the UI
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, source }),
    }).catch(() => {
      // Silently swallow — analytics must never break the product
    })
  }, [])

  return { track }
}
