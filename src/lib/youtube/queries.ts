import type { NicheId } from '@/types'

/**
 * Multiple search queries per niche — tried in order.
 *
 * Strategy:
 *   - If query[0] returns < MIN_VIDEOS_PER_NICHE results, try query[1], and so on.
 *   - Queries are ordered from most specific (likely to return Shorts) to broadest.
 *   - Later queries intentionally broader so they succeed even without #shorts tag.
 *   - `all` is excluded — computed by merging every other niche.
 */
export const NICHE_QUERIES: Partial<Record<NicheId, string[]>> = {
  asmr: [
    'asmr shorts',
    'satisfying asmr shorts',
    'soap cutting asmr',
    'keyboard asmr shorts',
    'relaxing sounds shorts',
    'oddly satisfying shorts',
  ],

  cars: [
    'supercar edit shorts',
    'car edit shorts',
    'bmw edit shorts',
    'porsche edit shorts',
    'jdm edit shorts',
  ],

  luxury: [
    'luxury lifestyle shorts',
    'millionaire lifestyle shorts',
    'billionaire lifestyle shorts',
    'expensive cars lifestyle',
    'luxury motivation shorts',
  ],

  motivation: [
    'motivation shorts',
    'discipline motivation shorts',
    'mindset shorts',
    'success motivation shorts',
  ],

  gym: [
    'gym motivation shorts',
    'fitness edit shorts',
    'workout motivation shorts',
    'bodybuilding shorts',
  ],

  anime: [
    'anime edit shorts',
    'gojo edit shorts',
    'anime transition shorts',
    'anime amv shorts',
  ],

  football: [
    'football edit shorts',
    'soccer skills shorts',
    'football moments shorts',
    'champions league shorts',
  ],

  ai: [
    'ai tools shorts',
    'artificial intelligence shorts',
    'chatgpt shorts',
    'ai video shorts',
  ],

  cinematic: [
    'cinematic edit shorts',
    'movie edit shorts',
    'cinematic b roll shorts',
    'dark aesthetic shorts',
  ],

  lifestyle: [
    'lifestyle aesthetic shorts',
    'daily vlog aesthetic shorts',
    'morning routine shorts',
    'aesthetic life shorts',
  ],
}

/** Ordered list of all niche IDs (excludes 'all') */
export const NICHE_IDS = Object.keys(NICHE_QUERIES) as NicheId[]

/** Minimum real-video count before we stop trying more queries for a niche */
export const MIN_VIDEOS_PER_NICHE = 6

/** Maximum API calls per niche per cache miss (quota protection) */
export const MAX_QUERIES_PER_NICHE = 3
