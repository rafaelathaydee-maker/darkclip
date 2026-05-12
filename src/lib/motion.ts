import type { Variants, Transition } from 'framer-motion'

// Custom easing curves — Emil Kowalski approach
export const ease = {
  out: [0.23, 1, 0.32, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
}

// Shared transitions
export const transition = {
  fast: { duration: 0.18, ease: ease.out } satisfies Transition,
  standard: { duration: 0.25, ease: ease.out } satisfies Transition,
  slow: { duration: 0.35, ease: ease.out } satisfies Transition,
  spring: { type: 'spring', duration: 0.35, bounce: 0.15 } satisfies Transition,
}

// Card entrance — staggered in rows
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: ease.out },
  },
}

// Section header slide-in
export const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: ease.out },
  },
}

// Stagger container for rows
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
}

// Fade in (for full sections on scroll)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: ease.out },
  },
}

// VideoCard hover panel slide up
export const panelVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.22, ease: ease.out },
  },
}

// Navbar slide down on mount
export const navbarVariants: Variants = {
  hidden: { y: -60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: ease.out, delay: 0.1 },
  },
}
