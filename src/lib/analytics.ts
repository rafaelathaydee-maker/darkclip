/**
 * Analytics-lite storage layer.
 * SERVER-ONLY. Never import from Client Components.
 *
 * Same storage strategy as waitlist.ts:
 *   • Local dev  → <project>/data/events.json
 *   • Vercel     → /tmp/darktrend/events.json  (ephemeral per invocation)
 *
 * All events are also written to console for Vercel Function Log visibility.
 * Set WEBHOOK_URL to forward events alongside leads.
 */

import { promises as fs } from 'fs'
import path from 'path'

const IS_VERCEL = !!process.env.VERCEL

const DATA_DIR  = IS_VERCEL ? '/tmp/darktrend' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'events.json')

export interface AnalyticsEvent {
  event:     string
  source?:   string
  timestamp: string
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

export async function readEvents(): Promise<AnalyticsEvent[]> {
  await ensureFile()
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as AnalyticsEvent[]
  } catch {
    return []
  }
}

export async function recordEvent(event: AnalyticsEvent): Promise<void> {
  // Always log for Vercel Function Log visibility
  console.log('[DARKTREND:EVENT]', JSON.stringify(event))

  try {
    const events = await readEvents()
    events.push(event)
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8')
  } catch (err) {
    // On Vercel, file write may fail silently — event is captured in logs
    if (!IS_VERCEL) console.error('[analytics] write error:', err)
  }
}
