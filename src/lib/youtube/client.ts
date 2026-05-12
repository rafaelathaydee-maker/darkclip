import type { YouTubeSearchResponse, YouTubeVideosResponse } from './types'

const BASE = 'https://www.googleapis.com/youtube/v3'

/**
 * ISO timestamp for N days ago — used to constrain search to recent content.
 */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1_000).toISOString()
}

/**
 * Search YouTube for Shorts matching `query`.
 *
 * Filters applied:
 *   - videoDuration=short       → clips ≤ ~4 minutes (API-level)
 *   - videoEmbeddable=true      → only embeddable videos
 *   - publishedAfter            → last 90 days (keeps feed fresh)
 *   - order=viewCount           → most-viewed recent Shorts surface first
 *   - relevanceLanguage=en      → English-language results by default
 *
 * We additionally filter to ≤ 90s during normalization.
 */
export async function searchShorts(
  query:      string,
  apiKey:     string,
  maxResults  = 25,
): Promise<YouTubeSearchResponse> {
  const params = new URLSearchParams({
    part:             'snippet',
    type:             'video',
    videoDuration:    'short',
    videoEmbeddable:  'true',
    order:            'viewCount',
    q:                query,
    publishedAfter:   daysAgo(90),
    relevanceLanguage:'en',
    maxResults:       String(maxResults),
    key:              apiKey,
  })

  const res = await fetch(`${BASE}/search?${params}`, {
    // Let Next.js handle edge caching — we do our own in-memory TTL
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: err?.error ?? { code: res.status, message: res.statusText } }
  }
  return res.json() as Promise<YouTubeSearchResponse>
}

/**
 * Fetch statistics + content details + tags for a batch of video IDs.
 * Single API call regardless of how many IDs are passed (up to 50).
 * Cost: 1 quota unit.
 */
export async function fetchVideoDetails(
  videoIds: string[],
  apiKey:   string,
): Promise<YouTubeVideosResponse> {
  if (videoIds.length === 0) return { items: [] }

  const params = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id:   videoIds.slice(0, 50).join(','),
    key:  apiKey,
  })

  const res = await fetch(`${BASE}/videos?${params}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: err?.error ?? { code: res.status, message: res.statusText } }
  }
  return res.json() as Promise<YouTubeVideosResponse>
}
