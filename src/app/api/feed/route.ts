import { type NextRequest, NextResponse } from 'next/server'
import { fetchAllNiches, fetchNicheVideos } from '@/lib/youtube'
import { MOCK_VIDEOS } from '@/lib/mock-data'
import type { NicheId } from '@/types'

// Always dynamic — reads process.env and uses in-memory cache
export const dynamic = 'force-dynamic'

/**
 * GET /api/feed
 * GET /api/feed?niche=cars
 *
 * Returns normalized VideoItem[] from YouTube Shorts (or mock fallback).
 * Cached in-memory for 3 hours per niche.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const niche = searchParams.get('niche') as NicheId | null

  try {
    let videos =
      niche && niche !== 'all'
        ? await fetchNicheVideos(niche)
        : await fetchAllNiches()

    return NextResponse.json(videos, {
      headers: {
        // Tell the browser/CDN to treat this as fresh for 5 minutes,
        // but allow stale-while-revalidate for up to 3 hours.
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=10800',
      },
    })
  } catch (err) {
    console.error('[/api/feed] Error:', err)
    const fallback = niche && niche !== 'all'
      ? MOCK_VIDEOS.filter(v => v.niche === niche)
      : MOCK_VIDEOS
    return NextResponse.json(fallback)
  }
}
