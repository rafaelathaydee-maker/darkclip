/**
 * Curated visual asset pools — one set per niche.
 *
 * These are high-quality Unsplash portrait images (480×640) used as
 * the primary visual for every video card, regardless of source.
 *
 * YouTube provides the signal (title, creator, views, viral score).
 * This file provides the premium visual experience.
 *
 * All images use Unsplash Source API with consistent portrait crop params:
 *   ?w=480&h=640&fit=crop&crop=entropy&q=90
 */

export const NICHE_VISUAL_POOLS: Record<string, string[]> = {
  cars: [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  luxury: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  asmr: [
    'https://images.unsplash.com/photo-1558618047-f4e60cef3a70?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1511737296789-a09a0f2e39a0?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  motivation: [
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  anime: [
    'https://images.unsplash.com/photo-1607604276583-eef5d176d035?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1590654268033-27d6c3e8b1ef?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  football: [
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1551958219-acbc595b04d7?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  ai: [
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1675557009875-dfe8b7c4c2d2?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1676573187516-5f1dc64c6d53?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  cinematic: [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],

  lifestyle: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=480&h=640&fit=crop&crop=entropy&q=90',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=480&h=640&fit=crop&crop=entropy&q=90',
  ],
}

/** Fallback pool used when a niche has no pool entry */
const DEFAULT_POOL: string[] = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&h=640&fit=crop&crop=entropy&q=90',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&h=640&fit=crop&crop=entropy&q=90',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&h=640&fit=crop&crop=entropy&q=90',
]

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Deterministically picks a portrait thumbnail for a given niche + seed string.
 * Same video always gets the same image — no flicker on re-render.
 *
 * seed is typically the video ID.
 */
export function getNicheThumbnail(niche: string, seed: string): string {
  const pool = NICHE_VISUAL_POOLS[niche] ?? DEFAULT_POOL
  const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return pool[hash % pool.length]
}

/**
 * Returns an alternate image from the same niche pool — used as the first
 * onError fallback. Picks the next slot after the primary choice.
 */
export function getAlternateThumbnail(niche: string, seed: string, offset = 1): string {
  const pool = NICHE_VISUAL_POOLS[niche] ?? DEFAULT_POOL
  const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return pool[(hash + offset) % pool.length]
}
