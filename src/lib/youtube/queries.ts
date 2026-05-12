import type { NicheId } from '@/types'

/**
 * Search queries per niche — optimised for YouTube Shorts relevance.
 *
 * Strategy:
 *   - Include "#shorts" in the query (creators tag their Shorts with it)
 *   - Use niche-defining keywords that surface high-engagement content
 *   - Avoid overly generic terms that pull in non-Shorts content
 *   - `all` is excluded: it's computed by merging all other niches
 */
export const NICHE_QUERIES: Partial<Record<NicheId, string>> = {
  asmr:       'asmr satisfying sounds relaxing #shorts',
  cars:       'supercar hypercar cinematic driving #shorts',
  luxury:     'luxury lifestyle billionaire rich #shorts',
  motivation: 'motivation mindset discipline hustle #shorts',
  gym:        'gym workout physique aesthetic #shorts',
  anime:      'anime edit amv cinematic 4k #shorts',
  football:   'football soccer skills goals highlights #shorts',
  ai:         'ai tools artificial intelligence productivity #shorts',
  cinematic:  'cinematic video edit short film #shorts',
  lifestyle:  'aesthetic lifestyle morning routine vlog #shorts',
}

export const NICHE_IDS = Object.keys(NICHE_QUERIES) as NicheId[]
