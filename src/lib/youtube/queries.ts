import type { NicheId } from '@/types'

/**
 * One primary search query per niche.
 * Intentionally minimal — one query per niche keeps quota predictable.
 * `all` is excluded: it's computed by combining every other niche.
 */
export const NICHE_QUERIES: Partial<Record<NicheId, string>> = {
  asmr:       'asmr shorts satisfying no talking',
  cars:       'supercar cinematic edit shorts',
  luxury:     'luxury lifestyle billionaire shorts',
  motivation: 'motivation mindset discipline shorts',
  gym:        'gym aesthetic workout motivation shorts',
  anime:      'anime edit transition shorts',
  football:   'football skills edit shorts',
  ai:         'ai tools technology shorts 2024',
  cinematic:  'cinematic short film edit',
  lifestyle:  'aesthetic lifestyle vlog morning routine shorts',
}

export const NICHE_IDS = Object.keys(NICHE_QUERIES) as NicheId[]
