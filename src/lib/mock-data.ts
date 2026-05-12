import type { VideoItem, Niche, FeedSectionConfig, NicheId } from '@/types'

// Dark-page style thumbnails — dramatic, cinematic, high-contrast
const THUMBS = [
  // 0 — cinematic car dark night
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=480&h=640&fit=crop&q=85',
  // 1 — luxury dark interior close
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=480&h=640&fit=crop&q=85',
  // 2 — gym dark dramatic
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&h=640&fit=crop&q=85',
  // 3 — neon purple abstract
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=640&fit=crop&q=85',
  // 4 — cinematic neon city rain
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=480&h=640&fit=crop&q=85',
  // 5 — dark editorial portrait
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=640&fit=crop&q=85',
  // 6 — anime/dark aesthetic
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=640&fit=crop&q=85',
  // 7 — dramatic portrait close-up
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&h=640&fit=crop&q=85',
  // 8 — stadium lights dramatic
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=480&h=640&fit=crop&q=85',
  // 9 — AI/futuristic robot
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&h=640&fit=crop&q=85',
  // 10 — gym physique dark
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=480&h=640&fit=crop&q=85',
  // 11 — luxury watch dark
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=480&h=640&fit=crop&q=85',
  // 12 — dramatic Porsche cinematic
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=480&h=640&fit=crop&q=85',
  // 13 — tech dark earth from space
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&h=640&fit=crop&q=85',
  // 14 — dark concert/music energy
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=480&h=640&fit=crop&q=85',
  // 15 — lifestyle cinematic
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=480&h=640&fit=crop&q=85',
  // 16 — gym weights dark
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=480&h=640&fit=crop&q=85',
  // 17 — abstract dark art
  'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=480&h=640&fit=crop&q=85',
  // 18 — cinematic landscape dark
  'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=480&h=640&fit=crop&q=85',
  // 19 — neon city night
  'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=480&h=640&fit=crop&q=85',
]

const t = (i: number) => THUMBS[i % THUMBS.length]

export const MOCK_VIDEOS: VideoItem[] = [
  // ── CARS ──────────────────────────────────────────────────────────────────
  {
    id: 'v001', title: 'Lamborghini Revuelto vs Ferrari SF90 — Night Race',
    creator: '@darkspeedz', thumbnail: t(0),
    viralScore: 97, growthPercent: 1240, views: 8_400_000,
    niche: 'cars', tags: ['lamborghini', 'ferrari', 'race', 'night'],
    isExploding: true, format: 'short', duration: 58, savedCount: 4200,
    meta: { postedAgo: '17m ago', trendingIn: 'USA', velocity: '+840% in 3h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v002', title: 'Rolls Royce Spectre — Pure Silence POV Drive',
    creator: '@luxcardrops', thumbnail: t(1),
    viralScore: 88, growthPercent: 620, views: 3_100_000,
    niche: 'cars', tags: ['rolls royce', 'electric', 'luxury', 'pov'],
    isExploding: false, format: 'clip', duration: 45, savedCount: 1800,
    meta: { postedAgo: '4h ago', trendingIn: 'UAE', badge: 'TOP PAGES' },
  },
  {
    id: 'v003', title: 'GT3 RS Onboard Nürburgring — 7:04 Record',
    creator: '@trackaddicts', thumbnail: t(12),
    viralScore: 92, growthPercent: 890, views: 5_700_000,
    niche: 'cars', tags: ['porsche', 'nurburgring', 'laptime', 'gt3'],
    isExploding: true, format: 'short', duration: 60, savedCount: 3100,
    meta: { postedAgo: '1h ago', trendingIn: 'DE', velocity: '+420% in 1h', badge: 'HIGH REPLAY' },
  },

  // ── LUXURY ────────────────────────────────────────────────────────────────
  {
    id: 'v004', title: 'Patek Philippe Ref 5711 — Unboxing at 2AM',
    creator: '@vaultcollector', thumbnail: t(11),
    viralScore: 94, growthPercent: 2100, views: 12_000_000,
    niche: 'luxury', tags: ['patek', 'watch', 'unboxing', 'wealth'],
    isExploding: true, format: 'short', duration: 59, savedCount: 8900,
    meta: { postedAgo: '23m ago', trendingIn: 'GLOBAL', velocity: '+2,100% in 6h', badge: 'TOP PAGES' },
  },
  {
    id: 'v005', title: 'Inside a $45M Dubai Penthouse — Full Tour',
    creator: '@luxrealstate', thumbnail: t(1),
    viralScore: 91, growthPercent: 780, views: 7_200_000,
    niche: 'luxury', tags: ['dubai', 'penthouse', 'real estate', 'mansion'],
    isExploding: false, format: 'reel', duration: 52, savedCount: 2700,
    meta: { postedAgo: '3h ago', trendingIn: 'UAE', badge: 'LOW COMP' },
  },
  {
    id: 'v006', title: 'Hermès Birkin 35 — Authentication Deep Dive',
    creator: '@silentwealth', thumbnail: t(11),
    viralScore: 86, growthPercent: 430, views: 2_900_000,
    niche: 'luxury', tags: ['hermes', 'birkin', 'fashion', 'authentication'],
    isExploding: false, format: 'clip', duration: 47, savedCount: 1100,
    meta: { postedAgo: '6h ago', trendingIn: 'FR', badge: 'HIGH REPLAY' },
  },

  // ── GYM ───────────────────────────────────────────────────────────────────
  {
    id: 'v007', title: 'Raw 405 Deadlift — No Shoes No Belt No Excuses',
    creator: '@ironmonkz', thumbnail: t(16),
    viralScore: 95, growthPercent: 1680, views: 9_800_000,
    niche: 'gym', tags: ['deadlift', 'powerlifting', 'raw', 'strength'],
    isExploding: true, format: 'short', duration: 32, savedCount: 5600,
    meta: { postedAgo: '31m ago', trendingIn: 'USA', velocity: '+1,200% in 4h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v008', title: '5AM Gym Routine — When Everyone Is Sleeping',
    creator: '@5amclub', thumbnail: t(2),
    viralScore: 89, growthPercent: 940, views: 4_400_000,
    niche: 'gym', tags: ['5am', 'routine', 'discipline', 'motivation'],
    isExploding: false, format: 'short', duration: 55, savedCount: 2300,
    meta: { postedAgo: '2h ago', trendingIn: 'GLOBAL', badge: 'TOP PAGES' },
  },
  {
    id: 'v009', title: '6 Months Natural Transformation — Side by Side',
    creator: '@leanseason', thumbnail: t(10),
    viralScore: 93, growthPercent: 1100, views: 6_600_000,
    niche: 'gym', tags: ['transformation', 'natural', 'physique', 'bulk'],
    isExploding: true, format: 'short', duration: 58, savedCount: 4000,
    meta: { postedAgo: '45m ago', trendingIn: 'BR', velocity: '+760% in 5h', badge: 'HIGH REPLAY' },
  },

  // ── MOTIVATION ────────────────────────────────────────────────────────────
  {
    id: 'v010', title: 'Alex Hormozi — The 3 Years Before Everything Changed',
    creator: '@hormoziedits', thumbnail: t(5),
    viralScore: 99, growthPercent: 3400, views: 22_000_000,
    niche: 'motivation', tags: ['hormozi', 'business', 'mindset', 'grind'],
    isExploding: true, format: 'clip', duration: 59, savedCount: 14000,
    meta: { postedAgo: '8m ago', trendingIn: 'GLOBAL', velocity: '+3,400% in 2h', badge: 'TOP PAGES' },
  },
  {
    id: 'v011', title: 'Goggins — Why Most People Will Never Be Great',
    creator: '@gogginsedits', thumbnail: t(7),
    viralScore: 96, growthPercent: 2200, views: 15_000_000,
    niche: 'motivation', tags: ['goggins', 'mindset', 'navy seal', 'hardship'],
    isExploding: true, format: 'clip', duration: 57, savedCount: 9800,
    meta: { postedAgo: '19m ago', trendingIn: 'USA', velocity: '+1,800% in 3h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v012', title: 'Silent Discipline Montage — Dark Aesthetic Edit',
    creator: '@silentgrind', thumbnail: t(6),
    viralScore: 90, growthPercent: 760, views: 4_100_000,
    niche: 'motivation', tags: ['discipline', 'aesthetic', 'dark', 'silent'],
    isExploding: false, format: 'reel', duration: 44, savedCount: 2100,
    meta: { postedAgo: '5h ago', trendingIn: 'BR', badge: 'LOW COMP' },
  },

  // ── ANIME ─────────────────────────────────────────────────────────────────
  {
    id: 'v013', title: 'Gojo vs Sukuna — AMV Edit 4K Cinematic',
    creator: '@jjkedits', thumbnail: t(6),
    viralScore: 98, growthPercent: 2800, views: 18_000_000,
    niche: 'anime', tags: ['jjk', 'gojo', 'sukuna', 'amv', 'cinematic'],
    isExploding: true, format: 'short', duration: 55, savedCount: 11200,
    meta: { postedAgo: '12m ago', trendingIn: 'GLOBAL', velocity: '+2,500% in 2h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v014', title: 'Solo Leveling OP — Full Awakening Scene Breakdown',
    creator: '@sololevel_', thumbnail: t(17),
    viralScore: 93, growthPercent: 1350, views: 8_900_000,
    niche: 'anime', tags: ['solo leveling', 'sung jinwoo', 'breakdown', 'scene'],
    isExploding: false, format: 'clip', duration: 59, savedCount: 5300,
    meta: { postedAgo: '3h ago', trendingIn: 'JP', badge: 'TOP PAGES' },
  },
  {
    id: 'v015', title: 'Demon Slayer — Every Breath Style Ranked & Explained',
    creator: '@hashirarank', thumbnail: t(4),
    viralScore: 87, growthPercent: 580, views: 3_300_000,
    niche: 'anime', tags: ['demon slayer', 'hashira', 'breathing', 'ranking'],
    isExploding: false, format: 'short', duration: 60, savedCount: 1600,
    meta: { postedAgo: '7h ago', trendingIn: 'KR', badge: 'LOW COMP' },
  },

  // ── FOOTBALL ──────────────────────────────────────────────────────────────
  {
    id: 'v016', title: 'Mbappé First Real Madrid Goal — Full Crowd Reaction',
    creator: '@rmcfedits', thumbnail: t(8),
    viralScore: 97, growthPercent: 4100, views: 28_000_000,
    niche: 'football', tags: ['mbappe', 'real madrid', 'goal', 'laliga'],
    isExploding: true, format: 'clip', duration: 58, savedCount: 18000,
    meta: { postedAgo: '6m ago', trendingIn: 'GLOBAL', velocity: '+4,100% in 1h', badge: 'TOP PAGES' },
  },
  {
    id: 'v017', title: 'Vini Jr Skills Reel — Most Unguardable Dribbles 2024',
    creator: '@vinskillz', thumbnail: t(8),
    viralScore: 91, growthPercent: 870, views: 5_500_000,
    niche: 'football', tags: ['vinicius', 'skills', 'dribbling', 'balondor'],
    isExploding: false, format: 'short', duration: 53, savedCount: 2900,
    meta: { postedAgo: '2h ago', trendingIn: 'BR', badge: 'LOW COMP' },
  },

  // ── AI ────────────────────────────────────────────────────────────────────
  {
    id: 'v018', title: 'GPT-5 Released — Every New Feature in 60 Seconds',
    creator: '@aibreakdown', thumbnail: t(9),
    viralScore: 99, growthPercent: 5200, views: 35_000_000,
    niche: 'ai', tags: ['gpt5', 'openai', 'ai', 'release', 'breakdown'],
    isExploding: true, format: 'short', duration: 60, savedCount: 22000,
    meta: { postedAgo: '9m ago', trendingIn: 'GLOBAL', velocity: '+5,200% in 2h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v019', title: 'Midjourney v7 vs DALL-E 4 — Side by Side Compare',
    creator: '@aibattle_', thumbnail: t(17),
    viralScore: 94, growthPercent: 1900, views: 11_000_000,
    niche: 'ai', tags: ['midjourney', 'dalle', 'comparison', 'image ai'],
    isExploding: true, format: 'clip', duration: 57, savedCount: 7400,
    meta: { postedAgo: '34m ago', trendingIn: 'USA', velocity: '+1,400% in 3h', badge: 'TOP PAGES' },
  },
  {
    id: 'v020', title: 'Sora AI — Things That Look Impossible But Are AI',
    creator: '@soraclips', thumbnail: t(13),
    viralScore: 96, growthPercent: 2700, views: 16_000_000,
    niche: 'ai', tags: ['sora', 'openai', 'video ai', 'impossible'],
    isExploding: true, format: 'short', duration: 45, savedCount: 10300,
    meta: { postedAgo: '21m ago', trendingIn: 'GLOBAL', velocity: '+2,200% in 2h', badge: 'HIGH REPLAY' },
  },

  // ── CINEMATIC ─────────────────────────────────────────────────────────────
  {
    id: 'v021', title: 'Tokyo Rain — 4K Cinematic Walk No Music No Talking',
    creator: '@cinemawander', thumbnail: t(4),
    viralScore: 92, growthPercent: 1100, views: 7_800_000,
    niche: 'cinematic', tags: ['tokyo', 'rain', '4k', 'ambient', 'walking'],
    isExploding: false, format: 'short', duration: 59, savedCount: 4700,
    meta: { postedAgo: '5h ago', trendingIn: 'JP', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v022', title: 'Anamorphic Flares — The Tutorial That Changes Everything',
    creator: '@lenscraft', thumbnail: t(19),
    viralScore: 88, growthPercent: 720, views: 3_900_000,
    niche: 'cinematic', tags: ['anamorphic', 'lensflare', 'tutorial', 'cinematography'],
    isExploding: false, format: 'clip', duration: 54, savedCount: 2200,
    meta: { postedAgo: '8h ago', trendingIn: 'USA', badge: 'LOW COMP' },
  },
  {
    id: 'v023', title: 'Dubai Dawn — Phantom Camera Slowmo 1000fps',
    creator: '@phantomshots', thumbnail: t(19),
    viralScore: 95, growthPercent: 1500, views: 9_200_000,
    niche: 'cinematic', tags: ['dubai', 'slowmo', 'phantom', 'sunrise', '4k'],
    isExploding: true, format: 'short', duration: 47, savedCount: 5800,
    meta: { postedAgo: '52m ago', trendingIn: 'UAE', velocity: '+980% in 4h', badge: 'HIGH REPLAY' },
  },

  // ── ASMR ──────────────────────────────────────────────────────────────────
  {
    id: 'v024', title: 'Kinetic Sand Cutting — Oddly Satisfying 4K',
    creator: '@tinglestherapy', thumbnail: t(3),
    viralScore: 85, growthPercent: 340, views: 2_100_000,
    niche: 'asmr', tags: ['asmr', 'kinetic sand', 'satisfying', 'sleep'],
    isExploding: false, format: 'reel', duration: 60, savedCount: 890,
    meta: { postedAgo: '11h ago', trendingIn: 'USA', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v025', title: 'Soap Cutting ASMR — Most Satisfying Sounds Only',
    creator: '@soapasmr', thumbnail: t(3),
    viralScore: 91, growthPercent: 980, views: 6_200_000,
    niche: 'asmr', tags: ['soap cutting', 'satisfying', 'asmr', 'oddly'],
    isExploding: true, format: 'short', duration: 52, savedCount: 3300,
    meta: { postedAgo: '1h ago', trendingIn: 'BR', velocity: '+680% in 5h', badge: 'HIGH REPLAY' },
  },

  // ── LIFESTYLE ─────────────────────────────────────────────────────────────
  {
    id: 'v026', title: '6AM Morning Routine — Wealthy Minimalist Edition',
    creator: '@quietluxury', thumbnail: t(15),
    viralScore: 90, growthPercent: 860, views: 4_800_000,
    niche: 'lifestyle', tags: ['morning routine', 'minimalist', 'wellness', 'luxury'],
    isExploding: false, format: 'short', duration: 58, savedCount: 2600,
    meta: { postedAgo: '3h ago', trendingIn: 'USA', badge: 'TOP PAGES' },
  },
  {
    id: 'v027', title: 'NYC $12K/Month Apartment Tour — Is It Worth It?',
    creator: '@nycdailylife', thumbnail: t(7),
    viralScore: 93, growthPercent: 1280, views: 8_100_000,
    niche: 'lifestyle', tags: ['nyc', 'apartment', 'tour', 'real estate', 'manhattan'],
    isExploding: true, format: 'reel', duration: 59, savedCount: 5100,
    meta: { postedAgo: '41m ago', trendingIn: 'USA', velocity: '+960% in 4h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v028', title: 'Aesthetic Winter Morning — No Alarm, No Rush, No Noise',
    creator: '@slowseason', thumbnail: t(18),
    viralScore: 86, growthPercent: 490, views: 2_600_000,
    niche: 'lifestyle', tags: ['winter', 'morning', 'aesthetic', 'cozy', 'calm'],
    isExploding: false, format: 'clip', duration: 41, savedCount: 1200,
    meta: { postedAgo: '9h ago', trendingIn: 'CA', badge: 'LOW COMP' },
  },

  // ── HIGH-PERFORMANCE ──────────────────────────────────────────────────────
  {
    id: 'v029', title: 'Bugatti Tourbillon — Design Process Fully Revealed',
    creator: '@bugattiofficial_fan', thumbnail: t(0),
    viralScore: 96, growthPercent: 1780, views: 10_500_000,
    niche: 'cars', tags: ['bugatti', 'design', 'hypercar', 'tourbillon'],
    isExploding: true, format: 'short', duration: 55, savedCount: 6700,
    meta: { postedAgo: '28m ago', trendingIn: 'GLOBAL', velocity: '+1,400% in 3h', badge: 'HIGH REPLAY' },
  },
  {
    id: 'v030', title: 'Cursor AI — Coding at 10x Speed Live Demo',
    creator: '@devtools', thumbnail: t(13),
    viralScore: 97, growthPercent: 3100, views: 19_000_000,
    niche: 'ai', tags: ['cursor', 'coding', 'ai', 'developer', 'vscode'],
    isExploding: true, format: 'clip', duration: 60, savedCount: 13400,
    meta: { postedAgo: '14m ago', trendingIn: 'GLOBAL', velocity: '+2,800% in 2h', badge: 'TOP PAGES' },
  },
  {
    id: 'v031', title: 'Jiu Jitsu Flow — No Music, Just Movement and Silence',
    creator: '@bjjcinema', thumbnail: t(10),
    viralScore: 88, growthPercent: 670, views: 3_500_000,
    niche: 'gym', tags: ['bjj', 'jiujitsu', 'flow', 'martial arts', 'cinematic'],
    isExploding: false, format: 'short', duration: 49, savedCount: 1700,
    meta: { postedAgo: '6h ago', trendingIn: 'BR', badge: 'LOW COMP' },
  },
  {
    id: 'v032', title: 'Champions League Final — Best Atmosphere Ever Recorded',
    creator: '@ucledit', thumbnail: t(8),
    viralScore: 98, growthPercent: 3800, views: 24_000_000,
    niche: 'football', tags: ['champions league', 'final', 'atmosphere', 'tifo'],
    isExploding: true, format: 'clip', duration: 58, savedCount: 15600,
    meta: { postedAgo: '11m ago', trendingIn: 'GLOBAL', velocity: '+3,800% in 1h', badge: 'TOP PAGES' },
  },
]

export const NICHES: Niche[] = [
  { id: 'all',        label: 'All'        },
  { id: 'asmr',       label: 'ASMR'       },
  { id: 'cars',       label: 'Cars'        },
  { id: 'luxury',     label: 'Luxury'      },
  { id: 'motivation', label: 'Motivation'  },
  { id: 'gym',        label: 'Gym'         },
  { id: 'anime',      label: 'Anime'       },
  { id: 'football',   label: 'Football'    },
  { id: 'ai',         label: 'AI'          },
  { id: 'cinematic',  label: 'Cinematic'   },
  { id: 'lifestyle',  label: 'Lifestyle'   },
]

export const FEED_SECTIONS: FeedSectionConfig[] = [
  {
    id: 'exploding',
    title: 'Live Signals',
    filter: (v) => v.filter((x) => x.isExploding).sort((a, b) => b.growthPercent - a.growthPercent),
  },
  {
    id: 'fastest',
    title: 'Fastest Growth',
    filter: (v) => [...v].sort((a, b) => b.growthPercent - a.growthPercent).slice(0, 10),
  },
  {
    id: 'low-comp',
    title: 'Low Competition',
    filter: (v) => v.filter((x) => x.viralScore >= 85 && x.views < 5_000_000).sort((a, b) => b.viralScore - a.viralScore),
  },
  {
    id: 'high-replay',
    title: 'High Replay',
    filter: (v) => v.filter((x) => x.duration <= 55).sort((a, b) => b.savedCount - a.savedCount),
  },
  {
    id: 'top-saved',
    title: 'Most Saved',
    filter: (v) => [...v].sort((a, b) => b.savedCount - a.savedCount).slice(0, 10),
  },
]
