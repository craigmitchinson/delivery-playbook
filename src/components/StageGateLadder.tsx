import { Fragment } from 'react'
import { MOMENTS, STAGE_GATES } from '../data/playbook'
import { slide, type as ty } from '../theme'
import { useTheme } from '../theme-context'
import { MicroLabel } from './primitives'

/**
 * The stage gate ladder, rendered from STAGE_GATES so the SG1 to SG5 sequence and
 * the moment each gate sits on are stated structurally rather than described in a
 * legend. SG1 to SG4 sit on the delivery spine; SG5 is the in-life gate and is
 * drawn after a divider so it is never read as the fifth step of a first delivery.
 */
const CAPTION =
  'SG1 to SG4 run on a first delivery. SG5 applies only to a change against a live solution, so a first delivery never reaches it.'

const SPINE = STAGE_GATES.filter((g) => !g.branch)
const BRANCH = STAGE_GATES.filter((g) => g.branch)

/** Gated moments carrying no stage gate code: moment 7 is a decommission sign-off. */
const SIGN_OFFS = MOMENTS.filter((m) => m.gate && !m.sg)

const gateSentence = (moment: number) => MOMENTS.find((m) => m.id === moment)?.gate ?? ''

/** SG code plus the moment it sits on, as one unbreakable token. */
function Code({ sg, moment, branch }: { sg: string; moment: number; branch: boolean }) {
  const t = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 6,
        background: branch ? 'transparent' : t.gate.fill,
        border: branch ? `1.5px dashed ${t.gate.rail}` : `1px solid ${t.gate.rail}`,
        color: branch ? t.ink : t.gate.text,
        borderRadius: 6,
        padding: '4px 9px',
        fontFamily: 'var(--font-mono)',
        fontSize: ty.chip,
        fontWeight: 700,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {sg}
      <span style={{ fontWeight: 600, opacity: 0.72 }}>M{moment}</span>
    </span>
  )
}

function Divider({ vertical }: { vertical: boolean }) {
  const t = useTheme()
  return (
    <span
      aria-hidden
      style={{
        flex: 'none',
        width: vertical ? 1 : 1,
        alignSelf: 'stretch',
        background: t.inkFaint,
        margin: '0 6px',
      }}
    />
  )
}

/** Header-sized ladder: codes only, for the legend slot or a thin body strip.
 *  `inline` sets the caption beside the codes rather than beneath them. */
export function StageGateLadderCompact({
  maxWidth = 560,
  inline = false,
}: {
  maxWidth?: number
  inline?: boolean
}) {
  const t = useTheme()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline ? 'center' : 'stretch',
        gap: inline ? 16 : 7,
        maxWidth,
      }}
    >
      <div
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        {SPINE.map((g, i) => (
          <Fragment key={g.sg}>
            {i > 0 && (
              <span aria-hidden style={{ color: t.inkSoft, fontSize: ty.chip }}>
                &rsaquo;
              </span>
            )}
            <Code sg={g.sg} moment={g.moment} branch={g.branch} />
          </Fragment>
        ))}
        <Divider vertical />
        {BRANCH.map((g) => (
          <Code key={g.sg} sg={g.sg} moment={g.moment} branch={g.branch} />
        ))}
      </div>
      <span
        style={{ flex: '1 1 auto', fontSize: ty.chip, lineHeight: 1.35, color: t.inkSoft }}
      >
        {CAPTION}
      </span>
    </div>
  )
}

/** One rung of the full ladder: the code, the gate name and what the gate tests. */
function Rung({
  sg,
  moment,
  name,
  branch,
  tag,
}: {
  sg?: string
  moment: number
  name: string
  branch: boolean
  tag?: string
}) {
  const t = useTheme()
  return (
    <div
      data-spot=""
      style={{
        flex: '1 1 0',
        minWidth: 0,
        background: branch ? 'transparent' : t.paper,
        border: `1px solid ${t.inkFaint}`,
        borderLeft: branch ? `4px dashed ${t.gate.rail}` : `4px solid ${t.gate.rail}`,
        borderRadius: slide.radius,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        {sg ? (
          <Code sg={sg} moment={moment} branch={branch} />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: ty.chip,
              fontWeight: 700,
              color: t.inkSoft,
              border: `1px solid ${t.inkFaint}`,
              borderRadius: 6,
              padding: '4px 9px',
              whiteSpace: 'nowrap',
            }}
          >
            M{moment}
          </span>
        )}
        <span
          style={{
            fontSize: ty.cardTitle,
            fontWeight: 700,
            lineHeight: 1.2,
            color: t.ink,
            minWidth: 0,
          }}
        >
          {name}
        </span>
      </div>
      {tag && (
        <MicroLabel style={{ flex: 'none', color: t.accent, fontWeight: 700 }}>{tag}</MicroLabel>
      )}
      <span
        style={{
          fontSize: ty.meta,
          lineHeight: 1.35,
          color: t.inkSoft,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {gateSentence(moment)}
      </span>
    </div>
  )
}

/** Full-width ladder: every rung named, with the branch gate set apart. */
export function StageGateLadder() {
  const t = useTheme()
  return (
    <div style={{ height: '100%', display: 'flex', gap: 12, minHeight: 0 }}>
      {SPINE.map((g) => (
        <Rung key={g.sg} sg={g.sg} moment={g.moment} name={g.name} branch={false} />
      ))}
      <span
        aria-hidden
        style={{
          flex: 'none',
          width: 0,
          alignSelf: 'stretch',
          borderLeft: `2px dashed ${t.inkFaint}`,
          margin: '0 4px',
        }}
      />
      {BRANCH.map((g) => (
        <Rung
          key={g.sg}
          sg={g.sg}
          moment={g.moment}
          name={g.name}
          branch
          tag="In-life branch, not part of a first delivery"
        />
      ))}
      {SIGN_OFFS.map((m) => (
        <Rung
          key={m.id}
          moment={m.id}
          name="Decommission sign-off"
          branch
          tag="Not a stage gate"
        />
      ))}
    </div>
  )
}
