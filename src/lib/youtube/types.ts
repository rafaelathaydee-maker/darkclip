/** YouTube Data API v3 — Search.list response */
export interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title:        string
    channelTitle: string
    publishedAt:  string
    thumbnails: {
      default?: { url: string; width: number; height: number }
      medium?:  { url: string; width: number; height: number }
      high?:    { url: string; width: number; height: number }
      standard?:{ url: string; width: number; height: number }
      maxres?:  { url: string; width: number; height: number }
    }
  }
}

export interface YouTubeSearchResponse {
  items?:     YouTubeSearchItem[]
  error?:     YouTubeError
  nextPageToken?: string
}

/** YouTube Data API v3 — Videos.list response */
export interface YouTubeVideoItem {
  id:      string
  snippet: {
    tags?:         string[]
    channelTitle?: string
    publishedAt?:  string
  }
  statistics: {
    viewCount?:    string
    likeCount?:    string
    commentCount?: string
  }
  contentDetails: {
    duration: string  // ISO 8601 e.g. "PT58S" | "PT1M30S"
  }
}

export interface YouTubeVideosResponse {
  items?: YouTubeVideoItem[]
  error?: YouTubeError
}

export interface YouTubeError {
  code:    number
  message: string
  status?: string
}
