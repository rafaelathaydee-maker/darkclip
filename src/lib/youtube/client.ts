import type { YouTubeSearchResponse, YouTubeVideosResponse } from './types'

const BASE = 'https://www.googleapis.com/youtube/v3'

/**
 * Search YouTube for Shorts matching `query`.
 * Uses `videoDuration=short` which filters to videos under ~4 min.
 * We additionally filter to ≤90s during normalization.
 */
export async function searchShorts(
  query:      string,
  apiKey:     string,
  maxResults  = 20,
): Promise<YouTubeSearchResponse> {
  const params = new URLSearchParams({
    part:          'snippet',
    type:          'video',
    videoDuration: 'short',
    order:         'viewCount',
    q:             query,
    maxResults:    String(maxResults),
    key:           apiKey,
  })

  const res = await fetch(`${BASE}/search?${params}`)
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

  const res = await fetch(`${BASE}/videos?${params}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: err?.error ?? { code: res.status, message: res.statusText } }
  }
  return res.json() as Promise<YouTubeVideosResponse>
}
