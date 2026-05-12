/**
 * Demo clip download system — CLIENT ONLY.
 *
 * Maps video IDs (and niche fallbacks) to demo files in /public/demo-clips/.
 * These are placeholder files for testing the download flow.
 * Replace with real assets when the actual download pipeline is built.
 */

// Primary map: video ID → demo file
export const DEMO_CLIPS_BY_ID: Record<string, string> = {
  v001: '/demo-clips/cars-night-race.mp4',
  v002: '/demo-clips/cars-luxury-pov.mp4',
  v003: '/demo-clips/cars-track-record.mp4',
  v004: '/demo-clips/luxury-watch-unboxing.mp4',
  v005: '/demo-clips/luxury-interior-asmr.mp4',
}

// Fallback map: niche → demo file
const DEMO_CLIPS_BY_NICHE: Record<string, string> = {
  cars:       '/demo-clips/cars-night-race.mp4',
  luxury:     '/demo-clips/luxury-watch-unboxing.mp4',
  gym:        '/demo-clips/cars-track-record.mp4',
  motivation: '/demo-clips/cars-track-record.mp4',
  anime:      '/demo-clips/luxury-interior-asmr.mp4',
  asmr:       '/demo-clips/luxury-interior-asmr.mp4',
  football:   '/demo-clips/cars-night-race.mp4',
  ai:         '/demo-clips/luxury-watch-unboxing.mp4',
  cinematic:  '/demo-clips/cars-luxury-pov.mp4',
  lifestyle:  '/demo-clips/luxury-interior-asmr.mp4',
}

export function getDemoClipPath(videoId: string, niche: string): string {
  return (
    DEMO_CLIPS_BY_ID[videoId] ??
    DEMO_CLIPS_BY_NICHE[niche] ??
    '/demo-clips/cars-night-race.mp4'
  )
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
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) + '.mp4'
}
