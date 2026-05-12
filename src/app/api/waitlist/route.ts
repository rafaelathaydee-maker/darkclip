import { after, type NextRequest } from 'next/server'
import { addLead, readLeads } from '@/lib/waitlist'
import { sendWebhook } from '@/lib/webhook'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  const { email, whatsapp, niche, source } = body as Record<string, unknown>

  // Validate email
  if (typeof email !== 'string' || !email.trim()) {
    return Response.json({ error: 'Email é obrigatório.' }, { status: 400 })
  }

  const emailClean = email.trim().toLowerCase()
  if (!EMAIL_RE.test(emailClean)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 })
  }

  const lead = {
    email:     emailClean,
    whatsapp:  typeof whatsapp === 'string' && whatsapp.trim() ? whatsapp.trim() : undefined,
    niche:     typeof niche    === 'string' && niche.trim()    ? niche.trim()    : undefined,
    source:    typeof source   === 'string' && source.trim()   ? source.trim()   : 'unknown',
    createdAt: new Date().toISOString(),
  }

  // Persist to local/tmp storage
  const result = await addLead(lead)

  if (!result.ok) {
    const status = result.code === 'DUPLICATE' ? 409 : 500
    return Response.json({ error: result.message }, { status })
  }

  // Forward to webhook AFTER the response is sent — zero latency to the user
  after(() => sendWebhook({
    type:      'lead',
    email:     lead.email,
    whatsapp:  lead.whatsapp,
    niche:     lead.niche,
    source:    lead.source,
    createdAt: lead.createdAt,
  }))

  return Response.json({ success: true }, { status: 201 })
}

// Dev-only: inspect collected leads
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not found.' }, { status: 404 })
  }

  const leads = await readLeads()
  return Response.json({ count: leads.length, leads })
}
