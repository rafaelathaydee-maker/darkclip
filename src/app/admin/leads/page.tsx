import { notFound } from 'next/navigation'
import { readLeads } from '@/lib/waitlist'
import { readEvents } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

// ── Helpers ──────────────────────────────────────────────────────────────────

function countBy<T>(arr: T[], key: (item: T) => string | undefined): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, item) => {
    const k = key(item) ?? '—'
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})
}

function todayISO() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function isToday(ts: string) {
  return ts.startsWith(todayISO())
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      padding: '20px 24px',
      borderRadius: '12px',
      background: 'oklch(10% 0.010 280)',
      border: '1px solid oklch(20% 0.015 280)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'oklch(35% 0.008 280)' }}>
        {label}
      </span>
      <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', color: 'oklch(92% 0.008 280)', lineHeight: 1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: '11px', color: 'oklch(55% 0.010 280)' }}>{sub}</span>
      )}
    </div>
  )
}

// ── Bar Chart Row ─────────────────────────────────────────────────────────────

function BarRow({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'oklch(55% 0.010 280)', width: '160px', flexShrink: 0, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '8px', borderRadius: '99px', background: 'oklch(13% 0.012 280)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '99px', background: color, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: 'oklch(75% 0.010 280)', width: '32px', textAlign: 'right', flexShrink: 0 }}>
        {count}
      </span>
    </div>
  )
}

// ── Section Shell ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      padding: '24px',
      borderRadius: '16px',
      background: 'oklch(10% 0.010 280)',
      border: '1px solid oklch(20% 0.015 280)',
    }}>
      <h2 style={{ fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'oklch(35% 0.008 280)', marginBottom: '20px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminLeadsPage() {
  if (process.env.NODE_ENV !== 'development') notFound()

  const [leads, events] = await Promise.all([readLeads(), readEvents()])

  const leadsToday  = leads.filter(l  => isToday(l.createdAt))
  const eventsToday = events.filter(e => isToday(e.timestamp))

  const leadsByNiche  = countBy(leads,  l => l.niche)
  const leadsBySource = countBy(leads,  l => l.source)
  const eventsByType  = countBy(events, e => e.event)

  const maxNiche  = Math.max(1, ...Object.values(leadsByNiche))
  const maxSource = Math.max(1, ...Object.values(leadsBySource))
  const maxEvent  = Math.max(1, ...Object.values(eventsByType))

  const recentLeads = [...leads].reverse().slice(0, 12)
  const isVercel    = !!process.env.VERCEL

  return (
    <div style={{
      minHeight: '100vh',
      background: 'oklch(7% 0.008 280)',
      color: 'oklch(92% 0.008 280)',
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid oklch(20% 0.015 280)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Dark<span style={{ color: 'oklch(72% 0.28 295)' }}>Trend</span>
          </span>
          <span style={{ height: '16px', width: '1px', background: 'oklch(20% 0.015 280)' }} />
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'oklch(35% 0.008 280)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Lead Dashboard
          </span>
        </div>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'oklch(35% 0.008 280)' }}>
          DEV ONLY · {new Date().toLocaleDateString('pt-BR', { dateStyle: 'medium' })}
        </span>
      </div>

      {/* Vercel storage warning */}
      {isVercel && (
        <div style={{
          padding: '12px 32px',
          background: 'oklch(68% 0.22 25 / 0.12)',
          borderBottom: '1px solid oklch(68% 0.22 25 / 0.3)',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: 'oklch(68% 0.22 25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ⚠️ Running on Vercel — file storage is ephemeral. Data shown here may be incomplete.
          Check Vercel Function Logs for <code style={{ background: 'oklch(68% 0.22 25 / 0.15)', padding: '1px 4px', borderRadius: '3px' }}>[DARKTREND:LEAD]</code> entries.
          Set <code style={{ background: 'oklch(68% 0.22 25 / 0.15)', padding: '1px 4px', borderRadius: '3px' }}>WEBHOOK_URL</code> env var for persistent capture.
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <StatCard label="Total leads"    value={leads.length}   sub={`${leadsToday.length} hoje`} />
          <StatCard label="Com WhatsApp"   value={leads.filter(l => l.whatsapp).length} sub="leads com WA" />
          <StatCard label="Total eventos"  value={events.length}  sub={`${eventsToday.length} hoje`} />
          <StatCard label="Taxa conversão" value={
            leads.length > 0
              ? `${Math.round((leads.length / Math.max(events.filter(e => e.event === 'get_access_click').length, 1)) * 100)}%`
              : '—'
          } sub="leads / cliques CTA" />
        </div>

        {/* Main 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

          {/* Leads by niche */}
          <Section title="Leads por nicho">
            {Object.keys(leadsByNiche).length === 0 ? (
              <p style={{ fontSize: '12px', color: 'oklch(35% 0.008 280)' }}>Nenhum lead com nicho ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(leadsByNiche)
                  .sort((a, b) => b[1] - a[1])
                  .map(([niche, count]) => (
                    <BarRow key={niche} label={niche} count={count} max={maxNiche} color="oklch(72% 0.28 295)" />
                  ))}
              </div>
            )}
          </Section>

          {/* Leads by source */}
          <Section title="Leads por origem">
            {Object.keys(leadsBySource).length === 0 ? (
              <p style={{ fontSize: '12px', color: 'oklch(35% 0.008 280)' }}>Nenhum dado de origem ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(leadsBySource)
                  .sort((a, b) => b[1] - a[1])
                  .map(([src, count]) => (
                    <BarRow key={src} label={src} count={count} max={maxSource} color="oklch(70% 0.20 145)" />
                  ))}
              </div>
            )}
          </Section>

        </div>

        {/* Events by type — full width */}
        <div style={{ marginBottom: '12px' }}>
          <Section title="Eventos de conversão">
            {Object.keys(eventsByType).length === 0 ? (
              <p style={{ fontSize: '12px', color: 'oklch(35% 0.008 280)' }}>Nenhum evento registrado ainda.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {Object.entries(eventsByType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([evt, count]) => (
                    <BarRow key={evt} label={evt} count={count} max={maxEvent} color="oklch(75% 0.24 55)" />
                  ))}
              </div>
            )}
          </Section>
        </div>

        {/* Latest emails */}
        <Section title={`Últimos emails (${Math.min(recentLeads.length, 12)} de ${leads.length})`}>
          {recentLeads.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'oklch(35% 0.008 280)' }}>Nenhum lead ainda. Poste no TikTok! 🚀</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '12px', padding: '8px 0', borderBottom: '1px solid oklch(20% 0.015 280)', marginBottom: '4px' }}>
                {['Email', 'Nicho', 'Origem', 'Criado em'].map(h => (
                  <span key={h} style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'oklch(35% 0.008 280)' }}>{h}</span>
                ))}
              </div>
              {recentLeads.map((lead, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: i < recentLeads.length - 1 ? '1px solid oklch(15% 0.010 280)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'oklch(92% 0.008 280)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.email}
                    {lead.whatsapp && (
                      <span style={{ marginLeft: '6px', fontSize: '10px', color: 'oklch(70% 0.20 145)', fontFamily: 'monospace' }}>WA</span>
                    )}
                  </span>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'oklch(72% 0.28 295)' }}>
                    {lead.niche ?? '—'}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'oklch(55% 0.010 280)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.source}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'oklch(35% 0.008 280)' }}>
                    {new Date(lead.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>

      </div>
    </div>
  )
}
