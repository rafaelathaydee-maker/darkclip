import type { VideoItem, NicheId, VideoFormat } from '@/types'
import type { YouTubeSearchItem, YouTubeVideoItem } from './types'

// ─── Duration ────────────────────────────────────────────────────────────────

/** Parse ISO 8601 duration → seconds.  "PT1M30S" → 90 */
export function parseISODuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] ?? '0') * 3600)
       + (parseInt(m[2] ?? '0') * 60)
       + (parseInt(m[3] ?? '0'))
}

// ─── Relative time ───────────────────────────────────────────────────────────

/** Format ISO timestamp as "4m ago", "3h ago", "2d ago" */
export function formatAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(ms / 60_000)
  if (mins < 1)                return 'just now'
  if (mins < 60)               return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 48)              return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30)               return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Viral score (50–99) derived from view velocity.
 * Log scale so it handles the huge range from 1k to 100M views.
 *   ~1k  views/hour → ~50
 *   ~10k views/hour → ~74
 *   ~100k views/hr  → ~99
 */
function computeViralScore(views: number, publishedAt: string): number {
  const hours  = Math.max(0.5, (Date.now() - new Date(publishedAt).getTime()) / 3_600_000)
  const vph    = views / hours
  const score  = Math.round(Math.log10(vph + 1) * 24.75)
  return Math.min(99, Math.max(50, score))
}

/**
 * Estimated growth % (50–5000) from view velocity.
 * Not scientifically accurate — just a plausible-looking number for the UI.
 */
function estimateGrowthPct(views: number, publishedAt: string): number {
  const hours  = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 3_600_000)
  const vph    = views / hours
  return Math.max(50, Math.min(5000, Math.round(vph * 0.3)))
}

// ─── Region ──────────────────────────────────────────────────────────────────

/**
 * Niche → plausible region pool.
 * Uses the videoId's first char as a deterministic seed → same video always
 * maps to the same region (no flicker on re-render).
 */
const NICHE_REGIONS: Partial<Record<NicheId, string[]>> = {
  asmr:       ['KR', 'JP', 'USA', 'GLOBAL'],
  cars:       ['UAE', 'DE', 'USA', 'UK'],
  luxury:     ['UAE', 'USA', 'FR', 'GLOBAL'],
  motivation: ['USA', 'UK', 'GLOBAL', 'BR'],
  gym:        ['USA', 'UK', 'BR', 'GLOBAL'],
  anime:      ['JP', 'KR', 'GLOBAL', 'USA'],
  football:   ['BR', 'UK', 'EU', 'GLOBAL'],
  ai:         ['USA', 'GLOBAL', 'UK'],
  cinematic:  ['USA', 'JP', 'GLOBAL', 'UAE'],
  lifestyle:  ['USA', 'UK', 'GLOBAL', 'CA'],
}

function regionForVideo(niche: NicheId, videoId: string): string {
  const pool = NICHE_REGIONS[niche] ?? ['GLOBAL']
  const seed = (videoId.charCodeAt(0) ?? 0) + (videoId.charCodeAt(2) ?? 0)
  return pool[seed % pool.length]
}

// ─── Thumbnail ───────────────────────────────────────────────────────────────

/**
 * Best available thumbnail URL for a YouTube video.
 *
 * We ALWAYS start with `maxresdefault.jpg` (1280×720) constructed directly from
 * the video ID — search.list rarely returns maxres in the snippet, but the CDN
 * URL is valid whenever the creator set a custom thumbnail.
 *
 * For Shorts, `hqdefault.jpg` (the API's "high" thumbnail) is a landscape
 * 480×360 frame that often shows pillarbox black bars or a dark auto-generated
 * frame. `maxresdefault.jpg` and `sddefault.jpg` tend to have better frames.
 *
 * The VideoCard component has an `onError` fallback chain that automatically
 * tries `sddefault.jpg` → `hqdefault.jpg` → `mqdefault.jpg` if this 404s.
 */
function bestThumbnail(item: YouTubeSearchItem): string {
  const id = item.id.videoId
  // Start with maxresdefault — best quality, custom thumbnails always here.
  // The onError chain in VideoCard handles 404s gracefully.
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
}

// ─── Creator handle ──────────────────────────────────────────────────────────

/**
 * Format a channel name into a clean @handle.
 * YouTube doesn't expose the handle in search snippets, so we derive a
 * plausible one from the channel title.
 */
function formatCreator(channelTitle: string): string {
  // Remove common suffixes, collapse spaces, lowercase
  const clean = channelTitle
    .replace(/\s+(official|channel|shorts|videos|clips|edits|tv|media)$/i, '')
    .trim()

  // If title already looks like a handle (no spaces, <20 chars), keep it
  if (!clean.includes(' ') && clean.length <= 20) {
    return `@${clean.toLowerCase()}`
  }

  // CamelCase multi-word titles
  const camel = clean
    .split(/\s+/)
    .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')

  return `@${camel}`
}

// ─── Main normalizer ─────────────────────────────────────────────────────────

export function normalizeVideo(
  searchItem:   YouTubeSearchItem,
  videoDetail:  YouTubeVideoItem | undefined,
  niche:        NicheId,
): VideoItem {
  const videoId = searchItem.id.videoId
  const { title, channelTitle, publishedAt } = searchItem.snippet

  const views    = parseInt(videoDetail?.statistics.viewCount  ?? '0') || 0
  const likes    = parseInt(videoDetail?.statistics.likeCount  ?? '0') || 0
  const duration = parseISODuration(videoDetail?.contentDetails.duration ?? 'PT0S')
  const tags     = videoDetail?.snippet.tags?.slice(0, 8) ?? []

  const viralScore    = computeViralScore(views, publishedAt)
  const growthPercent = estimateGrowthPct(views, publishedAt)
  const savedCount    = Math.max(10, Math.floor(likes * 0.15))

  const hoursOld    = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000
  const isExploding = viralScore >= 88 && hoursOld <= 72

  // Velocity badge — only for fresh videos with strong growth
  const velocity = hoursOld < 48 && growthPercent >= 300
    ? `+${growthPercent.toLocaleString()}% in ${Math.round(hoursOld)}h`
    : undefined

  // Meta badge — pick the most notable characteristic
  let badge: string | undefined
  if (views < 1_500_000 && viralScore >= 82)       badge = 'LOW COMP'
  else if (views >= 8_000_000)                      badge = 'TOP PAGES'
  else if (likes / Math.max(views, 1) > 0.04)       badge = 'HIGH REPLAY'

  const format: VideoFormat =
    duration <= 60  ? 'short' :
    duration <= 180 ? 'clip'  : 'reel'

  return {
    id:           `yt-${videoId}`,
    youtubeId:    videoId,
    title:        title.replace(/\s*#shorts\s*/gi, '').trim() || title,
    creator:      formatCreator(channelTitle),
    thumbnail:    bestThumbnail(searchItem),
    viralScore,
    growthPercent,
    views,
    niche,
    tags,
    isExploding,
    format,
    duration,
    savedCount,
    meta: {
      postedAgo:  formatAgo(publishedAt),
      trendingIn: regionForVideo(niche, videoId),
      velocity,
      badge,
    },
  }
}
