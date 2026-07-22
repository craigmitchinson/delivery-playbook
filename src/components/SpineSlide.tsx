import { Fragment } from 'react'
import { MOMENTS } from '../data/playbook'
import type { Moment, RoleKey } from '../data/types'
import { useFlow } from '../flow-context'
import { type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { Slide } from './Slide'
import { StageGateLadderCompact } from './StageGateLadder'
import { GateBadge, MicroLabel, roleShort } from './primitives'

// Shared spacing scale for this slide. PAD is the internal padding of a panel,
// CARD_PAD the internal padding of a card inside one, GAP the space between
// stacked blocks. The same three values are used on every slide in the deck.
const PAD = '16px 18px'
const CARD_PAD = '10px 14px'
const GAP = 12
/** Width of the chevron column between two moments. */
const CHEVRON = 24

/** Owner strings in the data map onto the two delivery-side roles. */
const OWNER_ROLE: Record<string, RoleKey> = {
  'Product Owner': 'po',
  'Engineering Lead': 'el',
}

/** Short, projectable form of each moment's gate sentence. The stage gate code
 *  from the data leads the badge, so this spine reads SG1 to SG4 left to right.
 *  The ladder strip in the header states where SG5 sits. */
const GATE_SHORT: Record<number, string> = {
  2: 'assessment or register approved',
  3: 'build readiness on the charter',
  4: 'test to live on evidenced results',
  5: 'hypercare exit to BAU',
}

function Chevron() {
  const t = useTheme()
  return (
    <div
      style={{
        flex: 'none',
        width: CHEVRON,
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="22" height="38" viewBox="0 0 26 42" aria-hidden="true">
        <path
          d="M4 3 L21 21 L4 39"
          fill="none"
          stroke={t.inkSoft}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function MomentColumn({ m, step, flow }: { m: Moment; step: number; flow?: string }) {
  const t = useTheme()
  const roleKey = OWNER_ROLE[m.owner]
  const role = roleKey ? t.roles[roleKey] : undefined
  const short = GATE_SHORT[m.id] ?? m.gate
  const gate = short && m.sg ? `${m.sg}: ${short}` : short

  return (
    <div
      className={flow}
      style={{ flex: '1 1 0', minWidth: 0, display: 'flex', alignItems: 'stretch' }}
    >
      <section
        data-spot=""
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          background: t.card,
          border: `1px solid ${t.inkFaint}`,
          borderTop: `5px solid ${role ? role.key : t.rule}`,
          borderRadius: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          padding: PAD,
        }}
      >
        {/* Step number + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          <div
            style={{
              flex: 'none',
              width: 42,
              height: 42,
              borderRadius: 11,
              background: role ? role.surface : t.card,
              border: `2px solid ${role ? role.key : t.rule}`,
              color: t.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {step}
          </div>
          <h3
            style={{
              margin: 0,
              minWidth: 0,
              fontFamily: 'var(--font-display)',
              fontSize: ty.momentName,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: t.ink,
            }}
          >
            {m.name}
          </h3>
        </div>

        {/* Accountable owner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: GAP,
            flex: 'none',
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              flex: 'none',
              background: role ? role.key : t.inkSoft,
            }}
          />
          <MicroLabel>Owner</MicroLabel>
          <span style={{ fontSize: ty.meta, fontWeight: 700, color: t.ink }}>
            {roleKey ? roleShort[roleKey] : m.owner}
          </span>
        </div>

        {/* Gate */}
        <div style={{ marginTop: 8, flex: 'none' }}>
          {gate ? (
            <GateBadge>{gate}</GateBadge>
          ) : (
            <span style={{ fontSize: ty.chip, color: t.inkSoft }}>No gate on this moment</span>
          )}
        </div>

        {/* Intent */}
        <p
          style={{
            margin: `${GAP}px 0 0`,
            fontSize: ty.meta,
            lineHeight: 1.4,
            color: t.ink,
            flex: 'none',
          }}
        >
          {m.intent}
        </p>

        {/* The work in this moment. This is the flexible region of the column:
            it takes whatever height is left once intent, entry and exit have
            been laid out, so the tallest column still fits the canvas. */}
        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            margin: `${GAP}px 0`,
          }}
        >
          <MicroLabel style={{ flex: 'none' }}>What happens here</MicroLabel>
          <div
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              marginTop: 4,
            }}
          >
            {m.tasks.map((task, i) => (
              <div
                key={`${task.role}-${task.label}`}
                style={{
                  flex: '1 1 0',
                  minHeight: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '3px 0',
                  borderTop: i > 0 ? `1px solid ${t.ruleSoft}` : undefined,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    flex: 'none',
                    background: t.roles[task.role].key,
                  }}
                  title={roleShort[task.role]}
                />
                <span
                  style={{
                    minWidth: 0,
                    fontSize: ty.body,
                    lineHeight: 1.3,
                    fontWeight: task.kind === 'gate' || task.kind === 'decision' ? 700 : 500,
                    color: t.ink,
                  }}
                >
                  <span style={{ color: t.inkSoft, fontWeight: 500 }}>
                    {roleShort[task.role]}
                    {': '}
                  </span>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Entry */}
        <div style={{ flex: 'none', borderTop: `1px solid ${t.ruleSoft}`, paddingTop: 10 }}>
          <MicroLabel>Entry</MicroLabel>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: ty.chip,
              lineHeight: 1.4,
              color: t.inkSoft,
            }}
          >
            {m.entry}
          </p>
        </div>

        {/* Exit: the definition of done. Fixed height by content, never squeezed. */}
        <div
          style={{
            flex: 'none',
            marginTop: GAP,
            background: role ? role.band : t.card,
            border: `1px solid ${t.ruleSoft}`,
            borderLeft: `4px solid ${role ? role.key : t.rule}`,
            borderRadius: '4px 10px 10px 4px',
            padding: CARD_PAD,
          }}
        >
          <MicroLabel style={{ color: t.ink, fontWeight: 700 }}>Exit</MicroLabel>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: ty.meta,
              lineHeight: 1.35,
              fontWeight: 600,
              color: t.ink,
            }}
          >
            {m.exit}
          </p>
        </div>
      </section>
    </div>
  )
}

export function SpineSlide() {
  const { playing, step } = useFlow()
  const core = MOMENTS.filter((m) => m.core)

  /** Flow emphasis: one step per core moment, left to right. Idle renders bare. */
  const flow = (i: number) =>
    playing ? (i === step ? 'flow-lit flow-pulse' : 'flow-dim') : undefined

  return (
    <Slide
      kicker="Spine"
      title="The delivery spine"
      lead="The five core moments in the order they run. Entry states what must be true to start a moment; exit states what must be true to leave it."
      legend={<StageGateLadderCompact />}
    >
      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
        }}
      >
        {core.map((m, i) => (
          <Fragment key={m.id}>
            {i > 0 && <Chevron />}
            <MomentColumn m={m} step={i + 1} flow={flow(i)} />
          </Fragment>
        ))}
      </div>
    </Slide>
  )
}
