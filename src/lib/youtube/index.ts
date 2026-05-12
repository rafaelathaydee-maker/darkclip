/**
 * YouTube Shorts ingestion layer.
 *
 * Usage:
 *   import { fetchAllNiches, fetchNicheVideos } from '@/lib/youtube'
 *
 * Environment:
 *   YOUTUBE_API_KEY — YouTube Data API v3 key (server-side only, no NEXT_PUBLIC_ prefix)
 *
 * Quota:
 *   search.list  = 100 units/call
 *   videos.list  =   1 unit/call
 *   Per niche: ~101 units. 10 niches = ~1,010 units per cache miss.
 *   Cache TTL: 3 hours → at most 8 full refreshes/day = ~8,080 units/day.
 *   YouTube free quota: 10,000 units/day.
 */

import type { VideoItem, NicheId } from '@/types'
import { NICHE_QUERIES, NICHE_IDS } from './queries'
import { searchShorts, fetchVideoDetails } from './client'
import { normalizeVideo } from './normalize'
import { getCached, setCached } from './cache'
import { MOCK_VIDEOS } from '@/lib/mock-data'

const API_KEY = process.env.YOUTUBE_API_KEY ?? ''

// ─── Single-niche fetch ───────────────────────────────────────────────────────

/**
 * Fetch, normalize, and cache Shorts for one niche.
 * Falls back to mock videos for that niche if the API is unavailable.
 */
export async function fetchNicheVideos(niche: NicheId): Promise<VideoItem[]> {
  // No API key → always return mock
  if (!API_KEY) {
    return MOCK_VIDEOS.filter(v => v.niche === niche)
  }

  const cacheKey = `niche:${niche}`
  const cached   = getCached(cacheKey)
  if (cached) return cached

  const query = NICHE_QUERIES[niche]
  if (!query) return []

  try {
    // ── Step 1: Search API ────────────────────────────────────────────────
    const searchRes = await searchShorts(query, API_KEY, 20)

    if (searchRes.error) {
      console.warn(`[YT] search error niche=${niche}:`, searchRes.error)
      return MOCK_VIDEOS.filter(v => v.niche === niche)
    }

    const items = searchRes.items ?? []
    if (items.length === 0) {
      return MOCK_VIDEOS.filter(v => v.niche === niche)
    }

    // ── Step 2: Videos.list for stats + duration + tags (1 batched call) ─
    const videoIds  = items.map(i => i.id.videoId)
    const detailRes = await fetchVideoDetails(videoIds, API_KEY)

    if (detailRes.error) {
      console.warn(`[YT] videos error niche=${niche}:`, detailRes.error)
      // Proceed without stats — normalize with defaults
    }

    const detailMap = new Map(
      (detailRes.items ?? []).map(v => [v.id, v])
    )

    // ── Step 3: Normalize + filter to actual Shorts (≤ 90s) ──────────────
    const videos = items
      .map(item => normalizeVideo(item, detailMap.get(item.id.videoId), niche))
      .filter(v => v.duration > 0 && v.duration <= 90)
      .slice(0, 15)

    if (videos.length === 0) {
      return MOCK_VIDEOS.filter(v => v.niche === niche)
    }

    setCached(cacheKey, videos)
    return videos

  } catch (err) {
    console.error(`[YT] Unexpected error niche=${niche}:`, err)
    return MOCK_VIDEOS.filter(v => v.niche === niche)
  }
}

// ─── All-niches fetch ─────────────────────────────────────────────────────────

/**
 * Fetch all niches in parallel and merge.
 * "all" niche = union of every other niche.
 * Deduplication by video ID — shouldn't happen but just in case.
 */
export async function fetchAllNiches(): Promise<VideoItem[]> {
  const cacheKey = 'all'
  const cached   = getCached(cacheKey)
  if (cached) return cached

  if (!API_KEY) return MOCK_VIDEOS

  const results = await Promise.allSettled(
    NICHE_IDS.map(id => fetchNicheVideos(id))
  )

  const all: VideoItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }

  // Deduplicate (same video shouldn't appear under two niches, but be safe)
  const deduped = Array.from(
    new Map(all.map(v => [v.id, v])).values()
  )

  if (deduped.length === 0) return MOCK_VIDEOS

  setCached(cacheKey, deduped)
  return deduped
}

// ─── Cache status (for debug panel) ──────────────────────────────────────────
export { ttlMs as cacheTtlMs } from './cache'
