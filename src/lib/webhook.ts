/**
 * Webhook forwarding helper — SERVER-ONLY.
 *
 * Forwards lead and analytics payloads to WEBHOOK_URL when set.
 * Designed to be called inside Next.js `after()` so it runs after the
 * HTTP response is sent — zero latency added to the user experience.
 *
 * Log tags (searchable in Vercel Function Logs):
 *   [DARKTREND:WEBHOOK:LEAD_SENT]
 *   [DARKTREND:WEBHOOK:EVENT_SENT]
 *   [DARKTREND:WEBHOOK:FAILED]
 */

export type WebhookPayload =
  | {
      type:       'lead'
      email:      string
      whatsapp?:  string
      niche?:     string
      source:     string
      createdAt:  string
    }
  | {
      type:       'analytics'
      event:      string
      source?:    string
      timestamp:  string
    }

export async function sendWebhook(payload: WebhookPayload): Promise<void> {
  const url = process.env.WEBHOOK_URL

  // No URL configured — skip silently
  if (!url) return

  const logLabel = payload.type === 'lead' ? 'LEAD_SENT' : 'EVENT_SENT'

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error(`Webhook responded with HTTP ${res.status}`)
    }

    console.log(`[DARKTREND:WEBHOOK:${logLabel}]`, JSON.stringify(payload))
  } catch (err) {
    // Never rethrow — webhook failure must not affect the user
    console.error('[DARKTREND:WEBHOOK:FAILED]', String(err), '|', JSON.stringify(payload))
  }
}
