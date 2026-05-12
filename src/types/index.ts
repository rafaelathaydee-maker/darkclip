export type NicheId =
  | 'all'
  | 'asmr'
  | 'cars'
  | 'luxury'
  | 'motivation'
  | 'gym'
  | 'anime'
  | 'football'
  | 'ai'
  | 'cinematic'
  | 'lifestyle'

export type VideoFormat = 'short' | 'clip' | 'reel'

export interface VideoMeta {
  postedAgo:   string           // "17m ago" | "2h ago" | "just now"
  trendingIn:  string           // "USA" | "GLOBAL" | "BR"
  velocity?:   string           // "+340% in 2h"
  badge?:      string           // "high replay" | "low comp" | "used by top pages"
}

export interface VideoItem {
  id: string
  youtubeId?: string      // raw YouTube video ID — undefined for mock/demo items
  title: string
  creator: string
  thumbnail: string
  viralScore: number      // 0–100
  growthPercent: number   // e.g. 847 = +847%
  views: number
  niche: NicheId
  tags: string[]
  isExploding: boolean
  format: VideoFormat
  duration: number        // seconds
  savedCount: number
  meta: VideoMeta
}

/** Return the raw YouTube video ID for any VideoItem. Empty string for mock items. */
export function getYouTubeId(video: VideoItem): string {
  if (video.youtubeId) return video.youtubeId
  if (video.id.startsWith('yt-')) return video.id.slice(3)
  return ''
}

export interface Niche {
  id: NicheId
  label: string
}

export interface FeedSectionConfig {
  id: string
  title: string
  filter: (videos: VideoItem[]) => VideoItem[]
}
