'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { StatsBar } from '@/components/layout/StatsBar'
import { Hero } from '@/components/layout/Hero'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { GradientOrb } from '@/components/effects/GradientOrb'
import { NicheTabBar } from '@/components/niche/NicheTabBar'
import { FeedSection } from '@/components/feed/FeedSection'
import { LockedSection } from '@/components/feed/LockedSection'
import { VideoDetailDrawer } from '@/components/video/VideoDetailDrawer'
import { PricingSection } from '@/components/conversion/PricingSection'
import { BottomCTA } from '@/components/conversion/BottomCTA'
import { MOCK_VIDEOS, FEED_SECTIONS } from '@/lib/mock-data'
import type { NicheId, VideoItem } from '@/types'

export default function Home() {
  const [activeNiche, setActiveNiche] = useState<NicheId>('all')
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  // Start with mock data — feed is never blank on initial render.
  // Real YouTube data silently replaces it once the API responds.
  const [videos, setVideos]   = useState<VideoItem[]>(MOCK_VIDEOS)
  const [isLive, setIsLive]   = useState(false)   // true once real data is loaded

  useEffect(() => {
    fetch('/api/feed')
      .then(r => {
        if (!r.ok) throw new Error(`feed ${r.status}`)
        return r.json() as Promise<VideoItem[]>
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data)
          setIsLive(true)
        }
      })
      .catch(() => {
        // Silently keep mock data — API key not set or quota exhausted
      })
  }, [])

  const filteredVideos = activeNiche === 'all'
    ? videos
    : videos.filter(v => v.niche === activeNiche)

  return (
    <PageWrapper>
      <GradientOrb />

      {/* Fixed navbar */}
      <Navbar />

      {/* All scrollable content — pushed below fixed navbar */}
      <div className="pt-14">
        {/* Live stats ticker */}
        <StatsBar />

        {/* Cinematic hero */}
        <Hero />

        {/* Niche filter — sticks below navbar after hero scrolls away */}
        <NicheTabBar active={activeNiche} onChange={setActiveNiche} />

        <main className="relative z-10 max-w-[1400px] mx-auto pt-8 pb-20">

          {/* Live indicator — only visible once real YouTube data is loaded */}
          {isLive && (
            <div className="flex items-center gap-2 px-5 mb-6">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  style={{ background: 'var(--color-accent)', animationDuration: '1.4s' }} />
                <span className="relative inline-flex rounded-full h-[6px] w-[6px]"
                  style={{ background: 'var(--color-accent)' }} />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-accent)]">
                Live data
              </span>
              <span className="text-[10px] font-mono text-[var(--color-faint)]">
                · {videos.filter(v => v.youtubeId).length} real clips
              </span>
            </div>
          )}

          {/* Skeleton loading strip — visible while initial fetch is in progress */}
          {!isLive && (
            <div className="flex items-center gap-2 px-5 mb-6">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping"
                  style={{ background: 'var(--color-faint)', animationDuration: '1.8s' }} />
                <span className="relative inline-flex rounded-full h-[6px] w-[6px]"
                  style={{ background: 'var(--color-faint)' }} />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-faint)]">
                Loading live data…
              </span>
            </div>
          )}

          {/* First 2 sections — fully visible */}
          {FEED_SECTIONS.slice(0, 2).map(section => (
            <FeedSection
              key={section.id}
              section={section}
              videos={filteredVideos}
              onOpen={setActiveVideo}
            />
          ))}

          {/* Pro locked section — conversion mechanic */}
          <LockedSection onOpen={setActiveVideo} />

          {/* Remaining sections */}
          {FEED_SECTIONS.slice(2).map(section => (
            <FeedSection
              key={section.id}
              section={section}
              videos={filteredVideos}
              onOpen={setActiveVideo}
            />
          ))}

          {/* Empty state — only shown when a specific niche has zero content */}
          {filteredVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-faint)] border border-[var(--color-border)] px-2 py-1 rounded-sm">NO SIGNAL</span>
              <p className="text-[var(--color-muted)] text-[14px]">No clips in this niche yet.</p>
              <p className="text-[var(--color-faint)] text-[12px]">More content dropping soon.</p>
            </div>
          )}

        </main>

        {/* Pricing + conversion — below the feed, full-width */}
        <PricingSection />
        <BottomCTA />

      </div>

      {/* Video detail drawer */}
      <VideoDetailDrawer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </PageWrapper>
  )
}
