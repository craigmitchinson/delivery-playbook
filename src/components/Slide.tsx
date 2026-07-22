import type { ReactNode } from 'react'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'

interface SlideProps {
  /** Eyebrow text, right of the fixed "Delivery playbook" label. */
  kicker: string
  title: string
  /** One-line takeaway under the title — the thing the slide is arguing. */
  lead?: string
  /** Legend or key, pinned to the top right of the header. */
  legend?: ReactNode
  children: ReactNode
}

/**
 * The fixed 1920x1080 canvas every slide shares: header (kicker, title, lead,
 * legend), the rule, then the body. The body is a flex column that fills the
 * remaining height exactly, so slides size their content to the slide rather
 * than growing past it — nothing ever spills off a 16:9 frame.
 */
export function Slide({ kicker, title, lead, legend, children }: SlideProps) {
  const t = useTheme()

  return (
    <div
      className="slide-frame"
      style={{
        width: slide.width,
        height: slide.height,
        padding: slide.padding,
        background: t.paper,
        color: t.ink,
        boxShadow: t.shadow,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 28,
          minHeight: slide.headerHeight,
          flex: 'none',
        }}
      >
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: ty.slideKicker,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: t.inkSoft,
              marginBottom: 10,
            }}
          >
            Delivery playbook &middot; {kicker}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: ty.slideTitle,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h1>
          {lead && (
            <p
              style={{
                margin: '10px 0 0',
                fontSize: ty.body,
                lineHeight: 1.4,
                color: t.inkSoft,
                maxWidth: 1180,
              }}
            >
              {lead}
            </p>
          )}
        </div>
        {legend && <div style={{ flex: 'none', paddingTop: 4 }}>{legend}</div>}
      </header>

      <div
        style={{
          height: 3,
          background: t.rule,
          margin: '18px 0 20px',
          flex: 'none',
        }}
      />

      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
