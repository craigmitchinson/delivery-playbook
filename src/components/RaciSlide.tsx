import type { ReactNode } from 'react'
import { MOMENTS, RACI_RULES, ROLES } from '../data/playbook'
import type { RaciValue, RoleKey } from '../data/types'
import { useFlow } from '../flow-context'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { MicroLabel, Panel, RACI_FULL, RaciChip, roleShort } from './primitives'
import { Slide } from './Slide'

/** Shared column geometry: moment label, five role columns, named owner. */
const GRID = '356px repeat(5, 1fr) 262px'

/** The role holding the single A on a moment, read from the matrix itself. */
function accountableRole(raci: Record<RoleKey, RaciValue>): RoleKey | undefined {
  return ROLES.find((r) => raci[r.key] === 'A')?.key
}

/** Why that role is accountable, stated as text so the split is not colour alone. */
const BASIS: Partial<Record<RoleKey, string>> = {
  po: 'Demand moment: a priority and value call',
  el: 'Delivery moment: a build and release call',
}

/**
 * The one cell the reader should be able to find without counting: the C sitting
 * on Engineers at the classification moment. Stated on the cell so the reason is
 * next to the value.
 */
const ENG_CLASSIFICATION_NOTE = 'Consulted now, responsible on re-entry'

function RaciKey() {
  const t = useTheme()
  const order: RaciValue[] = ['A', 'R', 'C', 'I']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, alignItems: 'flex-end' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, auto)',
          columnGap: 20,
          rowGap: 9,
        }}
      >
        {order.map((v) => (
          <span
            key={v}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontSize: ty.meta,
              color: t.inkSoft,
            }}
          >
            <RaciChip value={v} size={27} />
            {RACI_FULL[v]}
          </span>
        ))}
      </div>
      <MicroLabel>Boxed cell marks the accountable role on that row</MicroLabel>
    </div>
  )
}

function HeaderCell({ children, align }: { children: ReactNode; align?: 'left' | 'center' }) {
  return <div style={{ textAlign: align ?? 'left', minWidth: 0 }}>{children}</div>
}

export function RaciSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /** Flow emphasis: one step per moment row, top to bottom. Idle renders bare. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  return (
    <Slide
      kicker="Accountability"
      title="Accountability matrix"
      lead="Every moment carries exactly one accountable role. The Product Owner is accountable on the two demand moments, intake and classification; the Engineering Lead is accountable on the five delivery moments, early assessment through to retirement."
      legend={<RaciKey />}
    >
      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: slide.gap,
        }}
      >
        <Panel spot={false} style={{ flex: '1 1 auto', minHeight: 0, padding: '14px 18px 12px' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Column headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: GRID,
                columnGap: 12,
                alignItems: 'end',
                paddingBottom: 10,
                borderBottom: `2px solid ${t.ruleSoft}`,
                flex: 'none',
              }}
            >
              <HeaderCell>
                <MicroLabel>Moment</MicroLabel>
              </HeaderCell>
              {ROLES.map((r) => (
                <HeaderCell key={r.key} align="center">
                  <div
                    style={{
                      fontSize: ty.cardTitle,
                      fontWeight: 700,
                      color: t.roles[r.key].key,
                      lineHeight: 1.15,
                    }}
                  >
                    {roleShort[r.key]}
                  </div>
                  <div style={{ fontSize: ty.chip, color: t.inkSoft, marginTop: 3 }}>{r.sub}</div>
                  <div
                    style={{
                      height: 3,
                      borderRadius: 2,
                      background: t.roles[r.key].key,
                      margin: '7px auto 0',
                      width: '62%',
                    }}
                  />
                </HeaderCell>
              ))}
              <HeaderCell>
                <MicroLabel>Named accountable owner</MicroLabel>
              </HeaderCell>
            </div>

            {/* Moment rows */}
            <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {MOMENTS.map((m, ri) => {
                const acc = accountableRole(m.raci)
                return (
                  <div
                    key={m.id}
                    data-spot=""
                    className={flow(ri)}
                    style={{
                      flex: '1 1 0',
                      minHeight: 0,
                      display: 'grid',
                      gridTemplateColumns: GRID,
                      columnGap: 12,
                      alignItems: 'center',
                      borderBottom: `1px solid ${t.inkFaint}`,
                    }}
                  >
                    {/* Row label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                      <span
                        style={{
                          flex: 'none',
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: ty.body,
                          fontWeight: 700,
                          background: m.core ? t.ink : 'transparent',
                          color: m.core ? t.paper : t.inkSoft,
                          border: `1.5px dashed ${m.core ? 'transparent' : t.inkFaint}`,
                        }}
                      >
                        {m.id}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: ty.momentName,
                            fontWeight: 600,
                            lineHeight: 1.15,
                            color: t.ink,
                          }}
                        >
                          {m.name}
                        </div>
                        <MicroLabel style={{ marginTop: 4 }}>
                          {m.core ? 'Core spine' : 'In-life branch'}
                        </MicroLabel>
                      </span>
                    </div>

                    {/* RACI cells */}
                    {ROLES.map((r) => {
                      const v: RaciValue = m.raci[r.key]
                      const isA = v === 'A'
                      const note = r.key === 'eng' && !m.core && v === 'C'
                      return (
                        <div
                          key={r.key}
                          style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 8px',
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              width: isA || note ? '100%' : 'auto',
                              minWidth: 0,
                              padding: isA ? '7px 6px' : note ? '3px 6px' : 0,
                              borderRadius: 10,
                              background: isA ? t.roles[r.key].surface : 'transparent',
                              border: isA
                                ? `2px solid ${t.roles[r.key].key}`
                                : '2px solid transparent',
                            }}
                          >
                            <RaciChip value={v} size={note ? 28 : 32} />
                            {isA && (
                              <MicroLabel style={{ color: t.roles[r.key].key }}>
                                Accountable
                              </MicroLabel>
                            )}
                            {note && (
                              <div
                                style={{
                                  fontSize: ty.chip,
                                  lineHeight: 1.25,
                                  color: t.inkSoft,
                                  textAlign: 'center',
                                }}
                              >
                                {ENG_CLASSIFICATION_NOTE}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {/* Named owner */}
                    <div style={{ minWidth: 0, paddingLeft: 4 }}>
                      <div
                        style={{
                          fontSize: ty.body,
                          fontWeight: 600,
                          color: t.ink,
                          lineHeight: 1.2,
                        }}
                      >
                        {m.owner}
                      </div>
                      <div
                        style={{
                          fontSize: ty.chip,
                          lineHeight: 1.3,
                          color: t.inkSoft,
                          marginTop: 4,
                        }}
                      >
                        {(acc && BASIS[acc]) ?? 'Accountable role named on the moment'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Panel>

        {/* Conventions the matrix follows, one per RACI letter */}
        <Panel title="Conventions this matrix follows" style={{ flex: 'none', padding: '13px 18px 15px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              columnGap: 20,
            }}
          >
            {RACI_RULES.map((r) => (
              <div
                key={r.chip}
                data-spot=""
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 11,
                  paddingLeft: 14,
                  borderLeft: `2px solid ${t.ruleSoft}`,
                }}
              >
                <span style={{ flex: 'none', paddingTop: 1 }}>
                  <RaciChip value={r.chip as RaciValue} size={29} />
                </span>
                <span style={{ fontSize: ty.meta, lineHeight: 1.36, color: t.inkSoft, minWidth: 0 }}>
                  {r.rule}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Slide>
  )
}
