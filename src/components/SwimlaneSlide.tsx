import type { CSSProperties, ReactNode } from 'react'
import { MOMENTS, ROLES } from '../data/playbook'
import type { LaneTask, RoleKey } from '../data/types'
import { useFlow } from '../flow-context'
import { type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { Slide } from './Slide'
import { StageGateLadderCompact } from './StageGateLadder'
import { MicroLabel, roleShort } from './primitives'

// Geometry. Rows and columns are laid out with flex so the column headers, the
// lane grid and the transfer band all track the same widths without pixel maths
// living in more than one place. GAP is the deck-wide spacing step; CARD_PAD is
// the deck-wide internal padding of a card.
const GAP = 16
const CARD_PAD = '10px 14px'
const GUTTER = 176
const COL_GAP = GAP
const LANE_GAP = 8
const HEADER_H = 52
const FOOTER_H = 92
const LADDER_H = 44
const LANES = ROLES.length

const CORE = MOMENTS.filter((m) => m.core)

/** Shape + word cue for each task kind — never colour alone. */
const KIND: Record<LaneTask['kind'], { glyph: string; word: string }> = {
  activity: { glyph: '▸', word: 'Activity' },
  decision: { glyph: '◆', word: 'Decision' },
  gate: { glyph: '▣', word: 'Gate · CoE approval' },
  receive: { glyph: '◎', word: 'Receive · takes ownership' },
}

/** A gate cue leads with its stage gate code, so the CoE lane reads SG1, SG2,
 *  SG3, SG4 across the spine. The ladder strip at the foot of the slide states
 *  where SG5 sits. */
const kindWord = (kind: LaneTask['kind'], sg?: string) =>
  kind === 'gate' && sg ? `${sg} · CoE approval` : KIND[kind].word

function KindCue({ kind, sg, tone }: { kind: LaneTask['kind']; sg?: string; tone: string }) {
  return (
    <MicroLabel style={{ color: tone, marginBottom: 5 }}>
      <span style={{ fontSize: ty.meta, marginRight: 5 }}>{KIND[kind].glyph}</span>
      {kindWord(kind, sg)}
    </MicroLabel>
  )
}

/**
 * One work block inside a lane cell. `compact` is used where a lane carries more
 * than one block in the same moment — the cue folds onto the label's line so two
 * blocks still fit the lane height without either being clipped.
 */
function TaskBlock({ task, sg, compact }: { task: LaneTask; sg?: string; compact?: boolean }) {
  const t = useTheme()
  const role = t.roles[task.role]
  const isGate = task.kind === 'gate'

  const shape: CSSProperties =
    task.kind === 'gate'
      ? {
          background: t.gate.fill,
          border: `1px solid ${t.gate.rail}`,
          borderLeft: `6px solid ${t.gate.rail}`,
          borderRadius: '3px 9px 9px 3px',
          color: t.gate.text,
        }
      : task.kind === 'decision'
        ? {
            background: t.card,
            border: `2px dashed ${role.key}`,
            borderRadius: 9,
            color: t.ink,
          }
        : task.kind === 'receive'
          ? {
              background: role.surface,
              border: `4px double ${role.key}`,
              borderRadius: 9,
              color: t.ink,
            }
          : {
              background: t.card,
              border: `1px solid ${t.inkFaint}`,
              borderLeft: `5px solid ${role.key}`,
              borderRadius: 9,
              color: t.ink,
            }

  const tone = isGate ? t.gate.text : t.inkSoft

  return (
    <div
      title={kindWord(task.kind, sg)}
      style={{
        ...shape,
        padding: compact ? '6px 11px' : '9px 12px 10px',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: compact ? 'center' : 'stretch',
        justifyContent: compact ? 'flex-start' : 'center',
        gap: compact ? 8 : 0,
        flex: '1 1 auto',
        minHeight: 0,
      }}
    >
      {compact ? (
        <span style={{ flex: 'none', fontSize: ty.meta, color: tone, lineHeight: 1 }}>
          {KIND[task.kind].glyph}
        </span>
      ) : (
        <KindCue kind={task.kind} sg={sg} tone={tone} />
      )}
      <div style={{ fontSize: ty.body, lineHeight: 1.3, fontWeight: isGate ? 700 : 600 }}>
        {task.label}
      </div>
    </div>
  )
}

/** The hand-off object a moment produces, tabbed onto its producing lane. */
function ArtifactTab({ label, role }: { label: string; role: RoleKey }) {
  const t = useTheme()
  const s = t.roles[role]
  return (
    <div
      style={{
        flex: 'none',
        marginTop: 5,
        alignSelf: 'flex-start',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: s.surface,
        border: `1px solid ${s.key}`,
        borderTopWidth: 3,
        borderRadius: '0 0 8px 8px',
        padding: '4px 10px 5px',
        fontSize: ty.chip,
        fontWeight: 700,
        color: t.ink,
      }}
    >
      <span style={{ fontSize: ty.meta, color: s.key }}>▤</span>
      {label}
    </div>
  )
}

/**
 * One end of a transfer, in the band below the grid. `held` marks the role that
 * ends up holding the work, so the direction reads without relying on the arrow
 * alone.
 */
function TransferRole({ role, held }: { role: RoleKey; held: boolean }) {
  const t = useTheme()
  const s = t.roles[role]
  return (
    <span
      style={{
        flex: 'none',
        background: held ? s.surface : 'transparent',
        border: `${held ? 2 : 1}px solid ${s.key}`,
        borderRadius: 7,
        padding: held ? '2px 8px' : '3px 8px',
        fontSize: ty.chip,
        fontWeight: 700,
        color: s.key,
        whiteSpace: 'nowrap',
      }}
    >
      {roleShort[role]}
    </span>
  )
}

function LegendItem({ glyph, label, box }: { glyph: string; label: string; box: CSSProperties }) {
  const t = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: ty.meta,
        color: t.inkSoft,
        lineHeight: 1.35,
      }}
    >
      <span
        style={{
          flex: 'none',
          width: 22,
          height: 18,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: ty.chip,
          color: t.ink,
          ...box,
        }}
      >
        {glyph}
      </span>
      {label}
    </span>
  )
}

function SwimlaneLegend() {
  const t = useTheme()
  const neutral = t.roles.po.key
  const items: ReactNode[] = [
    <LegendItem
      key="a"
      glyph="▸"
      label="Activity"
      box={{
        background: t.card,
        border: `1px solid ${t.inkFaint}`,
        borderLeft: `4px solid ${neutral}`,
        borderRadius: 5,
      }}
    />,
    <LegendItem
      key="d"
      glyph="◆"
      label="Decision"
      box={{ background: t.card, border: `2px dashed ${neutral}`, borderRadius: 5 }}
    />,
    <LegendItem
      key="g"
      glyph="▣"
      label="Stage gate · CoE approval"
      box={{
        background: t.gate.fill,
        border: `1px solid ${t.gate.rail}`,
        borderLeft: `4px solid ${t.gate.rail}`,
        color: t.gate.text,
        borderRadius: '2px 5px 5px 2px',
      }}
    />,
    <LegendItem
      key="r"
      glyph="◎"
      label="Receive · owns the value"
      box={{
        background: t.roles.biz.surface,
        border: `3px double ${t.roles.biz.key}`,
        borderRadius: 5,
      }}
    />,
    <LegendItem
      key="ar"
      glyph="▤"
      label="Artifact produced"
      box={{
        background: t.roles.po.surface,
        border: `1px solid ${neutral}`,
        borderTopWidth: 3,
        borderRadius: '0 0 5px 5px',
      }}
    />,
    <LegendItem
      key="h"
      glyph="⟶"
      label="Transfer of ownership, shown in the band below"
      box={{ color: t.accent, fontSize: ty.meta, fontWeight: 700 }}
    />,
  ]
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        columnGap: 20,
        rowGap: 7,
        maxWidth: 560,
      }}
    >
      {items}
    </div>
  )
}

export function SwimlaneSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /** Flow emphasis: one step per moment column — header, every lane cell and the
   *  transfer cell below all carry the same step index, so the whole column
   *  lights together. Idle renders bare. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  return (
    <Slide
      kicker="Swimlane"
      title="Responsibility by moment"
      lead="What each role does inside every moment, with the transfer of ownership that closes the moment set out in the band below."
      legend={<SwimlaneLegend />}
    >
      {/* column headers */}
      <div style={{ flex: 'none', display: 'flex', gap: COL_GAP, height: HEADER_H }}>
        <div style={{ flex: 'none', width: GUTTER }} />
        {CORE.map((m, ci) => (
          <div
            key={m.id}
            className={flow(ci)}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 10,
              borderBottom: `2px solid ${t.ruleSoft}`,
              paddingBottom: 8,
            }}
          >
            <span
              style={{
                flex: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: ty.momentName,
                fontWeight: 700,
                color: t.inkSoft,
              }}
            >
              {String(m.id).padStart(2, '0')}
            </span>
            <span
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                fontSize: ty.cardTitle,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              {m.name}
            </span>
            {/* The stage gate this moment closes on, so the SG mapping reads
                from the column head as well as from the CoE lane below. */}
            {m.sg && (
              <span
                style={{
                  flex: 'none',
                  background: t.gate.fill,
                  color: t.gate.text,
                  borderLeft: `3px solid ${t.gate.rail}`,
                  borderRadius: '3px 6px 6px 3px',
                  padding: '2px 7px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: ty.chip,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.sg}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* lanes */}
      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: LANE_GAP,
          marginTop: GAP,
        }}
      >
        {ROLES.map((role) => {
          const s = t.roles[role.key]
          return (
            <div
              key={role.key}
              data-spot=""
              style={{
                flex: `1 1 ${100 / LANES}%`,
                minHeight: 0,
                display: 'flex',
                gap: COL_GAP,
                background: s.band,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  flex: 'none',
                  width: GUTTER,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 3,
                  borderLeft: `6px solid ${s.key}`,
                  borderRadius: '10px 0 0 10px',
                  padding: '0 12px',
                }}
              >
                <div style={{ fontSize: ty.cardTitle, fontWeight: 700, lineHeight: 1.25 }}>
                  {roleShort[role.key]}
                </div>
                <MicroLabel>{role.sub}</MicroLabel>
              </div>

              {CORE.map((m, ci) => {
                // A lane can carry more than one block in a moment — engineers
                // break down *and* build in moment 3, the business validates the
                // FOV scenarios *and* takes the value in moment 5 — so every
                // match renders.
                const tasks = m.tasks.filter((x) => x.role === role.key)
                const artifact = m.artifact?.role === role.key ? m.artifact : undefined
                return (
                  <div
                    key={m.id}
                    className={flow(ci)}
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '6px 12px 6px 4px',
                    }}
                  >
                    {tasks.length > 0 ? (
                      <div
                        style={{
                          flex: '1 1 auto',
                          minHeight: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5,
                        }}
                      >
                        {tasks.map((task) => (
                          <TaskBlock
                            key={`${task.role}-${task.label}`}
                            task={task}
                            sg={m.sg}
                            compact={tasks.length > 1}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          height: 3,
                          width: 34,
                          borderRadius: 2,
                          background: t.inkFaint,
                          alignSelf: 'center',
                        }}
                      />
                    )}
                    {artifact && <ArtifactTab label={artifact.label} role={role.key} />}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* what each transfer is */}
      <div
        style={{ flex: 'none', display: 'flex', gap: COL_GAP, height: FOOTER_H, marginTop: GAP }}
      >
        <div
          style={{
            flex: 'none',
            width: GUTTER,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
          }}
        >
          <div>
            <MicroLabel style={{ color: t.accent, fontWeight: 700 }}>
              Transfer of ownership
            </MicroLabel>
            <MicroLabel style={{ marginTop: 4 }}>Gives ⟶ receives</MicroLabel>
          </div>
        </div>
        {CORE.map((m, ci) => (
          <div
            key={m.id}
            data-spot=""
            className={flow(ci)}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 8,
              background: t.card,
              border: `1px solid ${t.inkFaint}`,
              borderTop: `3px solid ${m.handoff ? t.accent : t.inkFaint}`,
              borderRadius: 10,
              padding: CARD_PAD,
            }}
          >
            {m.handoff ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TransferRole role={m.handoff.from} held={false} />
                  <span
                    style={{
                      flex: 'none',
                      color: t.accent,
                      fontSize: ty.cardTitle,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    ⟶
                  </span>
                  <TransferRole role={m.handoff.to} held />
                </div>
                <div style={{ fontSize: ty.body, lineHeight: 1.35, fontWeight: 600 }}>
                  {m.handoff.label}
                </div>
              </>
            ) : (
              <div style={{ fontSize: ty.meta, color: t.inkSoft }}>No transfer in this moment</div>
            )}
          </div>
        ))}
      </div>

      {/* The stage gate ladder, so the CoE lane above is read against the whole
          SG1 to SG5 sequence rather than only the four gates on this spine. */}
      <div
        data-spot=""
        style={{
          flex: 'none',
          height: LADDER_H,
          marginTop: GAP,
          display: 'flex',
          alignItems: 'center',
          gap: GAP,
          borderTop: `1px solid ${t.ruleSoft}`,
          paddingTop: 8,
        }}
      >
        <div style={{ flex: 'none', width: GUTTER, padding: '0 12px' }}>
          <MicroLabel style={{ color: t.ink, fontWeight: 700 }}>Stage gate ladder</MicroLabel>
        </div>
        <StageGateLadderCompact maxWidth={1600} inline />
      </div>
    </Slide>
  )
}
