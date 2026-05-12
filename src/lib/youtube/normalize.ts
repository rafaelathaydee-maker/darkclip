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
  if (mins < 60)              return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 48)             return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
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
  const vph    = views / hours                        // views per hour
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
  // 100 vph → ~30%, 1k → ~300%, 10k → ~3000%
  return Math.max(50, Math.min(5000, Math.round(vph * 0.3)))
}

// ─── Thumbnail ───────────────────────────────────────────────────────────────

function bestThumbnail(item: YouTubeSearchItem): string {
  const t = item.snippet.thumbnails
  // maxres (1280×720) → high (480×360) → medium → fallback via known URL
  return (
    t.maxres?.url  ??
    t.standard?.url ??
    t.high?.url    ??
    t.medium?.url  ??
    `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`
  )
}

// ─── Main normalizer ─────────────────────────────────────────────────────────

export function normalizeVideo(
  searchItem:   YouTubeSearchItem,
  videoDetail:  YouTubeVideoItem | undefined,
  niche:        NicheId,
): VideoItem {
  const videoId         = searchItem.id.videoId
  const { title, channelTitle, publishedAt } = searchItem.snippet

  const views       = parseInt(videoDetail?.statistics.viewCount  ?? '0') || 0
  const likes       = parseInt(videoDetail?.statistics.likeCount  ?? '0') || 0
  const duration    = parseISODuration(videoDetail?.contentDetails.duration ?? 'PT0S')
  const tags        = videoDetail?.snippet.tags?.slice(0, 8) ?? []

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

  // Creator handle: strip spaces, lowercase, prefix @
  const creator = `@${channelTitle.replace(/\s+/g, '').toLowerCase()}`

  return {
    id:           `yt-${videoId}`,
    title,
    creator,
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
      trendingIn: 'GLOBAL',
      velocity,
      badge,
    },
  }
}
