/**
 * Demo clip download system — CLIENT ONLY.
 *
 * These are licensed demo/sample assets in /public/demo-clips/ used as
 * downloadable examples for Pro users.
 *
 * They are NOT the YouTube videos themselves.
 * The actual YouTube source is accessible via the "View Source" / "Watch on YouTube" button.
 */

// ─── Available demo files ─────────────────────────────────────────────────────

export const DEMO_FILES = [
  '/demo-clips/cars-night-race.mp4',
  '/demo-clips/cars-luxury-pov.mp4',
  '/demo-clips/cars-track-record.mp4',
  '/demo-clips/luxury-watch-unboxing.mp4',
  '/demo-clips/luxury-interior-asmr.mp4',
] as const

export type DemoFile = typeof DEMO_FILES[number]

// ─── Niche → demo file pool ───────────────────────────────────────────────────

/**
 * Each niche maps to 3 demo assets (cycling through the 5 available files).
 * Rotation ensures users get variety across sessions.
 */
const NICHE_DEMO_POOL: Record<string, DemoFile[]> = {
  cars: [
    '/demo-clips/cars-night-race.mp4',
    '/demo-clips/cars-luxury-pov.mp4',
    '/demo-clips/cars-track-record.mp4',
  ],
  luxury: [
    '/demo-clips/luxury-watch-unboxing.mp4',
    '/demo-clips/luxury-interior-asmr.mp4',
    '/demo-clips/cars-luxury-pov.mp4',
  ],
  asmr: [
    '/demo-clips/luxury-interior-asmr.mp4',
    '/demo-clips/cars-track-record.mp4',
    '/demo-clips/luxury-watch-unboxing.mp4',
  ],
  gym: [
    '/demo-clips/cars-track-record.mp4',
    '/demo-clips/cars-night-race.mp4',
    '/demo-clips/luxury-interior-asmr.mp4',
  ],
  motivation: [
    '/demo-clips/cars-night-race.mp4',
    '/demo-clips/luxury-watch-unboxing.mp4',
    '/demo-clips/cars-track-record.mp4',
  ],
  anime: [
    '/demo-clips/luxury-interior-asmr.mp4',
    '/demo-clips/cars-luxury-pov.mp4',
    '/demo-clips/cars-night-race.mp4',
  ],
  football: [
    '/demo-clips/cars-night-race.mp4',
    '/demo-clips/cars-track-record.mp4',
    '/demo-clips/luxury-interior-asmr.mp4',
  ],
  ai: [
    '/demo-clips/luxury-watch-unboxing.mp4',
    '/demo-clips/cars-luxury-pov.mp4',
    '/demo-clips/cars-track-record.mp4',
  ],
  cinematic: [
    '/demo-clips/cars-luxury-pov.mp4',
    '/demo-clips/luxury-interior-asmr.mp4',
    '/demo-clips/cars-night-race.mp4',
  ],
  lifestyle: [
    '/demo-clips/luxury-interior-asmr.mp4',
    '/demo-clips/luxury-watch-unboxing.mp4',
    '/demo-clips/cars-luxury-pov.mp4',
  ],
}

/** Primary map: specific mock video ID → demo file */
const DEMO_CLIPS_BY_ID: Record<string, DemoFile> = {
  v001: '/demo-clips/cars-night-race.mp4',
  v002: '/demo-clips/cars-luxury-pov.mp4',
  v003: '/demo-clips/cars-track-record.mp4',
  v004: '/demo-clips/luxury-watch-unboxing.mp4',
  v005: '/demo-clips/luxury-interior-asmr.mp4',
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns a demo clip path for the given video.
 * Tries ID-specific map first, then niche pool (using savedCount as a
 * deterministic slot selector for variety), then a default fallback.
 */
export function getDemoClipPath(videoId: string, niche: string, savedCount = 0): DemoFile {
  // 1. ID-specific
  if (DEMO_CLIPS_BY_ID[videoId]) return DEMO_CLIPS_BY_ID[videoId]

  // 2. Niche pool — deterministic slot based on savedCount
  const pool = NICHE_DEMO_POOL[niche]
  if (pool && pool.length > 0) {
    return pool[savedCount % pool.length]
  }

  // 3. Default
  return '/demo-clips/cars-night-race.mp4'
}

/**
 * Triggers a browser download for a demo clip.
 * Uses anchor element pattern — works in all modern browsers.
 */
export function downloadDemoClip(filepath: string, suggestedFilename: string): void {
  const a = document.createElement('a')
  a.href = filepath
  a.download = suggestedFilename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/** Sanitizes a video title into a safe filename */
export function toFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 55) + '-sample.mp4'
  )
}
