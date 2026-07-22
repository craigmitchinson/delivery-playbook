// ---------------------------------------------------------------------------
// Brand theme tokens
// ---------------------------------------------------------------------------
// The canonical token source is @ccs/ui (imported first in main.tsx): wherever
// a value exists there, this file references var(--c-*) instead of a literal,
// so the suite cannot drift. The app sets data-theme on <html> in step with its
// own light/dark mode, so the vars always resolve to the right variant.
//
// The dark variant is the deck's own deep-teal print palette — deliberately the
// same artefact look as the QBR pack, so a Playbook slide and a QBR slide
// dropped into one PowerPoint read as a single family. Those values stay
// literal rather than var(--c-*) references.

import type { RaciValue, RoleKey, RouteKey } from './data/types'

export type Mode = 'light' | 'dark'

// Brand swatches, mapped onto the @ccs/ui token set (light values).
const swatch = {
  teal: 'var(--c-brand)', // #0B3239
  tealMid: 'var(--c-brand-mid)',
  red: 'var(--c-red)', // #E0432E
  paper: 'var(--c-bg)', // #FAF7F2
  white: 'var(--c-surface)',
  grey: 'var(--c-grey)',
  lightPink: 'var(--c-pink)',
  darkPink: 'var(--c-pink-mid)',
  lightPurple: 'var(--c-purple)',
  darkPurple: 'var(--c-purple-dk)',
  amber: 'var(--c-amber)',
  green: 'var(--c-green)',
} as const

// Shared type stacks from @ccs/ui (self-hosted via @ccs/ui/fonts.css).
export const fonts = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
  mono: 'var(--font-mono)',
} as const

// Fixed slide canvas. Never responds to viewport; a capture of .slide-frame at
// 2x yields a clean 3840x2160 PNG.
export const slide = {
  width: 1920,
  height: 1080,
  padding: 46,
  headerHeight: 104,
  gap: 16,
  radius: 14,
} as const

/** Per-role visual treatment. Roles are the constant across every slide, so
 *  one role keeps one colour in the spine, the swimlane and the RACI grid. */
export interface RoleStyle {
  /** Strong colour: rails, dots, lane headers. */
  key: string
  /** Tinted surface behind a lane or card. */
  surface: string
  /** Text on that surface. */
  text: string
  /** Faint band tint for alternating lane stripes. */
  band: string
}

export interface ThemeTokens {
  mode: Mode
  /** Neutral area around the slide. */
  page: string
  /** Slide background. */
  paper: string
  /** Raised card surface on the slide. */
  card: string
  /** Primary text. */
  ink: string
  /** Muted text (kickers, legends, meta). */
  inkSoft: string
  /** Secondary text that is de-emphasised but must still read at small sizes
   *  and on tinted surfaces (e.g. annotations). Stronger than inkSoft. */
  inkMuted: string
  /** Faint rules and hairlines. */
  inkFaint: string
  /** Accent red, emphasis only. */
  accent: string
  /** Strong rule under the title. */
  rule: string
  /** Soft rule below column headers. */
  ruleSoft: string
  /** Slide drop shadow. */
  shadow: string
  roles: Record<RoleKey, RoleStyle>
  raci: Record<RaciValue, { fill: string; text: string; border: string }>
  routes: Record<RouteKey, { fill: string; text: string }>
  /** Gate / decision emphasis. */
  gate: { fill: string; text: string; rail: string }
}

export const lightTheme: ThemeTokens = {
  mode: 'light',
  page: 'var(--c-panel-alt)',
  paper: swatch.paper,
  card: swatch.white,
  ink: swatch.teal,
  inkSoft: 'rgba(11,50,57,0.56)',
  inkMuted: 'rgba(11,50,57,0.72)',
  inkFaint: 'rgba(11,50,57,0.14)',
  accent: swatch.red,
  rule: swatch.teal,
  ruleSoft: 'rgba(11,50,57,0.15)',
  shadow: '0 24px 60px rgba(11,50,57,0.22)',
  roles: {
    biz: {
      key: swatch.darkPurple,
      surface: swatch.lightPurple,
      text: swatch.teal,
      band: 'rgba(106,91,168,0.06)',
    },
    po: {
      key: swatch.teal,
      surface: 'rgba(11,50,57,0.07)',
      text: swatch.teal,
      band: 'rgba(11,50,57,0.04)',
    },
    el: {
      key: '#B4476A',
      surface: swatch.lightPink,
      text: swatch.teal,
      band: 'rgba(180,71,106,0.05)',
    },
    eng: {
      key: 'var(--c-brand-soft)',
      surface: swatch.grey,
      text: swatch.teal,
      band: 'rgba(11,50,57,0.03)',
    },
    coe: {
      key: swatch.amber,
      surface: 'var(--c-warn-fill)',
      text: swatch.teal,
      band: 'rgba(181,118,43,0.06)',
    },
  },
  raci: {
    A: { fill: swatch.teal, text: swatch.paper, border: 'transparent' },
    R: { fill: swatch.darkPurple, text: '#FFFFFF', border: 'transparent' },
    C: { fill: 'transparent', text: swatch.teal, border: 'rgba(11,50,57,0.42)' },
    I: { fill: 'transparent', text: 'rgba(11,50,57,0.45)', border: 'transparent' },
  },
  routes: {
    ia: { fill: 'rgba(11,50,57,0.09)', text: swatch.teal },
    sa: { fill: 'var(--c-good-fill)', text: '#1F5C42' },
  },
  gate: { fill: 'var(--c-bad-fill)', text: '#8C2A1C', rail: swatch.red },
}

// Dark variant: the deck's print palette — a deep teal canvas with cream ink.
const darkInk = '#F4F1EB'
export const darkTheme: ThemeTokens = {
  mode: 'dark',
  page: '#071316',
  paper: '#0C2329',
  card: 'rgba(244,241,235,0.05)',
  ink: darkInk,
  inkSoft: 'rgba(244,241,235,0.58)',
  inkMuted: 'rgba(244,241,235,0.8)',
  inkFaint: 'rgba(244,241,235,0.16)',
  accent: '#FF6A4D',
  rule: 'rgba(244,241,235,0.85)',
  ruleSoft: 'rgba(244,241,235,0.18)',
  shadow: '0 24px 60px rgba(0,0,0,0.5)',
  roles: {
    biz: {
      key: '#C9B3F0',
      surface: 'rgba(201,179,240,0.15)',
      text: '#EFE7FF',
      band: 'rgba(201,179,240,0.07)',
    },
    po: {
      key: '#86C7BD',
      surface: 'rgba(134,199,189,0.13)',
      text: darkInk,
      band: 'rgba(134,199,189,0.06)',
    },
    el: {
      key: '#FFA8BE',
      surface: 'rgba(255,168,190,0.13)',
      text: '#FFE3EA',
      band: 'rgba(255,168,190,0.06)',
    },
    eng: {
      key: 'rgba(244,241,235,0.55)',
      surface: 'rgba(244,241,235,0.07)',
      text: darkInk,
      band: 'rgba(244,241,235,0.03)',
    },
    coe: {
      key: '#E0B45C',
      surface: 'rgba(224,180,92,0.14)',
      text: '#FFF0D4',
      band: 'rgba(224,180,92,0.06)',
    },
  },
  raci: {
    A: { fill: darkInk, text: '#0C2329', border: 'transparent' },
    R: { fill: '#C9B3F0', text: '#241A38', border: 'transparent' },
    C: { fill: 'transparent', text: darkInk, border: 'rgba(244,241,235,0.5)' },
    I: { fill: 'transparent', text: 'rgba(244,241,235,0.42)', border: 'transparent' },
  },
  routes: {
    ia: { fill: 'rgba(244,241,235,0.1)', text: darkInk },
    sa: { fill: 'rgba(134,199,189,0.16)', text: '#B6E3DA' },
  },
  gate: { fill: 'rgba(255,106,77,0.16)', text: '#FFC3B2', rail: '#FF6A4D' },
}

export const themes: Record<Mode, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
}

// Typographic scale (px on the 1920x1080 canvas). Nothing on a slide goes below
// `meta` — a projected deck has to read from the back of the room.
export const type = {
  slideTitle: 36,
  slideKicker: 14,
  sectionHead: 16,
  momentName: 20,
  cardTitle: 17,
  body: 15,
  meta: 13.5,
  chip: 12.5,
} as const
