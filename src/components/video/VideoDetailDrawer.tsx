'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, TrendingUp, Eye, Download,
  Lock, ExternalLink, Copy, Clock, Tag, Crown, PlayCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { ViralScore } from './ViralScore'
import { GrowthBadge } from './GrowthBadge'
import { formatViews, formatDuration } from '@/lib/utils'
import { useToast } from '@/lib/toast'
import { useConversion } from '@/lib/conversion'
import { useFounder } from '@/lib/founder'
import { getDemoClipPath, downloadDemoClip, toFilename } from '@/lib/download'
import { getYouTubeId } from '@/types'
import type { VideoItem } from '@/types'

interface VideoDetailDrawerProps {
  video: VideoItem | null
  onClose: () => void
}

// Similar clips placeholder — shown when Pro mode is active
const LOCKED_SIMILAR = [
  { title: 'Similar high-growth clip #1', growth: '+1,780%', score: 96 },
  { title: 'Similar high-growth clip #2', growth: '+890%',   score: 92 },
  { title: 'Similar high-growth clip #3', growth: '+620%',   score: 88 },
]

export function VideoDetailDrawer({ video, onClose }: VideoDetailDrawerProps) {
  const toast               = useToast()
  const { openModal }       = useConversion()
  const { isPro }           = useFounder()
  const [embedLoaded, setEmbedLoaded] = useState(false)

  // Reset embed state when a new video is opened
  useEffect(() => { setEmbedLoaded(false) }, [video?.id])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (video) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [video])

  if (!video) return null

  const ytId     = getYouTubeId(video)
  const ytUrl    = ytId ? `https://www.youtube.com/shorts/${ytId}` : null

  // Thumbnail fallback — same chain as VideoCard
  const [thumbSrc, setThumbSrc]   = useState(video.thumbnail)
  const thumbAttempt              = useRef(0)
  useEffect(() => { setThumbSrc(video.thumbnail); thumbAttempt.current = 0 }, [video.id, video.thumbnail])

  const handleThumbError = () => {
    if (!ytId) return
    const fallbacks = [
      `https://i.ytimg.com/vi/${ytId}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`,
    ]
    const idx = thumbAttempt.current++
    if (idx < fallbacks.length) setThumbSrc(fallbacks[idx])
  }
  const embedSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : null

  const handleLocked = (action: 'download' | 'similar' | 'source') => {
    const sourceMap = { download: 'drawer_download', similar: 'drawer_similar', source: 'drawer_source' } as const
    openModal(sourceMap[action])
  }

  const handleDownload = () => {
    const clipPath = getDemoClipPath(video.id, video.niche, video.savedCount)
    const filename  = toFilename(video.title)
    downloadDemoClip(clipPath, filename)
    toast(`Sample clip baixado — ${filename}`, 'success')
  }

  const handleWatchOnYouTube = () => {
    if (!ytUrl) return
    window.open(ytUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyLink = () => {
    const url = ytUrl ?? `https://darktrend.co/video/${video.id}`
    navigator.clipboard?.writeText(url)
    toast(ytUrl ? 'YouTube link copiado' : 'Link copiado', 'success')
  }

  const handleViewSource = () => {
    if (ytUrl) {
      window.open(ytUrl, '_blank', 'noopener,noreferrer')
      toast('Abrindo no YouTube…', 'info')
    } else {
      window.open(video.thumbnail.split('?')[0], '_blank', 'noopener,noreferrer')
      toast('Abrindo fonte original…', 'info')
    }
  }

  return (
    <AnimatePresence>
      {video && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: ease.out }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-[70]',
              'w-full sm:w-[420px]',
              'bg-[var(--color-surface)]',
              'border-l border-[var(--color-border)]',
              'overflow-y-auto no-scrollbar',
              'flex flex-col',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] shrink-0">
              <span className="text-[13px] font-semibold text-[var(--color-text)]">Clip Intel</span>
              <div className="flex items-center gap-2">
                {ytUrl && (
                  <button
                    onClick={handleWatchOnYouTube}
                    className={cn(
                      'flex items-center gap-1.5 h-7 px-3 rounded-lg',
                      'text-[11px] font-medium',
                      'bg-[var(--color-accent)]/12 border border-[var(--color-accent)]/30 text-[var(--color-accent)]',
                      'hover:bg-[var(--color-accent)]/20 transition-all duration-150'
                    )}
                  >
                    <PlayCircle size={11} />
                    Watch
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-faint)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Media section ─────────────────────────────────── */}
            {embedSrc ? (
              /* YouTube embed — portrait player centered in panel */
              <div className="relative w-full bg-black flex items-center justify-center shrink-0" style={{ minHeight: 320 }}>
                {/* Thumbnail shown while embed loads */}
                {!embedLoaded && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={thumbSrc}
                    alt={video.title}
                    onError={handleThumbError}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    draggable={false}
                  />
                )}
                {/* Centred portrait iframe */}
                <div
                  className="relative z-10"
                  style={{ width: 'min(180px, 60%)', aspectRatio: '9/16' }}
                >
                  <iframe
                    key={video.id}
                    src={embedSrc}
                    title={video.title}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    onLoad={() => setEmbedLoaded(true)}
                    className="w-full h-full rounded-xl"
                    style={{ border: 'none' }}
                  />
                </div>
                {/* Gradient fade into drawer content below */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, var(--color-surface), transparent)' }}
                />
                {/* Badges overlaid */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
                  {video.isExploding && (
                    <span className={cn(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px]',
                      'text-[9px] font-mono font-bold uppercase tracking-[0.14em]',
                      'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/30',
                      'animate-[signal-flicker_6s_ease-in-out_infinite]'
                    )}>
                      LIVE
                    </span>
                  )}
                  <span />
                  <ViralScore score={video.viralScore} />
                </div>
              </div>
            ) : (
              /* Static thumbnail fallback for mock/demo items */
              <div className="relative w-full aspect-[3/4] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbSrc}
                  alt={video.title}
                  onError={handleThumbError}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 50%)' }}
                />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  {video.isExploding && (
                    <span className={cn(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px]',
                      'text-[9px] font-mono font-bold uppercase tracking-[0.14em]',
                      'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/30',
                      'animate-[signal-flicker_6s_ease-in-out_infinite]'
                    )}>
                      LIVE
                    </span>
                  )}
                  <span />
                  <ViralScore score={video.viralScore} />
                </div>
              </div>
            )}

            {/* ── Content ───────────────────────────────────────── */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-5">

              {/* Title + creator + YouTube link */}
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--color-text)] leading-snug mb-1.5">
                  {video.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12px] text-[var(--color-accent)] font-medium">{video.creator}</p>
                  {ytUrl && (
                    <a
                      href={ytUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className={cn(
                        'flex items-center gap-1 text-[10px] font-mono',
                        'text-[var(--color-faint)] hover:text-[var(--color-accent)]',
                        'transition-colors duration-150'
                      )}
                    >
                      <PlayCircle size={9} />
                      youtube.com/shorts
                      <ExternalLink size={8} />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Eye,        label: 'Views',    value: formatViews(video.views),                    color: 'text-[var(--color-text)]' },
                  { icon: TrendingUp, label: 'Growth',   value: `+${video.growthPercent.toLocaleString()}%`, color: 'text-[var(--color-accent)]' },
                  { icon: Clock,      label: 'Duration', value: formatDuration(video.duration),              color: 'text-[var(--color-text)]' },
                ].map(stat => (
                  <div key={stat.label} className={cn(
                    'flex flex-col gap-1 p-3 rounded-xl',
                    'bg-[var(--color-surface-2)] border border-[var(--color-border)]'
                  )}>
                    <stat.icon size={12} className="text-[var(--color-faint)]" />
                    <span className={cn('text-[14px] font-mono font-semibold', stat.color)}>{stat.value}</span>
                    <span className="text-[10px] text-[var(--color-faint)]">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {video.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag size={11} className="text-[var(--color-faint)]" />
                    <span className="text-[11px] text-[var(--color-faint)] uppercase tracking-wider font-mono">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {video.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg text-[11px] bg-[var(--color-surface-3)] text-[var(--color-muted)] border border-[var(--color-border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Format + niche */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono uppercase bg-[var(--color-surface-3)] text-[var(--color-faint)] border border-[var(--color-border)]">
                  {video.format}
                </span>
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono uppercase bg-[var(--color-surface-3)] text-[var(--color-faint)] border border-[var(--color-border)]">
                  {video.niche}
                </span>
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono uppercase bg-[var(--color-surface-3)] text-[var(--color-faint)] border border-[var(--color-border)]">
                  {video.meta.trendingIn}
                </span>
              </div>

              {/* ── Download block ─────────────────────────────────── */}
              <div className="flex flex-col gap-2">

                {/* Download sample clip */}
                {isPro ? (
                  <button
                    onClick={handleDownload}
                    className={cn(
                      'flex flex-col items-start gap-0.5 w-full px-4 py-3 rounded-xl relative',
                      'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30',
                      'hover:bg-[var(--color-accent)]/18 hover:border-[var(--color-accent)]/50',
                      'transition-all duration-150 active:scale-[0.98]'
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Download size={13} className="text-[var(--color-accent)] shrink-0" />
                      <span className="text-[13px] font-medium text-[var(--color-accent)]">Download sample clip</span>
                      <span className="ml-auto px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-[var(--color-accent)] text-black font-bold shrink-0">
                        pro
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-faint)] pl-[21px]">
                      Licensed demo asset · not the YouTube video
                    </p>
                  </button>
                ) : (
                  <button
                    onClick={() => handleLocked('download')}
                    className={cn(
                      'flex flex-col items-start gap-0.5 w-full px-4 py-3 rounded-xl relative',
                      'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                      'hover:border-[var(--color-border-2)]',
                      'transition-all duration-150 active:scale-[0.98]'
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Lock size={11} className="text-[var(--color-accent)] shrink-0" />
                      <span className="text-[13px] font-medium text-[var(--color-faint)]">Download sample clip</span>
                      <span className="ml-auto px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-[var(--color-accent)] text-black font-bold shrink-0">
                        pro
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-faint)] pl-[21px]">
                      Acesso Pro para baixar demo assets
                    </p>
                  </button>
                )}

                {/* View source — YouTube link or copy */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      'flex items-center justify-center gap-2 h-9 rounded-xl text-[12px] font-medium',
                      'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                      'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-2)]',
                      'transition-all duration-150 active:scale-[0.97]'
                    )}
                  >
                    <Copy size={12} />
                    Copy link
                  </button>

                  {ytUrl ? (
                    <button
                      onClick={handleWatchOnYouTube}
                      className={cn(
                        'flex items-center justify-center gap-1.5 h-9 rounded-xl text-[12px] font-medium',
                        'bg-[#FF0000]/8 border border-[#FF0000]/20 text-[#FF5555]',
                        'hover:bg-[#FF0000]/15 hover:border-[#FF0000]/35',
                        'transition-all duration-150 active:scale-[0.97]'
                      )}
                    >
                      <PlayCircle size={12} />
                      YouTube source
                      <ExternalLink size={9} className="opacity-60" />
                    </button>
                  ) : (
                    <button
                      onClick={isPro ? handleViewSource : () => handleLocked('source')}
                      className={cn(
                        'flex items-center justify-center gap-2 h-9 rounded-xl text-[12px]',
                        'border border-[var(--color-border)] text-[var(--color-faint)]',
                        'hover:border-[var(--color-border-2)] hover:text-[var(--color-muted)]',
                        'transition-all duration-150 active:scale-[0.97]'
                      )}
                    >
                      <ExternalLink size={12} />
                      View source
                      {!isPro && <Lock size={9} className="text-[var(--color-accent)]" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-[var(--color-border)]" />

              {/* Similar clips */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-[var(--color-text)]">Similar High-Growth Clips</span>
                  <span className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full',
                    'text-[10px] font-mono font-bold uppercase',
                    isPro
                      ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                      : 'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
                  )}>
                    {isPro ? <><Crown size={8} /> Pro ✓</> : <><Lock size={8} /> Pro</>}
                  </span>
                </div>

                {isPro ? (
                  <div className="flex flex-col gap-2">
                    {LOCKED_SIMILAR.map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl cursor-pointer',
                          'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                          'hover:border-[var(--color-border-2)] transition-colors duration-150'
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-3)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-[var(--color-text)] truncate">{item.title}</p>
                          <p className="text-[11px] text-[var(--color-accent)] font-mono">{item.growth}</p>
                        </div>
                        <div className="text-[11px] font-mono font-bold text-[var(--color-accent)] shrink-0">{item.score}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="flex flex-col gap-2 blur-[3px] select-none pointer-events-none">
                      {LOCKED_SIMILAR.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-3)]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-[var(--color-text)] truncate">{item.title}</p>
                            <p className="text-[11px] text-[var(--color-accent)] font-mono">{item.growth}</p>
                          </div>
                          <div className="text-[11px] font-mono font-bold text-[var(--color-accent)]">{item.score}</div>
                        </div>
                      ))}
                    </div>
                    <div className={cn(
                      'absolute inset-0 flex flex-col items-center justify-center gap-3',
                      'bg-[var(--color-surface)]/60 backdrop-blur-[1px] rounded-xl',
                    )}>
                      <Lock size={18} className="text-[var(--color-accent)]" />
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-[var(--color-text)]">Criadores Pro veem isso primeiro.</p>
                        <p className="text-[11px] text-[var(--color-muted)]">Desbloqueie clips similares de alto crescimento</p>
                      </div>
                      <button
                        onClick={() => handleLocked('similar')}
                        className={cn(
                          'flex items-center gap-1.5 h-8 px-4 rounded-full',
                          'text-[12px] font-medium bg-[var(--color-accent)] text-black',
                          'hover:brightness-110 transition-all active:scale-[0.97]'
                        )}
                      >
                        Garantir acesso
                      </button>
                    </div>
                  </div>
                )}
              </div>


            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
