import { after, type NextRequest } from 'next/server'
import { recordEvent } from '@/lib/analytics'
import { sendWebhook } from '@/lib/webhook'

const ALLOWED_EVENTS = new Set([
  'get_access_click',
  'locked_card_click',
  'pricing_pro_click',
  'bottom_cta_click',
  'modal_submit_success',
])

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const { event, source } = body as Record<string, unknown>

  if (typeof event !== 'string' || !ALLOWED_EVENTS.has(event)) {
    return Response.json({ error: 'Unknown event' }, { status: 400 })
  }

  const analyticsEvent = {
    event,
    source:    typeof source === 'string' && source.trim() ? source.trim() : undefined,
    timestamp: new Date().toISOString(),
  }

  // Persist to local/tmp storage
  await recordEvent(analyticsEvent)

  // Forward to webhook AFTER the response is sent — zero latency to the user
  after(() => sendWebhook({
    type:      'analytics',
    event:     analyticsEvent.event,
    source:    analyticsEvent.source,
    timestamp: analyticsEvent.timestamp,
  }))

  return Response.json({ ok: true }, { status: 201 })
}
