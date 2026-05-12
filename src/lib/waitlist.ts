/**
 * Waitlist storage layer.
 * SERVER-ONLY. Never import from Client Components.
 *
 * Storage strategy:
 *   • Local dev  → writes to  <project>/data/waitlist.json  (persistent, readable by /admin/leads)
 *   • Vercel     → writes to  /tmp/darktrend/waitlist.json  (writable, but NOT persistent across
 *                             function invocations — data survives within a warm instance only)
 *
 * All leads are also written to console so Vercel Function Logs capture every submission.
 * Set WEBHOOK_URL in env vars to forward leads to Zapier / Make / webhook.site for real persistence.
 *
 * To swap to a proper database later, replace `readLeads` + `addLead` — the API route + modal
 * don't need to change.
 */

import { promises as fs } from 'fs'
import path from 'path'

const IS_VERCEL = !!process.env.VERCEL

// /tmp is the only writable path on Vercel; use project /data locally
const DATA_DIR  = IS_VERCEL ? '/tmp/darktrend' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'waitlist.json')

export interface WaitlistLead {
  email:     string
  whatsapp?: string
  niche?:    string
  source:    string
  createdAt: string
}

export type AddLeadResult =
  | { ok: true }
  | { ok: false; code: 'DUPLICATE' | 'ERROR'; message: string }

// ── Internal ──────────────────────────────────────────────────────────────────

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function readLeads(): Promise<WaitlistLead[]> {
  await ensureFile()
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as WaitlistLead[]
  } catch {
    return []
  }
}

export async function addLead(lead: WaitlistLead): Promise<AddLeadResult> {
  // Always log — Vercel Function Logs capture every submission even when file write is ephemeral
  console.log('[DARKTREND:LEAD]', JSON.stringify(lead))
  // Webhook forwarding is handled in the route handler via after() — not here

  try {
    const leads = await readLeads()

    const duplicate = leads.some(
      l => l.email.toLowerCase() === lead.email.toLowerCase()
    )
    if (duplicate) {
      return { ok: false, code: 'DUPLICATE', message: 'Esse email já está na lista!' }
    }

    leads.push(lead)
    await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), 'utf-8')
    return { ok: true }
  } catch (err) {
    console.error('[waitlist] write error:', err)
    // On Vercel without persistent storage, still return ok so the user
    // isn't shown a false error — the lead is captured in logs + webhook.
    if (IS_VERCEL) return { ok: true }
    return { ok: false, code: 'ERROR', message: 'Erro interno. Tente novamente.' }
  }
}
