import type { VideoItem } from '@/types'

/**
 * Module-level in-memory cache.
 *
 * Persists across requests within the same server process (Node.js warm instance).
 * Resets on cold start — acceptable for a personal/MVP deployment.
 * TTL: 3 hours.
 */

const CACHE_TTL_MS = 3 * 60 * 60 * 1_000 // 3 hours

interface CacheEntry {
  data:    VideoItem[]
  expires: number
}

const store = new Map<string, CacheEntry>()

export function getCached(key: string): VideoItem[] | null {
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expires) {
    store.delete(key)
    return null
  }
  return entry.data
}

export function setCached(key: string, data: VideoItem[]): void {
  store.set(key, { data, expires: Date.now() + CACHE_TTL_MS })
}

/** Force-expire a key (useful for manual refresh in dev) */
export function invalidate(key: string): void {
  store.delete(key)
}

/** Milliseconds until this cache entry expires, or 0 if expired/absent */
export function ttlMs(key: string): number {
  const entry = store.get(key)
  if (!entry) return 0
  return Math.max(0, entry.expires - Date.now())
}
