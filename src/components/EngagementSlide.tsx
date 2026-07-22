import { useState } from 'react'
import {
  ENGAGEMENT_CHANNEL,
  ENGAGEMENT_OWNER,
  ENGAGEMENT_RULES,
  ENGAGEMENT_SECTIONS,
  ENGAGEMENT_WHEN,
} from '../data/playbook'
import { copyPostToClipboard } from '../engagement-post'
import { useFlow } from '../flow-context'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { Legend, MicroLabel, Panel } from './primitives'
import { Slide } from './Slide'

// Deck-wide spacing scale. PAD is the internal padding of a panel, CARD_PAD the
// internal padding of a card inside one, GAP the space between panels and rows.
const PAD = '16px 18px'
const CARD_PAD = '10px 16px'
const GAP = slide.gap
/** Height of the two instruction cards at the top of the body. */
const HEAD_H = 60

/** Splits a template line on its [bracketed] placeholders, keeping them. */
const PLACEHOLDER = /(\[[^\]]+\])/g

/**
 * A literal line of the pinned post. Everything that has to be filled in before
 * the post goes up is tinted, so the blanks are visible from the back of the room.
 */
function TemplateLine({ text, size = ty.meta }: { text: string; size?: number }) {
  const t = useTheme()
  return (
    <span style={{ fontSize: size, lineHeight: 1.35, color: t.ink }}>
      {text.split(PLACEHOLDER).map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span
            key={i}
            style={{
              background: t.gate.fill,
              color: t.accent,
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  )
}

/**
 * Copies the pinned post to the clipboard for pasting into Teams. Carries the
 * `copy-post` class so it is hidden during the PPTX capture (a live control has
 * no place in a static slide image).
 */
function CopyPostButton() {
  const t = useTheme()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const ok = await copyPostToClipboard()
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      className="copy-post"
      onClick={onCopy}
      title="Copy the pinned post to paste into Teams. The bracketed fields are filled in there."
      style={{
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: ty.chip,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: copied ? t.paper : t.roles.po.key,
        background: copied ? t.roles.po.key : 'transparent',
        border: `1px solid ${t.roles.po.key}`,
        borderRadius: 7,
        padding: '5px 11px',
        cursor: 'pointer',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {copied ? (
          <path d="M4 12l5 5L20 6" />
        ) : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </>
        )}
      </svg>
      {copied ? 'Copied for Teams' : 'Copy for Teams'}
    </button>
  )
}

export function EngagementSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /** Flow emphasis: one step per section of the pinned post, read top to bottom.
   *  Idle renders bare. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  return (
    <Slide
      kicker="Engagement"
      title="Engagement setup"
      lead="The Teams channel and pinned post opened at intake, and the standing rules for keeping it current. Use Copy for Teams to paste the post, then fill in the bracketed fields."
      legend={
        <Legend
          items={[
            { swatch: t.accent, label: '[bracketed]: fill in before pinning' },
            { swatch: t.inkSoft, label: 'Margin note, not part of the post' },
          ]}
        />
      }
    >
      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: GAP,
        }}
      >
        {/* When the channel is created, and who owns it. */}
        <div style={{ flex: 'none', display: 'flex', gap: GAP, height: HEAD_H }}>
          {[
            { label: 'When', text: ENGAGEMENT_WHEN, rail: t.accent },
            { label: 'Owner', text: ENGAGEMENT_OWNER, rail: t.roles.po.key },
          ].map((b) => (
            <div
              key={b.label}
              data-spot=""
              style={{
                flex: '1 1 0',
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.inkFaint}`,
                borderLeft: `4px solid ${b.rail}`,
                borderRadius: slide.radius,
                padding: CARD_PAD,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                overflow: 'hidden',
              }}
            >
              <MicroLabel>{b.label}</MicroLabel>
              <span
                style={{
                  fontSize: ty.body,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: t.ink,
                }}
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', gap: GAP }}>
          {/* THE POST ITSELF — a message surface, copied as it stands. */}
          <section
            data-spot=""
            style={{
              flex: '1180 0 0',
              minWidth: 0,
              background: t.card,
              border: `1px solid ${t.inkFaint}`,
              borderRadius: slide.radius,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            {/* Channel strip — the header of the Teams post. */}
            <div
              style={{
                flex: 'none',
                height: 40,
                background: t.roles.po.surface,
                borderBottom: `1px solid ${t.inkFaint}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 18px',
              }}
            >
              <span
                aria-hidden
                style={{
                  flex: 'none',
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: t.roles.po.key,
                }}
              />
              <TemplateLine text={ENGAGEMENT_CHANNEL} size={ty.body} />
              <span style={{ flex: 1 }} />
              <CopyPostButton />
              <MicroLabel>Pinned post</MicroLabel>
            </div>

            <div
              style={{
                flex: '1 1 auto',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: PAD,
                gap: 8,
              }}
            >
              {ENGAGEMENT_SECTIONS.map((s, si) => (
                <div
                  key={s.heading}
                  data-spot=""
                  className={flow(si)}
                  style={{
                    flex: '1 1 0',
                    minHeight: 0,
                    display: 'flex',
                    gap: 16,
                    paddingTop: si === 0 ? 0 : 8,
                    borderTop: si === 0 ? 'none' : `1px solid ${t.ruleSoft}`,
                  }}
                >
                  {/* Literal template — copy this. */}
                  <div
                    style={{
                      flex: '1 1 auto',
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        flex: 'none',
                        fontSize: ty.body,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: t.ink,
                        marginBottom: 5,
                      }}
                    >
                      {s.heading}
                    </div>
                    <div
                      style={{
                        flex: '1 1 auto',
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {s.lines.map((line) => (
                        <div
                          key={line}
                          style={{
                            flex: '1 1 0',
                            minHeight: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              flex: 'none',
                              width: 3,
                              height: 3,
                              borderRadius: 2,
                              background: t.inkSoft,
                            }}
                          />
                          <TemplateLine text={line} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Margin note — commentary, never copied into the post. */}
                  <div
                    style={{
                      flex: 'none',
                      width: 268,
                      borderLeft: `1px solid ${t.ruleSoft}`,
                      paddingLeft: 14,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: ty.chip,
                        lineHeight: 1.4,
                        fontStyle: 'italic',
                        color: t.inkMuted,
                      }}
                    >
                      {s.why}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT IS ENFORCED */}
          <Panel
            title="Standing rules"
            style={{ flex: '632 0 0', minWidth: 0, padding: PAD, overflow: 'hidden' }}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 0,
              }}
            >
              {ENGAGEMENT_RULES.map((r, i) => (
                <div
                  key={r.rule}
                  data-spot=""
                  style={{
                    flex: '1 1 0',
                    minHeight: 0,
                    background: t.paper,
                    border: `1px solid ${t.inkFaint}`,
                    borderLeft: `4px solid ${t.accent}`,
                    borderRadius: slide.radius,
                    padding: CARD_PAD,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      flex: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 26,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: t.accent,
                      opacity: 0.85,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span
                      style={{
                        fontSize: ty.cardTitle,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: t.ink,
                      }}
                    >
                      {r.rule}
                    </span>
                    <span style={{ fontSize: ty.meta, lineHeight: 1.35, color: t.inkSoft }}>
                      {r.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}
