import { MOMENTS, PATHS } from '../data/playbook'
import type { Moment, PathKey, RouteKey } from '../data/types'
import { useFlow } from '../flow-context'
import { type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { GateBadge, MicroLabel, Panel, RouteTag } from './primitives'
import { Slide } from './Slide'
import { StageGateLadderCompact } from './StageGateLadder'

const byId = (id: number): Moment => MOMENTS.find((m) => m.id === id) as Moment

const PATH_ORDER: PathKey[] = ['new', 'minor', 'major']

// Deck-wide spacing scale. PAD is the internal padding of a panel, CELL_PAD the
// internal padding of a table cell, GAP the space between panels and rows.
const PAD = '16px 18px'
const CELL_PAD = '8px 14px'
const GAP = 16
const LABEL_COL = 420
/** Fixed band heights. The two, plus one GAP, fill the 843px body exactly. */
const TABLE_H = 533
const PATHS_H = 294

/**
 * Routes — the IA / SA comparison over the seven moments, then the three
 * delivery paths through that same spine.
 */
export function RoutesSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /** Flow emphasis: one step per moment row — the label and both route cells
   *  carry the same step index, so the row lights as one. Idle renders bare. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  const routeHeader = (route: RouteKey, name: string) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '2px 14px 10px',
        background: t.routes[route].fill,
        borderBottom: `2px solid ${t.ruleSoft}`,
        alignSelf: 'stretch',
      }}
    >
      <RouteTag route={route} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: ty.chip,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: t.inkSoft,
        }}
      >
        {name}
      </span>
    </div>
  )

  const cell = (text: string, route: RouteKey, first: boolean, className?: string) => (
    <div
      className={className}
      style={{
        background: t.routes[route].fill,
        borderTop: first ? 'none' : `1px solid ${t.ruleSoft}`,
        padding: CELL_PAD,
        display: 'flex',
        alignItems: 'center',
        fontSize: ty.body,
        lineHeight: 1.35,
        color: t.ink,
      }}
    >
      {text}
    </div>
  )

  return (
    <Slide
      kicker="Routes and paths"
      title="Routes and delivery paths"
      lead="How the same seven moments are framed on each route, and the moments each delivery path travels."
      legend={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <RouteTag route="ia" />
              <span style={{ fontSize: ty.meta, color: t.inkSoft }}>Intelligent Automation</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <RouteTag route="sa" />
              <span style={{ fontSize: ty.meta, color: t.inkSoft }}>Smart Automation</span>
            </span>
          </div>
          <StageGateLadderCompact />
        </div>
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
        {/* ---------------- Band 1: IA and SA over the seven moments -------- */}
        <Panel
          title="The seven moments on each route"
          right={
            <span style={{ fontSize: ty.meta, color: t.inkSoft }}>
              The row is the same on both routes; the weight of the gate differs
            </span>
          }
          style={{ flex: `0 0 ${TABLE_H}px`, padding: PAD, overflow: 'hidden' }}
        >
          <div
            style={{
              height: '100%',
              display: 'grid',
              gridTemplateColumns: `${LABEL_COL}px 1fr 1fr`,
              gridTemplateRows: 'auto repeat(7, 1fr)',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                padding: '0 0 10px',
                borderBottom: `2px solid ${t.ruleSoft}`,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <MicroLabel>The spine</MicroLabel>
            </div>
            {routeHeader('ia', 'Intelligent Automation')}
            {routeHeader('sa', 'Smart Automation')}

            {MOMENTS.map((m, i) => (
              <div key={m.id} style={{ display: 'contents' }}>
                <div
                  data-spot=""
                  className={flow(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                    padding: '8px 18px 8px 0',
                    borderTop: i === 0 ? 'none' : `1px solid ${t.ruleSoft}`,
                  }}
                >
                  <span
                    style={{
                      flex: 'none',
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: m.core ? t.ink : 'transparent',
                      border: `1.5px solid ${t.ink}`,
                      color: m.core ? t.paper : t.ink,
                      fontFamily: 'var(--font-mono)',
                      fontSize: ty.body,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {m.id}
                  </span>
                  <span
                    style={{
                      fontSize: ty.cardTitle,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      color: t.ink,
                    }}
                  >
                    {m.name}
                  </span>
                  {/* The IA column reads as the stage gate ladder: SG1 on early
                      assessment through SG5 on enhancement to live. Moment 7 is
                      gated but is a decommission sign-off, not a stage gate. */}
                  {m.gate && <GateBadge>{m.sg ?? 'Sign-off'}</GateBadge>}
                </div>
                {cell(m.ia, 'ia', i === 0, flow(i))}
                {cell(m.sa, 'sa', i === 0, flow(i))}
              </div>
            ))}
          </div>
        </Panel>

        {/* ---------------- Band 2: the delivery paths ---------------------- */}
        <div
          style={{
            flex: `0 0 ${PATHS_H}px`,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <MicroLabel style={{ flex: 'none' }}>
            Delivery paths, showing the moments each path travels, in order
          </MicroLabel>
          <div
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: GAP,
            }}
          >
            {PATH_ORDER.map((k) => {
              const p = PATHS[k]
              const reruns = p.entry !== 1 && p.inPath.includes(2)
              const skips = p.entry !== 1 && !p.inPath.includes(2)
              const m2 = byId(2)
              return (
                <Panel key={k} style={{ minHeight: 0, gap: 8, padding: PAD, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      minHeight: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-display)',
                          fontSize: ty.momentName,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: t.ink,
                        }}
                      >
                        {p.label}
                      </h3>
                      <span style={{ flex: 1 }} />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.chip,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          color: t.accent,
                          border: `1.5px solid ${t.accent}`,
                          borderRadius: 5,
                          padding: '3px 7px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Enters at {p.entry}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: ty.meta,
                        lineHeight: 1.4,
                        color: t.inkSoft,
                      }}
                    >
                      {p.note}
                    </p>

                    <div
                      style={{
                        flex: 'none',
                        minHeight: 0,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 4,
                        paddingTop: 4,
                      }}
                    >
                      {p.inPath.map((id, i) => {
                        const m = byId(id)
                        const isEntry = id === p.entry && i === 0
                        return (
                          <div
                            key={id}
                            style={{ display: 'flex', alignItems: 'flex-start', flex: '1 1 0', minWidth: 0 }}
                          >
                            {i > 0 && (
                              <span
                                style={{
                                  flex: 'none',
                                  alignSelf: 'flex-start',
                                  marginTop: 8,
                                  color: t.inkFaint,
                                  fontSize: ty.cardTitle,
                                  padding: '0 2px',
                                }}
                              >
                                &rarr;
                              </span>
                            )}
                            <div
                              style={{
                                flex: '1 1 0',
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 5,
                                borderTop: m.gate ? `3px solid ${t.gate.rail}` : `3px solid ${t.ruleSoft}`,
                                paddingTop: 6,
                              }}
                            >
                              <span
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 8,
                                  background: isEntry ? t.accent : t.ink,
                                  color: t.paper,
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: ty.meta,
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flex: 'none',
                                }}
                              >
                                {m.id}
                              </span>
                              <span
                                style={{
                                  fontSize: ty.chip,
                                  lineHeight: 1.35,
                                  textAlign: 'center',
                                  color: t.ink,
                                }}
                              >
                                {m.name}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div
                      style={{
                        flex: 'none',
                        marginTop: 'auto',
                        fontSize: ty.meta,
                        lineHeight: 1.4,
                        color: t.inkSoft,
                        borderTop: `1px solid ${t.ruleSoft}`,
                        paddingTop: 8,
                      }}
                    >
                      {skips && (
                        <span>
                          <strong style={{ color: t.accent }}>Skips moment 2.</strong> {m2.name} is
                          not re-run.
                        </span>
                      )}
                      {reruns && (
                        <span>
                          <strong style={{ color: t.accent }}>Re-runs moment 2.</strong> {m2.name}{' '}
                          is done again as an enhancement to live.
                        </span>
                      )}
                      {!skips && !reruns && (
                        <span>
                          Starts at moment {p.entry} and runs the spine straight through to{' '}
                          {byId(p.inPath[p.inPath.length - 1]).name.toLowerCase()}.
                        </span>
                      )}
                    </div>
                  </div>
                </Panel>
              )
            })}
          </div>
        </div>
      </div>
    </Slide>
  )
}
