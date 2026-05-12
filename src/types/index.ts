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

export interface Niche {
  id: NicheId
  label: string
}

export interface FeedSectionConfig {
  id: string
  title: string
  filter: (videos: VideoItem[]) => VideoItem[]
}
