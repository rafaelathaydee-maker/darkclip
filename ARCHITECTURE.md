# DarkTrend — Architecture & Execution Plan

> Solo developer. Ship fast. No overengineering.
> Phase 1 (frontend + mock data) is complete and running.

---

## 1. Folder Structure

```
darktrend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ✅ done
│   │   ├── page.tsx                    ✅ done (homepage feed)
│   │   ├── globals.css                 ✅ done
│   │   ├── niche/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            — Phase 2
│   │   ├── video/
│   │   │   └── [id]/
│   │   │       └── page.tsx            — Phase 2
│   │   ├── auth/
│   │   │   ├── signin/page.tsx         — Phase 2
│   │   │   └── callback/route.ts       — Phase 2 (OAuth)
│   │   └── api/
│   │       ├── videos/route.ts         — Phase 3 (YouTube ingest)
│   │       └── trends/route.ts         — Phase 4
│   │
│   ├── components/
│   │   ├── ui/                         ✅ done (Badge, Button, GlowCard)
│   │   ├── layout/                     ✅ done (Navbar, PageWrapper)
│   │   ├── effects/                    ✅ done (GradientOrb)
│   │   ├── video/                      ✅ done (VideoCard, ViralScore, GrowthBadge)
│   │   ├── niche/                      ✅ done (NicheTabBar)
│   │   ├── feed/                       ✅ done (FeedSection, FeedRow)
│   │   └── auth/
│   │       ├── AuthModal.tsx           — Phase 2
│   │       └── UserMenu.tsx            — Phase 2
│   │
│   ├── lib/
│   │   ├── mock-data.ts                ✅ done
│   │   ├── motion.ts                   ✅ done
│   │   ├── utils.ts                    ✅ done
│   │   ├── supabase/
│   │   │   ├── client.ts               — Phase 2 (browser client)
│   │   │   ├── server.ts               — Phase 2 (server client)
│   │   │   └── queries.ts              — Phase 2 (typed query helpers)
│   │   └── youtube/
│   │       ├── client.ts               — Phase 3 (API wrapper)
│   │       └── score.ts                — Phase 3 (viral score algorithm)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                  — Phase 2
│   │   ├── useSavedVideos.ts           — Phase 2
│   │   └── useVideoFeed.ts             — Phase 3
│   │
│   └── types/
│       └── index.ts                    ✅ done
│
├── ARCHITECTURE.md                     ✅ this file
├── PROJECT_MEMORY.md
├── SAAS_MASTERPLAN.md
└── DESIGN_SYSTEM.md
```

**Rule:** Never go deeper than 3 levels. No barrel files (index.ts re-exports) until the project has 20+ components.

---

## 2. Page Structure

| Route | Purpose | Phase | Auth Required |
|-------|---------|-------|---------------|
| `/` | Homepage feed, niche filter, 5 sections | 1 ✅ | No |
| `/niche/[slug]` | Full niche page, deeper stats, all clips | 2 | No |
| `/video/[id]` | Video detail, metadata, similar clips | 2 | No |
| `/auth/signin` | Magic link / Google OAuth | 2 | No |
| `/auth/callback` | OAuth redirect handler | 2 | No |
| `/saved` | User's saved clips | 2 | Yes |
| `/dashboard` | Creator analytics overview | 4 | Yes |

**Homepage sections (current):**
1. Exploding Now — isExploding + sorted by growthPercent
2. Fastest Growing — sorted by growthPercent, top 10
3. Low Competition — viralScore ≥ 85 + views < 5M
4. High Replay Potential — duration ≤ 55s + sorted by savedCount
5. Most Saved This Week — sorted by savedCount, top 10

**Rule:** Pages are thin wrappers. All logic lives in components or hooks.

---

## 3. Component Structure

### Current (Phase 1) — all built
```
ui/          Badge, Button, GlowCard
layout/      Navbar, PageWrapper
effects/     GradientOrb
video/       VideoCard, ViralScore, GrowthBadge
niche/       NicheTabBar
feed/        FeedSection, FeedRow
```

### Phase 2 additions
```
auth/        AuthModal (magic link form), UserMenu (avatar dropdown)
video/       SaveButton (with optimistic UI + Supabase write)
```

### Phase 3 additions
```
feed/        LiveFeedSection (real data, polling)
niche/       NicheTrendChart (sparkline, recharts or lightweight svg)
video/       VideoDetailDrawer (slide-in panel)
```

**Component rules:**
- Every component gets its own file. No co-located components.
- Client components (`'use client'`) only when using state, refs, or browser APIs.
- Server components by default for data-fetching wrappers in Phase 3+.
- Props always typed with an explicit interface above the function.
- No default exports (named exports only). Easier to refactor.

---

## 4. Mock Data Structure

**Current shape (`VideoItem`):**
```ts
{
  id: string           // 'v001' — sequential for now, UUID later
  title: string
  creator: string      // '@handle'
  thumbnail: string    // Unsplash URL
  viralScore: number   // 0–100, computed
  growthPercent: number // raw %, e.g. 1240 = +1240%
  views: number
  niche: NicheId
  tags: string[]       // max 5
  isExploding: boolean // true if growthPercent > 1000
  format: 'short' | 'clip' | 'reel'
  duration: number     // seconds
  savedCount: number
}
```

**Mock data rules:**
- 30–40 entries total. Enough to populate all 5 sections without repetition.
- Spread across all 10 niches (min 2 per niche).
- At least 10 `isExploding: true` entries (needed for "Exploding Now" section).
- viralScore range: 80–99 (low scores aren't interesting to users).
- growthPercent range: 200–5200 (realistic viral range).
- views range: 1M–35M (already in the "discovered" phase).

---

## 5. Design System Rules

### Colors (OKLCH — all in globals.css `@theme inline`)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `oklch(7% 0.008 280)` | Page background |
| `--color-surface` | `oklch(10% 0.010 280)` | Card surface |
| `--color-surface-2` | `oklch(13% 0.012 280)` | Elevated surface |
| `--color-surface-3` | `oklch(17% 0.014 280)` | Highest surface |
| `--color-border` | `oklch(20% 0.015 280)` | Default border |
| `--color-border-2` | `oklch(28% 0.018 280)` | Hover border |
| `--color-text` | `oklch(92% 0.008 280)` | Primary text |
| `--color-muted` | `oklch(55% 0.010 280)` | Secondary text |
| `--color-faint` | `oklch(35% 0.008 280)` | Disabled/placeholder |
| `--color-accent` | `oklch(72% 0.28 295)` | Electric violet |
| `--color-exploding` | `oklch(68% 0.22 25)` | Hot red/orange |
| `--color-growing` | `oklch(70% 0.20 145)` | Growth green |
| `--color-score` | `oklch(75% 0.24 55)` | Viral score amber |

### Typography
- Font: Geist (sans) + Geist Mono (numbers, scores, badges)
- Scale: 10px metadata → 11px mono badges → 12px labels → 13px body → 15px nav → 18px section title
- Weight: 400 body → 600 section titles → 700 hero numbers
- Tracking: `-0.02em` on headings, normal on body

### Glassmorphism — only 3 uses
1. Navbar (fixed top)
2. NicheTabBar (sticky)
3. VideoCard hover panel

Nowhere else. Ever.

### Absolute bans
- No gradient text (`bg-clip-text`)
- No side-stripe accent borders (left-border-color pattern)
- No hero metric template (big number + label stacked)
- No identical card grid (sections must use different layouts)
- No `scale(0)` in animation origins
- No bounce easing on UI elements (only on tab indicator spring)

---

## 6. Animation Rules

### Easing curves
```ts
ease.out    = [0.23, 1, 0.32, 1]      // entrances, slides
ease.inOut  = [0.77, 0, 0.175, 1]     // repositioning
ease.snappy = [0.25, 0.46, 0.45, 0.94] // quick interactions
```

### Timing budget
| Interaction | Duration | Easing |
|------------|----------|--------|
| Button hover | CSS 150ms | ease-out |
| Card scale on hover | 200ms | ease.out |
| VideoCard hover panel slide | 220ms | ease.out |
| Section header entrance | 300ms | ease.out |
| Card row stagger | 60ms between children | ease.out |
| Navbar mount | 400ms | ease.out |
| Tab indicator spring | 350ms spring, 0.15 bounce | spring |

### Rules
- All UI interactions: under 300ms
- Active/press state: `scale(0.97)` via CSS `:active` (not JS)
- Hover scale on cards: `1.03` max
- `whileInView` with `once: true` for sections (fires once, not every scroll)
- No animation on skeleton/loading states in Phase 1
- `prefers-reduced-motion`: all durations collapse to `0.01ms`

---

## 7. Niche Category Structure

```ts
type NicheId =
  | 'all'        // special — no filter
  | 'asmr'
  | 'cars'
  | 'luxury'
  | 'motivation'
  | 'gym'
  | 'anime'
  | 'football'
  | 'ai'
  | 'cinematic'
  | 'lifestyle'
```

### Niche metadata
```ts
interface Niche {
  id: NicheId
  label: string
  emoji: string
  // Phase 3 additions:
  // youtubeKeywords: string[]   search terms for YouTube API
  // avgViralScore: number       computed from real data
  // weeklyGrowth: number        % change in total views this week
}
```

### YouTube search keywords per niche (Phase 3)
| Niche | Keywords |
|-------|----------|
| asmr | `asmr`, `asmr relaxing`, `asmr sounds` |
| cars | `supercar`, `car review`, `hypercar`, `car race short` |
| luxury | `luxury lifestyle`, `rich life`, `expensive things` |
| motivation | `motivation speech`, `mindset edit`, `discipline shorts` |
| gym | `gym motivation`, `workout shorts`, `physique transformation` |
| anime | `anime edit`, `anime amv`, `anime fight scene` |
| football | `football skills`, `goals compilation`, `football edit` |
| ai | `ai tools`, `chatgpt`, `ai news`, `artificial intelligence shorts` |
| cinematic | `cinematic footage`, `4k cinematic`, `cinematography` |
| lifestyle | `morning routine`, `day in life`, `aesthetic vlog` |

---

## 8. Video Card Data Model

### Phase 1 (current — mock)
```ts
interface VideoItem {
  id: string
  title: string
  creator: string
  thumbnail: string
  viralScore: number       // 0–100
  growthPercent: number    // raw integer
  views: number
  niche: NicheId
  tags: string[]
  isExploding: boolean
  format: 'short' | 'clip' | 'reel'
  duration: number         // seconds
  savedCount: number
}
```

### Phase 3 additions (real YouTube data)
```ts
interface VideoItem {
  // ... all above, plus:
  youtubeId: string        // video ID for embed/link
  channelId: string
  publishedAt: string      // ISO date
  likeCount: number
  commentCount: number
  viewsAt24h: number       // views in first 24hrs (velocity signal)
  viewsAt72h: number
  fetchedAt: string        // when we last pulled data
}
```

### Viral score formula (Phase 3)
```
viralScore = weighted average of:
  - growth velocity (viewsAt24h / total views)   40%
  - absolute growth %                             30%
  - engagement rate (likes+comments / views)     20%
  - recency (decay for videos > 30 days old)     10%

Normalized to 0–100. isExploding = viralScore >= 90 AND growthPercent >= 1000
```

---

## 9. Future Supabase Schema

### Tables

```sql
-- Core video data
videos (
  id          uuid primary key default gen_random_uuid(),
  youtube_id  text unique not null,
  title       text not null,
  creator     text not null,
  channel_id  text not null,
  thumbnail   text not null,
  niche       text not null,         -- references niches.id
  tags        text[],
  format      text,                  -- 'short' | 'clip' | 'reel'
  duration    int,
  views       bigint,
  like_count  bigint,
  comment_count bigint,
  views_at_24h bigint,
  views_at_72h bigint,
  viral_score numeric(5,2),
  growth_percent numeric(10,2),
  is_exploding boolean default false,
  published_at timestamptz,
  fetched_at  timestamptz default now(),
  created_at  timestamptz default now()
)

-- Niche metadata
niches (
  id           text primary key,     -- 'cars', 'ai', etc.
  label        text not null,
  emoji        text,
  avg_viral_score numeric(5,2),
  weekly_growth   numeric(10,2),
  updated_at   timestamptz default now()
)

-- Users (auth handled by Supabase Auth)
profiles (
  id           uuid primary key references auth.users(id),
  email        text,
  display_name text,
  avatar_url   text,
  plan         text default 'free',  -- 'free' | 'pro'
  created_at   timestamptz default now()
)

-- Saved videos
saved_videos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id) on delete cascade,
  video_id   uuid references videos(id) on delete cascade,
  saved_at   timestamptz default now(),
  unique (user_id, video_id)
)

-- Niche subscriptions (for notifications, Phase 4)
niche_follows (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid references profiles(id) on delete cascade,
  niche_id text references niches(id),
  unique (user_id, niche_id)
)
```

### RLS policies
- `videos` — public read. No auth needed to browse.
- `profiles` — users can only read/write their own row.
- `saved_videos` — users can only read/write their own saves.
- `niche_follows` — users can only read/write their own follows.

### Indexes
```sql
create index on videos (niche);
create index on videos (viral_score desc);
create index on videos (growth_percent desc);
create index on videos (fetched_at desc);
create index on saved_videos (user_id);
```

---

## 10. Future YouTube API Flow

### Overview
YouTube Data API v3 — quota: 10,000 units/day free tier.
Search costs 100 units. Video details cost 1 unit each.
Strategy: search at night, cache in Supabase, serve from DB.

### Ingest pipeline (Phase 3)

```
Cron job (nightly, Vercel Cron or Supabase Edge Function)
  │
  ├── for each niche (10 niches × 3 keywords = 30 searches)
  │     ├── YouTube Search API (videoDuration=short, order=viewCount, 50 results)
  │     ├── filter: published within last 30 days
  │     └── collect video IDs
  │
  ├── deduplicate IDs against existing videos table
  │
  ├── YouTube Videos API (statistics + contentDetails) — batch 50 IDs per call
  │     └── extract: viewCount, likeCount, commentCount, duration
  │
  ├── compute viralScore for each video
  │     └── mark isExploding if score >= 90 AND growth >= 1000%
  │
  └── upsert into Supabase videos table
```

### Growth % calculation
```
1. First fetch: store views as baseline (views_at_24h)
2. Re-fetch 72h later: compute growth = (views_72h - views_24h) / views_24h * 100
3. Weekly re-fetch for active videos (viral_score > 70)
4. Archive videos older than 60 days with viral_score < 50
```

### API route structure
```
/api/videos          GET — paginated, filtered by niche/section
/api/videos/[id]     GET — single video with full metadata
/api/trends          GET — niche trend data (weekly growth, top videos)
/api/ingest          POST — protected, triggers YouTube ingest (cron only)
```

### Quota management
| Operation | Cost | Daily budget |
|-----------|------|-------------|
| Search (30 calls) | 100 units each = 3,000 | 3,000 |
| Video details (500 videos) | 1 unit each = 500 | 500 |
| Re-fetches (200 active) | 1 unit each = 200 | 200 |
| **Total** | | **~3,700 / 10,000** |

Leaves 6,300 units/day buffer for user-triggered searches (Phase 4).

---

## Execution Phases

| Phase | What | When to start |
|-------|------|--------------|
| **1** | Frontend + mock data | ✅ Done |
| **2** | Supabase auth + saved videos | After first user feedback |
| **3** | YouTube API ingest + real data | After Phase 2 ships |
| **4** | Niche deep-dive pages + trend analytics | After 100 users |
| **5** | Payments (Stripe) + Pro tier | After product-market fit signal |

---

## First Files to Create Next (Phase 2)

In order. Each file is small. No file exceeds ~80 lines.

```
1. src/lib/supabase/client.ts
   — createBrowserClient() using @supabase/ssr

2. src/lib/supabase/server.ts
   — createServerClient() using cookies (for Server Components)

3. src/lib/supabase/queries.ts
   — getSavedVideos(userId), saveVideo(), unsaveVideo()

4. src/hooks/useAuth.ts
   — useSession(), signIn(), signOut() wrappers

5. src/hooks/useSavedVideos.ts
   — local state + optimistic toggle + Supabase sync

6. src/components/auth/AuthModal.tsx
   — magic link email form, Google OAuth button

7. src/components/auth/UserMenu.tsx
   — avatar button, dropdown (Saved / Sign out)

8. src/components/video/SaveButton.tsx
   — heart/bookmark toggle with optimistic UI

9. src/app/auth/callback/route.ts
   — Supabase OAuth callback handler (5 lines)

10. src/app/auth/signin/page.tsx
    — full auth page wrapping AuthModal
```

### Environment variables needed
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     (server-only, never expose)
YOUTUBE_API_KEY=               (Phase 3 only)
```
