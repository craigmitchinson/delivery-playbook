import { Fragment } from 'react'
import { MOMENTS, ROLES, STAGE_GATES } from '../data/playbook'
import type { Milestone, Moment, RoleKey } from '../data/types'
import { useFlow } from '../flow-context'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { GateBadge, Legend, MicroLabel, Panel, roleShort } from './primitives'
import { Slide } from './Slide'

/** Every milestone in the playbook is on this slide, so the count is the whole set. */
const TOTAL = MOMENTS.reduce((n, m) => n + m.milestones.length, 0)

/** Moments 1 to 5 are the delivery spine; 6 and 7 are the in-life branches. */
const SPINE = MOMENTS.filter((m) => m.core)
const SPINE_POS = new Map(SPINE.map((m, i) => [m.id, i + 1]))

/** The gate a moment carries, taken from the ladder rather than restated here. */
const gateOf = (id: number) => STAGE_GATES.find((g) => g.moment === id)

/**
 * Short role names for the dense grid. The dot carries the colour, the text
 * carries the meaning, and the legend spells each one out in full.
 */
const ABBR: Record<RoleKey, string> = {
  biz: 'Business',
  po: 'PO',
  el: 'EL',
  eng: 'Eng',
  coe: 'CoE',
}

/**
 * Column widths are weighted by how many milestones a moment holds, so a busy
 * moment gets the width its rows need. Branch columns are narrower than spine
 * columns because they sit off the main run.
 */
const weight = (m: Moment) =>
  m.core ? 1 + 0.07 * (m.milestones.length - 4) : 0.78

/** Role-coloured dot plus short name. A role is never colour alone. */
function RoleMark({ role, strong }: { role: RoleKey; strong?: boolean }) {
  const t = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: t.roles[role].key,
        fontWeight: strong ? 700 : 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 2,
          background: t.roles[role].key,
          flex: 'none',
        }}
      />
      {ABBR[role]}
    </span>
  )
}

/** One milestone: who acts, who receives it, what changes hands, where and by when. */
function MilestoneRow({ ms, first }: { ms: Milestone; first: boolean }) {
  const t = useTheme()
  return (
    <div
      data-spot=""
      style={{
        flex: '1 1 auto',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        padding: '5px 0 5px 8px',
        borderTop: first ? 'none' : `1px solid ${t.inkFaint}`,
        borderLeft: `3px solid ${ms.sg ? t.gate.rail : t.roles[ms.from].key}`,
        background: ms.sg ? t.gate.fill : 'transparent',
      }}
    >
      {/* Who acts, and who must receive it */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 4,
          fontSize: ty.chip,
          lineHeight: 1.3,
        }}
      >
        <RoleMark role={ms.from} strong />
        <span style={{ color: t.inkSoft, fontWeight: 700 }}>&rarr;</span>
        {ms.to.map((r, i) => (
          <Fragment key={r}>
            {i > 0 && <span style={{ color: t.inkFaint }}>&middot;</span>}
            <RoleMark role={r} />
          </Fragment>
        ))}
      </div>

      {/* What changes hands */}
      <div
        style={{
          fontSize: ty.meta,
          lineHeight: 1.22,
          fontWeight: 500,
          color: t.ink,
        }}
      >
        {ms.what}
      </div>

      {/* Where it happens, and by when */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 5,
          fontSize: ty.chip,
          lineHeight: 1.2,
          color: t.inkSoft,
        }}
      >
        {ms.sg && <GateBadge>{ms.sg}</GateBadge>}
        <span style={{ fontFamily: 'var(--font-mono)' }}>{ms.forum}</span>
        <span style={{ color: t.inkFaint }}>&middot;</span>
        <span>{ms.timing}</span>
      </div>
    </div>
  )
}

/** One moment: its place in the journey, the gate it carries, then its milestones. */
function MomentColumn({ m }: { m: Moment }) {
  const t = useTheme()
  const gate = gateOf(m.id)
  const pos = SPINE_POS.get(m.id)

  return (
    <Panel
      style={{
        flex: '1 1 auto',
        minWidth: 0,
        minHeight: 0,
        padding: '8px 10px',
        border: m.core ? `1px solid ${t.inkFaint}` : `1px dashed ${t.inkSoft}`,
        background: m.core ? t.card : 'transparent',
      }}
    >
      <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Which journey this column belongs to, stated in words */}
        <MicroLabel style={{ flex: 'none', marginBottom: 5, color: m.core ? t.inkSoft : t.accent }}>
          {m.core ? `Spine ${pos} of ${SPINE.length}` : 'In-life branch'}
        </MicroLabel>

        {/* The moment itself */}
        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginBottom: 5,
          }}
        >
          <span
            style={{
              flex: 'none',
              width: 20,
              height: 20,
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: ty.chip,
              fontWeight: 700,
              background: m.core ? t.ink : 'transparent',
              border: m.core ? 'none' : `1.5px solid ${t.ink}`,
              color: m.core ? t.paper : t.ink,
            }}
          >
            {m.id}
          </span>
          <span
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              fontSize: ty.body,
              fontWeight: 700,
              lineHeight: 1.15,
              color: t.ink,
            }}
          >
            {m.name}
          </span>
        </div>

        {/* The rung of the gate ladder this moment carries, at the same height in every column */}
        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 7px',
            marginBottom: 6,
            borderLeft: `3px solid ${gate ? t.gate.rail : t.inkFaint}`,
            borderRadius: '2px 5px 5px 2px',
            background: gate ? t.gate.fill : 'transparent',
            fontSize: ty.chip,
            lineHeight: 1.15,
            color: gate ? t.gate.text : t.inkSoft,
          }}
        >
          {gate && (
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, flex: 'none' }}>
              {gate.sg}
            </span>
          )}
          <span style={{ flex: '1 1 auto', minWidth: 0 }}>
            {gate ? gate.name : 'No stage gate'}
          </span>
        </div>

        {/* The milestones, in the order they must happen */}
        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            borderTop: `2px solid ${t.ruleSoft}`,
          }}
        >
          {m.milestones.map((ms, i) => (
            <MilestoneRow key={`${m.id}-${i}`} ms={ms} first={i === 0} />
          ))}
        </div>
      </div>
    </Panel>
  )
}

export function MilestonesSlide() {
  const t = useTheme()
  const { playing, step } = useFlow()

  /** Flow emphasis: one step per moment column, seven in all, left to right. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  const legend = (
    <Legend
      items={[
        ...ROLES.map((r) => ({
          swatch: t.roles[r.key].key,
          label:
            ABBR[r.key] === roleShort[r.key]
              ? roleShort[r.key]
              : `${ABBR[r.key]} ${roleShort[r.key]}`,
        })),
        { swatch: t.gate.rail, label: 'Stage gate event' },
        { swatch: t.inkSoft, label: 'In-life branch, moments 6 and 7' },
      ]}
    />
  )

  return (
    <Slide
      kicker="Milestones"
      title="Milestones"
      lead={`All ${TOTAL} milestones across the seven moments: who acts, who receives it, what changes hands, the forum and the timing. Moments 1 to 5 are the delivery spine; moments 6 and 7 are in-life branches. The stage gate ladder runs SG1 at moment 2 through to SG5 at moment 6.`}
      legend={legend}
    >
      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: MOMENTS.map((m) => `${weight(m)}fr`).join(' '),
          columnGap: slide.gap - 4,
        }}
      >
        {MOMENTS.map((m, ci) => (
          <div
            key={m.id}
            className={flow(ci)}
            style={{ minHeight: 0, minWidth: 0, display: 'flex' }}
          >
            <MomentColumn m={m} />
          </div>
        ))}
      </div>
    </Slide>
  )
}
