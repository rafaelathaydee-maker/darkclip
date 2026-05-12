import type { YouTubeSearchResponse, YouTubeVideosResponse } from './types'

const BASE = 'https://www.googleapis.com/youtube/v3'

export interface SearchOptions {
  /**
   * ISO timestamp — only return videos published after this date.
   * Pass `undefined` for no date restriction (wider net for fallback queries).
   */
  publishedAfter?: string
  maxResults?: number
}

/**
 * Search YouTube for Shorts matching `query`.
 *
 * Filters applied:
 *   - videoDuration=short       → clips ≤ ~4 minutes (API-level)
 *   - videoEmbeddable=true      → only embeddable videos
 *   - order=viewCount           → most-viewed Shorts surface first
 *   - relevanceLanguage=en      → English-language results
 *   - publishedAfter            → optional; omit for broader fallback searches
 *
 * We additionally filter to ≤ 90s during normalization.
 */
export async function searchShorts(
  query:   string,
  apiKey:  string,
  options: SearchOptions = {},
): Promise<YouTubeSearchResponse> {
  const { publishedAfter, maxResults = 25 } = options

  const params = new URLSearchParams({
    part:             'snippet',
    type:             'video',
    videoDuration:    'short',
    videoEmbeddable:  'true',
    order:            'viewCount',
    q:                query,
    relevanceLanguage:'en',
    maxResults:       String(maxResults),
    key:              apiKey,
  })

  // Only add publishedAfter when explicitly provided
  if (publishedAfter) params.set('publishedAfter', publishedAfter)

  const res = await fetch(`${BASE}/search?${params}`, { cache: 'no-store' })

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

/** ISO timestamp for N days ago — used to constrain search to recent content */
export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1_000).toISOString()
}
