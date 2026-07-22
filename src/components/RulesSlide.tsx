import { FOV_EXIT, HYPERCARE_EXIT, MOMENTS, NON_NEGOTIABLES, SIZES } from '../data/playbook'
import { useFlow } from '../flow-context'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { GateBadge, MicroLabel, Panel, RouteTag } from './primitives'
import { Slide } from './Slide'
import { StageGateLadder } from './StageGateLadder'

/** Both source sentences live on moment 5 — read them rather than retype them. */
const M5 = MOMENTS.find((m) => m.id === 5)
const FOV_TEXT = M5?.fov ?? ''
/** "First Occurrence Validation: each in-scope scenario is checked by a named
 *  validator the first time it runs live. Coverage is the measure, not volume
 *  and not elapsed time." — the two sentences that make FOV a coverage measure
 *  rather than a window of days. */
const FOV_SENTENCES = FOV_TEXT.split('. ')
const FOV_LEAD = FOV_TEXT ? `${FOV_SENTENCES[0]}. ${FOV_SENTENCES[1] ?? ''}.` : ''
/** "Hypercare applies to both routes and follows FOV." */
const HYPER_LEAD = (M5?.hyper ?? '').split('. ')[0] + '.'

// Deck-wide spacing scale. PAD is the internal padding of a panel, CARD_PAD the
// internal padding of a card inside one, GAP the space between panels and rows.
const PAD = '16px 18px'
const CARD_PAD = '12px 16px'
const GAP = slide.gap

/** Fixed band heights. The three, plus two GAPs, fill the 843px body exactly. */
const STANDARDS_H = 320
const SIZING_H = 300
const GATES_H = 191

/** Shared row geometry, so the header and the five size rows line up exactly.
 *  The FOV column is the widest of the two right-hand columns because it carries
 *  a scenario count rather than a duration. */
const SIZE_COLS = '52px 1fr 124px 1fr 124px 140px 136px'

export function RulesSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /** Flow emphasis: three steps, one per region. Standards, then sizing, then
   *  the stage gate ladder. Idle renders bare. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  /** One exit checklist. FOV and hypercare are separate gates, so each gets its
   *  own rail and heading; the tick treatment stays common to both. */
  const Checklist = ({
    label,
    rail,
    items,
  }: {
    label: string
    rail: string
    items: string[]
  }) => (
    <div
      data-spot=""
      style={{
        flex: '1 1 0',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        borderLeft: `3px solid ${rail}`,
        paddingLeft: 12,
        overflow: 'hidden',
      }}
    >
      <MicroLabel style={{ flex: 'none', color: t.ink }}>{label}</MicroLabel>
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {items.map((c) => (
          <span
            key={c}
            style={{
              flex: '1 1 0',
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: ty.meta,
              lineHeight: 1.3,
              color: t.ink,
            }}
          >
            <span
              aria-hidden
              style={{
                flex: 'none',
                width: 17,
                height: 17,
                borderRadius: 5,
                background: t.routes.sa.fill,
                color: t.routes.sa.text,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: ty.chip,
                fontWeight: 700,
              }}
            >
              &#10003;
            </span>
            {c}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <Slide
      kicker="Rules"
      title="Standards and governance"
      lead="Mandatory standards, the size bands that set FOV coverage and the hypercare window, and where a CoE gate applies."
      legend={<GateBadge>CoE gate</GateBadge>}
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
        {/* PART 1: the mandatory standards. */}
        <div
          className={flow(0)}
          style={{ flex: `${STANDARDS_H} 0 0`, minHeight: 0, display: 'flex' }}
        >
        <Panel
          title="Mandatory standards"
          right={
            <span style={{ fontSize: ty.meta, color: t.inkSoft }}>
              These apply to every delivery on both routes
            </span>
          }
          style={{ flex: '1 1 auto', minWidth: 0, padding: PAD, overflow: 'hidden' }}
        >
          <div
            style={{
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: 14,
            }}
          >
            {NON_NEGOTIABLES.map((rule, i) => (
              <div
                key={rule}
                data-spot=""
                style={{
                  background: t.paper,
                  border: `1px solid ${t.inkFaint}`,
                  borderLeft: `4px solid ${t.accent}`,
                  borderRadius: slide.radius,
                  padding: CARD_PAD,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    flex: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: t.accent,
                    opacity: 0.85,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: ty.cardTitle,
                    lineHeight: 1.4,
                    fontWeight: 600,
                    color: t.ink,
                  }}
                >
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        </div>

        {/* PART 2: size drives the build shape on each route, the number of
            scenarios FOV must cover and the hypercare window that follows. */}
        <div className={flow(1)} style={{ flex: `${SIZING_H} 0 0`, minHeight: 0, display: 'flex' }}>
        <Panel
          title="Sizing: the size sets the FOV scenario count and the hypercare window"
          right={<span style={{ fontSize: ty.meta, color: t.inkSoft }}>{HYPER_LEAD}</span>}
          style={{ flex: '1 1 auto', minWidth: 0, padding: PAD, overflow: 'hidden' }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              minHeight: 0,
            }}
          >
            {/* Prose read from MOMENTS[4].fov, not retyped. */}
            <p
              style={{
                flex: 'none',
                margin: 0,
                fontSize: ty.meta,
                lineHeight: 1.4,
                color: t.inkSoft,
              }}
            >
              {FOV_LEAD}
            </p>

            <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', gap: 24 }}>
              {/* The table. One row per size; everything right of the key is set by it. */}
              <div
                data-spot=""
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    flex: 'none',
                    display: 'grid',
                    gridTemplateColumns: SIZE_COLS,
                    gap: 12,
                    alignItems: 'center',
                    paddingBottom: 6,
                    borderBottom: `1px solid ${t.ruleSoft}`,
                  }}
                >
                  <MicroLabel>Size</MicroLabel>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RouteTag route="ia" />
                    <MicroLabel>Build shape &middot; effort</MicroLabel>
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RouteTag route="sa" />
                    <MicroLabel>Build shape &middot; effort</MicroLabel>
                  </div>
                  {/* Coverage on the left, duration on the right — the two are
                      deliberately labelled in different units. */}
                  <MicroLabel style={{ color: t.ink }}>FOV coverage</MicroLabel>
                  <MicroLabel style={{ color: t.ink }}>Hypercare window</MicroLabel>
                </div>

                <div
                  style={{
                    flex: '1 1 auto',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {SIZES.map((s) => (
                    <div
                      key={s.key}
                      style={{
                        flex: '1 1 0',
                        minHeight: 0,
                        display: 'grid',
                        gridTemplateColumns: SIZE_COLS,
                        gap: 12,
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.cardTitle,
                          fontWeight: 700,
                          color: t.accent,
                          background: t.paper,
                          border: `1px solid ${t.inkFaint}`,
                          borderLeft: `3px solid ${t.accent}`,
                          borderRadius: 6,
                          padding: '3px 0',
                          textAlign: 'center',
                        }}
                      >
                        {s.key}
                      </span>
                      <span
                        style={{
                          fontSize: ty.body,
                          lineHeight: 1.25,
                          color: t.ink,
                          overflow: 'hidden',
                        }}
                      >
                        {s.iaShape}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.chip,
                          color: t.inkSoft,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.iaEffort}
                      </span>
                      <span
                        style={{
                          fontSize: ty.body,
                          lineHeight: 1.25,
                          color: t.ink,
                          overflow: 'hidden',
                        }}
                      >
                        {s.saShape}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.chip,
                          color: t.inkSoft,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.saEffort}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.meta,
                          fontWeight: 700,
                          color: t.ink,
                          background: t.gate.fill,
                          borderRadius: 5,
                          padding: '3px 8px',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}
                      >
                        {s.fovScope}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.meta,
                          fontWeight: 700,
                          color: t.roles.coe.text,
                          background: t.roles.coe.surface,
                          borderRadius: 5,
                          padding: '3px 8px',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}
                      >
                        {s.hypercare}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: 1, background: t.ruleSoft, flex: 'none' }} />

              {/* Two gates, two separate sets of exit criteria. */}
              <div
                style={{
                  flex: '0 0 420px',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <Checklist
                  label="FOV exit criteria, all four required"
                  rail={t.gate.rail}
                  items={FOV_EXIT}
                />
                <Checklist
                  label="Hypercare exit criteria, all four required at the end of the window"
                  rail={t.roles.coe.key}
                  items={HYPERCARE_EXIT}
                />
              </div>
            </div>
          </div>
        </Panel>
        </div>

        {/* PART 3: the stage gate ladder, rendered from STAGE_GATES so the
            sequence and the moment each gate sits on are stated structurally. */}
        <div className={flow(2)} style={{ flex: `${GATES_H} 0 0`, minHeight: 0, display: 'flex' }}>
        <Panel
          title="The stage gate ladder"
          right={
            <span style={{ fontSize: ty.meta, color: t.inkSoft }}>
              SG1 to SG4 run on a first delivery; SG5 applies only to a change against a live
              solution
            </span>
          }
          style={{ flex: '1 1 auto', minWidth: 0, padding: PAD, overflow: 'hidden' }}
        >
          <StageGateLadder />
        </Panel>
        </div>
      </div>
    </Slide>
  )
}
