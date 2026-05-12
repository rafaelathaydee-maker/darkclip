# DarkTrend — Design System

## Color Strategy: Committed Dark

Scene: "A viral content researcher at 1am, two monitors, hunting the next exploding niche before anyone else."
Result: near-black base, single electric accent, deliberate glow.

### Palette (OKLCH)

| Token               | Value                        | Use |
|---------------------|------------------------------|-----|
| `--color-bg`        | `oklch(7% 0.008 280)`        | Page background |
| `--color-surface`   | `oklch(10% 0.010 280)`       | Card surface |
| `--color-surface-2` | `oklch(13% 0.012 280)`       | Elevated surface |
| `--color-border`    | `oklch(20% 0.015 280)`       | Default border |
| `--color-text`      | `oklch(92% 0.008 280)`       | Primary text |
| `--color-muted`     | `oklch(55% 0.010 280)`       | Secondary text |
| `--color-faint`     | `oklch(35% 0.008 280)`       | Disabled/placeholder |
| `--color-accent`    | `oklch(72% 0.28 295)`        | Electric violet accent |
| `--color-exploding` | `oklch(68% 0.22 25)`         | "Exploding" badges |
| `--color-growing`   | `oklch(70% 0.20 145)`        | Growth % (green) |
| `--color-score`     | `oklch(75% 0.24 55)`         | Viral score (amber) |

### Typography
- Font: **Geist Sans** (body, headings) + **Geist Mono** (numbers, scores)
- Scale: 11px tags → 13px body → 15px nav → 18px section → 24px page → 36px hero
- Weight: 400 body → 600 titles → 700 hero. Never flat.
- Line cap: 65ch max for any text block

### Glassmorphism — 3 uses only
1. Navbar top bar
2. NicheTabBar
3. VideoCard hover panel

```css
.glass {
  background: oklch(13% 0.010 280 / 0.7);
  backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid oklch(25% 0.015 280 / 0.5);
}
```

### Motion Principles (Emil Kowalski)
- All UI under 300ms
- Ease-out: `cubic-bezier(0.23, 1, 0.32, 1)` — strong, punchy
- No `scale(0)` origins — start at `scale(0.97)` minimum
- No bounce in UI contexts
- Button active: `scale(0.97)` via CSS (not JS)
- Stagger: 60ms between children

### Component Rules
- VideoCard: 240×320px portrait (3:4 ratio)
- GlowCard: reusable border-glow wrapper
- FeedSection gap: 72px (never uniform)
- Cards don't nest in cards

### Absolute Bans
- Gradient text
- Side-stripe borders
- Glassmorphism as default
- Hero-metric SaaS template
- Identical card grids
- `transition: all`
