import type { CSSProperties, ReactNode } from 'react'
import { ROLES } from '../data/playbook'
import type { RaciValue, RoleKey, RouteKey } from '../data/types'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'

export const roleName = (k: RoleKey) => ROLES.find((r) => r.key === k)?.name ?? k
export const roleShort: Record<RoleKey, string> = {
  biz: 'Business',
  po: 'Product Owner',
  el: 'Eng Lead',
  eng: 'Engineers',
  coe: 'CoE',
}

/** A titled block on the slide. Carries data-spot so Spotlight can lift it. */
export function Panel({
  title,
  right,
  children,
  style,
  spot = true,
}: {
  title?: string
  right?: ReactNode
  children: ReactNode
  style?: CSSProperties
  spot?: boolean
}) {
  const t = useTheme()
  return (
    <section
      {...(spot ? { 'data-spot': '' } : {})}
      style={{
        background: t.card,
        border: `1px solid ${t.inkFaint}`,
        borderRadius: slide.radius,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginBottom: 12,
            flex: 'none',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: ty.sectionHead - 3,
              letterSpacing: '0.11em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: t.inkSoft,
            }}
          >
            {title}
          </h2>
          <span style={{ flex: 1 }} />
          {right}
        </div>
      )}
      <div style={{ flex: '1 1 auto', minHeight: 0 }}>{children}</div>
    </section>
  )
}

/** RACI chip. Never colour alone — the letter always carries the meaning. */
export function RaciChip({ value, size = 30 }: { value: RaciValue; size?: number }) {
  const t = useTheme()
  const s = t.raci[value]
  return (
    <span
      title={RACI_FULL[value]}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 8,
        background: s.fill,
        color: s.text,
        border: `1.5px solid ${s.border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: size * 0.45,
        fontWeight: 700,
      }}
    >
      {value}
    </span>
  )
}

export const RACI_FULL: Record<RaciValue, string> = {
  A: 'Accountable',
  R: 'Responsible',
  C: 'Consulted',
  I: 'Informed',
}

/** Route tag — IA or SA. */
export function RouteTag({ route }: { route: RouteKey }) {
  const t = useTheme()
  const s = t.routes[route]
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.fill,
        color: s.text,
        fontFamily: 'var(--font-mono)',
        fontSize: ty.chip - 1,
        fontWeight: 700,
        letterSpacing: '0.08em',
        padding: '3px 7px',
        borderRadius: 5,
      }}
    >
      {route.toUpperCase()}
    </span>
  )
}

/** A small role-coloured dot + label, so a lane is never colour-only. */
export function RoleTag({ role, label }: { role: RoleKey; label?: string }) {
  const t = useTheme()
  const s = t.roles[role]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: ty.meta,
        color: t.inkSoft,
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 3,
          background: s.key,
          flex: 'none',
        }}
      />
      {label ?? roleShort[role]}
    </span>
  )
}

/** Uppercase mono micro-label used above small groups. */
export function MicroLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const t = useTheme()
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: ty.chip - 1,
        letterSpacing: '0.11em',
        textTransform: 'uppercase',
        color: t.inkSoft,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Gate marker — a CoE approval point. */
export function GateBadge({ children }: { children: ReactNode }) {
  const t = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: t.gate.fill,
        color: t.gate.text,
        borderLeft: `3px solid ${t.gate.rail}`,
        fontSize: ty.chip,
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: '3px 6px 6px 3px',
      }}
    >
      {children}
    </span>
  )
}

/** Horizontal legend row for the slide header. */
export function Legend({ items }: { items: { swatch: string; label: string }[] }) {
  const t = useTheme()
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', maxWidth: 560 }}>
      {items.map((i) => (
        <span
          key={i.label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: ty.meta,
            color: t.inkSoft,
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              background: i.swatch,
              flex: 'none',
            }}
          />
          {i.label}
        </span>
      ))}
    </div>
  )
}
