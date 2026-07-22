import { CADENCE, MOMENTS } from '../data/playbook'
import type { Comm, RoleKey } from '../data/types'
import { useFlow } from '../flow-context'
import { type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { Legend, MicroLabel, Panel } from './primitives'
import { Slide } from './Slide'

/** The canonical forums. Raw `m` strings name one or two of these; anything
 *  that names two is listed under both rather than becoming its own column. */
interface Forum {
  key: string
  label: string
  /** Colour carrier — the role whose room this forum mostly is. */
  role: RoleKey
  /** Matched against Comm.m, case-insensitively. */
  match: string[]
  /** Standing cadence entry, where the forum is one of the three. */
  cadence?: string
}

// Deck-wide spacing scale. PAD is the internal padding of a panel, CARD_PAD the
// internal padding of a card inside one, GAP the space between panels and rows.
const PAD = '16px 18px'
const CARD_PAD = '10px 14px'
const GAP = 16
/** Height of the standing-cadence band at the top of the body. */
const CADENCE_H = 200

const FORUMS: Forum[] = [
  { key: 'daily', label: 'Daily sync', role: 'eng', match: ['daily sync'], cadence: 'Daily sync' },
  {
    key: 'feature',
    label: 'Feature sync',
    role: 'el',
    match: ['feature sync'],
    cadence: 'Weekly feature sync',
  },
  {
    key: 'planning',
    label: 'Planning & prioritisation',
    role: 'biz',
    match: ['planning'],
    cadence: 'Planning & prioritisation',
  },
  { key: 'coe', label: 'CoE gate', role: 'coe', match: ['coe'] },
  { key: 'direct', label: 'Direct', role: 'po', match: ['direct'] },
]

interface Entry {
  comm: Comm
  momentId: number
  momentName: string
}

/**
 * A raw `m` string can name two forums — "Daily sync · Feature sync" — so it is
 * split on the separators first and each segment matched on its own. Both the
 * daily and the feature forum now end in the word "sync", so matching is done on
 * the full forum phrase ("daily sync", "feature sync") and never on "sync"
 * alone; segment-wise matching keeps the two from bleeding into each other
 * however the pair is ordered in the string.
 */
const SEPARATORS = /[·+&,]/

const matchesForum = (f: Forum, raw: string): boolean =>
  raw
    .toLowerCase()
    .split(SEPARATORS)
    .some((segment) => f.match.some((k) => segment.includes(k)))

const entriesFor = (f: Forum): Entry[] => {
  const out: Entry[] = []
  for (const mo of MOMENTS) {
    for (const c of mo.comms) {
      if (matchesForum(f, c.m)) {
        out.push({ comm: c, momentId: mo.id, momentName: mo.name })
      }
    }
  }
  return out
}

export function CommsSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /**
   * Flow emphasis: three steps, one per standing cadence. The first three forum
   * columns are those same three cadences, so a step lights its cadence card and
   * the column of comms that happen in it together; the two called-as-needed
   * forums dim throughout. Idle renders bare.
   */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  return (
    <Slide
      kicker="Comms"
      title="Forums and cadence"
      lead="The three standing forums, and the forum each communication in the playbook takes place in."
      legend={
        <Legend
          items={FORUMS.map((f) => ({ swatch: t.roles[f.role].key, label: f.label }))}
        />
      }
    >
      {/* ------------------------------------------------ band 1: cadences */}
      <div
        data-spot=""
        style={{
          flex: `0 0 ${CADENCE_H}px`,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: GAP,
        }}
      >
        {CADENCE.map((c, i) => {
          const s = t.roles[FORUMS[i].role]
          return (
            <div
              key={c.n}
              className={flow(i)}
              style={{ minWidth: 0, minHeight: 0, display: 'flex' }}
            >
            <Panel
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                borderTop: `5px solid ${s.key}`,
                background: s.band,
                padding: PAD,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: 0,
                }}
              >
                <MicroLabel>Standing cadence</MicroLabel>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: ty.slideTitle - 8,
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                    margin: '8px 0 10px',
                    color: t.ink,
                  }}
                >
                  {c.n}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    alignSelf: 'flex-start',
                    background: s.surface,
                    color: s.text,
                    borderRadius: 7,
                    padding: '5px 10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: ty.meta,
                    fontWeight: 600,
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
                  {c.who}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: ty.body,
                    lineHeight: 1.4,
                    color: t.ink,
                  }}
                >
                  {c.d}
                </div>
              </div>
            </Panel>
            </div>
          )
        })}
      </div>

      {/* ------------------------------------------- band 2: comms by forum */}
      <Panel
        title="Communications by forum"
        right={
          <span style={{ fontSize: ty.meta, color: t.inkSoft }}>
            A communication naming two forums appears under both
          </span>
        }
        style={{ flex: '1 1 auto', minHeight: 0, marginTop: GAP, padding: PAD, overflow: 'hidden' }}
      >
        <div
          style={{
            height: '100%',
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${FORUMS.length}, 1fr)`,
            gap: GAP,
          }}
        >
          {FORUMS.map((f, fi) => {
            const s = t.roles[f.role]
            return (
              <div
                key={f.key}
                data-spot=""
                className={fi < CADENCE.length ? flow(fi) : playing ? 'flow-dim' : undefined}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${s.key}`,
                  paddingLeft: 12,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: ty.cardTitle,
                    fontWeight: 700,
                    lineHeight: 1.25,
                    color: t.ink,
                    flex: 'none',
                  }}
                >
                  {f.label}
                </div>
                <MicroLabel style={{ margin: '5px 0 8px', flex: 'none' }}>
                  {f.cadence ? 'Standing forum' : 'Called as needed'}
                </MicroLabel>
                <div
                  style={{
                    height: 1,
                    background: t.ruleSoft,
                    marginBottom: 10,
                    flex: 'none',
                  }}
                />
                <div
                  style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minHeight: 0,
                    overflow: 'hidden',
                  }}
                >
                  {entriesFor(f).map((e) => (
                    <div
                      key={`${f.key}-${e.momentId}-${e.comm.t}`}
                      style={{
                        flex: 'none',
                        minWidth: 0,
                        background: t.card,
                        border: `1px solid ${t.inkFaint}`,
                        borderRadius: 8,
                        padding: CARD_PAD,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 7,
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: ty.chip,
                            fontWeight: 700,
                            color: s.text,
                            background: s.surface,
                            border: `1px solid ${s.key}`,
                            borderRadius: 4,
                            padding: '1px 5px',
                            flex: 'none',
                          }}
                        >
                          M{e.momentId}
                        </span>
                        <span
                          style={{
                            fontSize: ty.chip,
                            color: t.inkSoft,
                            lineHeight: 1.35,
                          }}
                        >
                          {e.momentName}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: ty.body,
                          fontWeight: 600,
                          lineHeight: 1.35,
                          color: t.ink,
                        }}
                      >
                        {e.comm.t}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {/* ------------------------------------------------- the escalation route */}
      <div
        data-spot=""
        style={{
          flex: 'none',
          marginTop: GAP,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: t.card,
          border: `1px solid ${t.inkFaint}`,
          borderLeft: `4px solid ${t.accent}`,
          borderRadius: 14,
          padding: CARD_PAD,
          fontSize: ty.body,
          lineHeight: 1.4,
          color: t.inkSoft,
        }}
      >
        <span style={{ flex: 'none', color: t.ink, fontWeight: 700 }}>Escalation route</span>
        <span>
          Blocking defects and platform-fit failures go to leads at planning and prioritisation.
        </span>
      </div>
    </Slide>
  )
}
