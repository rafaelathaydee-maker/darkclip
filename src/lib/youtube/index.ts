/**
 * YouTube Shorts ingestion layer.
 *
 * Usage:
 *   import { fetchAllNiches, fetchNicheVideos } from '@/lib/youtube'
 *
 * Environment:
 *   YOUTUBE_API_KEY — YouTube Data API v3 key (server-side only)
 *
 * Quota (worst-case per full refresh):
 *   MAX_QUERIES_PER_NICHE (3) × 101 units × 10 niches = 3,030 units
 *   With 3h cache TTL: ~8 refreshes/day → ~24,240 units/day worst case.
 *   In practice most niches succeed on first query: ~8,080 units/day.
 *   YouTube free quota: 10,000 units/day.
 */

import type { VideoItem, NicheId } from '@/types'
import { NICHE_QUERIES, NICHE_IDS, MIN_VIDEOS_PER_NICHE, MAX_QUERIES_PER_NICHE } from './queries'
import { searchShorts, fetchVideoDetails, daysAgo } from './client'
import { normalizeVideo } from './normalize'
import { getCached, setCached } from './cache'
import { MOCK_VIDEOS } from '@/lib/mock-data'

const API_KEY = process.env.YOUTUBE_API_KEY ?? ''

// ─── Single-niche fetch ───────────────────────────────────────────────────────

/**
 * Fetch, normalize, and cache Shorts for one niche.
 *
 * Algorithm:
 *   1. Check in-memory cache first (3h TTL)
 *   2. Try queries in order until we have MIN_VIDEOS_PER_NICHE results
 *      - Queries 0–1: publishedAfter = last 90 days (fresh content preferred)
 *      - Queries 2+:  no date filter (cast wider net for sparse niches)
 *   3. Stop after MAX_QUERIES_PER_NICHE API calls (quota protection)
 *   4. Fall back to mock data for this niche if 0 real results
 */
export async function fetchNicheVideos(niche: NicheId): Promise<VideoItem[]> {
  // No API key → always return mock
  if (!API_KEY) {
    return MOCK_VIDEOS.filter(v => v.niche === niche)
  }

  const cacheKey = `niche:${niche}`
  const cached   = getCached(cacheKey)
  if (cached) return cached

  const queries = NICHE_QUERIES[niche]
  if (!queries || queries.length === 0) {
    return MOCK_VIDEOS.filter(v => v.niche === niche)
  }

  const seenIds       = new Set<string>()
  const allVideos: VideoItem[] = []
  const maxAttempts   = Math.min(queries.length, MAX_QUERIES_PER_NICHE)

  for (let i = 0; i < maxAttempts; i++) {
    if (allVideos.length >= MIN_VIDEOS_PER_NICHE) break

    const query        = queries[i]
    // First 2 queries: prefer recent content.
    // Fallback queries: no date restriction — cast the widest possible net.
    const publishedAfter = i < 2 ? daysAgo(90) : undefined

    try {
      const searchRes = await searchShorts(query, API_KEY, { publishedAfter, maxResults: 30 })

      if (searchRes.error) {
        console.warn(`[YT] search error niche=${niche} query[${i}]="${query}":`, searchRes.error)
        // Quota error — stop trying more queries for this niche
        if (searchRes.error.code === 403) break
        continue
      }

      const items = (searchRes.items ?? [])
        .filter(item => !seenIds.has(item.id.videoId))

      if (items.length === 0) continue

      // Batch stats + details in one call (1 quota unit)
      const videoIds  = items.map(item => item.id.videoId)
      const detailRes = await fetchVideoDetails(videoIds, API_KEY)

      if (detailRes.error) {
        console.warn(`[YT] videos error niche=${niche}:`, detailRes.error)
        // Continue with what we have — normalize without stats
      }

      const detailMap = new Map(
        (detailRes.items ?? []).map(v => [v.id, v])
      )

      const newVideos = items
        .map(item => normalizeVideo(item, detailMap.get(item.id.videoId), niche))
        // Keep only actual Shorts (≤ 90s) — videos.list duration is authoritative
        .filter(v => v.duration > 0 && v.duration <= 90)

      newVideos.forEach(v => seenIds.add(v.youtubeId ?? ''))
      allVideos.push(...newVideos)

      console.info(
        `[YT] niche=${niche} query[${i}] "${query}" → ${newVideos.length} videos (total: ${allVideos.length})`
      )
    } catch (err) {
      console.error(`[YT] Unexpected error niche=${niche} query[${i}]:`, err)
    }
  }

  if (allVideos.length === 0) {
    console.info(`[YT] Zero results for niche=${niche} — falling back to mock`)
    return MOCK_VIDEOS.filter(v => v.niche === niche)
  }

  const final = allVideos.slice(0, 15)
  setCached(cacheKey, final)
  return final
}

// ─── All-niches fetch ─────────────────────────────────────────────────────────

/**
 * Fetch all niches in parallel and merge.
 * "all" niche = union of every other niche.
 * Deduplication by video ID — same video shouldn't appear under two niches.
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

  // Deduplicate by id
  const deduped = Array.from(
    new Map(all.map(v => [v.id, v])).values()
  )

  if (deduped.length === 0) return MOCK_VIDEOS

  setCached(cacheKey, deduped)
  return deduped
}

// ─── Cache status (for debug panel) ──────────────────────────────────────────
export { ttlMs as cacheTtlMs } from './cache'
