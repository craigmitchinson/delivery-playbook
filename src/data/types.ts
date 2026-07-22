export type RoleKey = 'biz' | 'po' | 'el' | 'eng' | 'coe'

export type RaciValue = 'A' | 'R' | 'C' | 'I'

export type RouteKey = 'ia' | 'sa'

export type RouteLens = 'both' | RouteKey

export type PathKey = 'new' | 'minor' | 'major'

export type ViewKey = 'spine' | 'swimlane' | 'grid'

export interface Role {
  key: RoleKey
  name: string
  sub: string
  /** Lane grouping in the swimlane view: the business sits outside the delivery squad. */
  side: 'demand' | 'delivery' | 'governance'
}

export interface Comm {
  /** Short title of the communication. */
  t: string
  /** What is communicated, by whom, to whom. */
  d: string
  /** The forum or mechanism it happens through. */
  m: string
}

/** A single block of work sitting in one role's lane, within one moment. */
export interface LaneTask {
  role: RoleKey
  label: string
  /** activity — work done; decision — a judgement call; gate — formal approval; receive — takes ownership of an outcome. */
  kind: 'activity' | 'decision' | 'gate' | 'receive'
}

/** The tangible thing a moment produces and hands to the next moment. */
export interface Artifact {
  label: string
  /** Lane the artifact is produced in — it renders on that lane's boundary. */
  role: RoleKey
}

/** An explicit transfer of ownership drawn between two lanes inside a moment. */
export interface Handoff {
  from: RoleKey
  to: RoleKey
  label: string
}

export type SizeKey = 'XS' | 'S' | 'M' | 'L' | 'XL'

/**
 * One T-shirt size. The same size means different work on each route, so the
 * build shape is stated per route; the hypercare window is keyed to the size
 * itself, so sizing the work sizes the support that follows it.
 */
export interface SizeBand {
  key: SizeKey
  /** IA (RPA) build shape, and its effort. */
  iaShape: string
  iaEffort: string
  /** SA (Power Platform) build shape, and its effort. */
  saShape: string
  saEffort: string
  /** Hypercare window that follows this size, in working days. */
  hypercareDays: number
  hypercare: string
  /**
   * Expected First Occurrence Validation scope at this size. FOV is measured by
   * scenario COVERAGE, not by elapsed time — the size sets how many in-scope
   * scenarios you should expect to validate, never a day count.
   */
  fovScope: string
}

/**
 * A dated, named event inside a moment: what fires it, who must act, who must
 * receive it, what they get, where it happens and by when. This is the level of
 * detail the playbook is enforced at — a moment says what must be true, a
 * milestone says who must do what, to whom, by when.
 */
export interface Milestone {
  /** What causes this milestone to fire. */
  trigger: string
  /** The role that must act. */
  from: RoleKey
  /** Everyone who must receive it. */
  to: RoleKey[]
  /** The artefact, decision or message that changes hands. */
  what: string
  /** The forum or mechanism it happens through. */
  forum: string
  /** The stage gate it hangs off, where it is gate business. */
  sg?: string
  /** The standard by which it must happen. */
  timing: string
}

export interface Moment {
  id: number
  /** Core moments form the linear spine; non-core are in-life branches. */
  core: boolean
  name: string
  /** Intelligent Automation route framing. */
  ia: string
  /** Smart Automation route framing. */
  sa: string
  intent: string
  entry: string
  exit: string
  owner: string
  gate?: string
  /** Stage gate code for the IA route (SG1..SG5). Absent where no stage gate
   *  applies — M1 is pre-gate and M7 is a decommission sign-off, not an SG. */
  sg?: string
  /** First Occurrence Validation, where it applies. Coverage-based, not timed. */
  fov?: string
  hyper?: string
  raci: Record<RoleKey, RaciValue>
  comms: Comm[]
  /** The named events inside this moment, in the order they must happen. */
  milestones: Milestone[]
  /** Swimlane view: work blocks per lane. */
  tasks: LaneTask[]
  artifact?: Artifact
  handoff?: Handoff
}

export interface DeliveryPath {
  label: string
  /** Moment ids in the order they are travelled — not necessarily ascending. */
  inPath: number[]
  entry: number
  note: string
}

export interface Cadence {
  n: string
  who: string
  d: string
}

/** One block of the pinned kickoff post. `lines` are literal — copy and fill the
 *  [bracketed] placeholders; `why` states the delay each block prevents. */
export interface EngagementSection {
  heading: string
  lines: string[]
  why: string
}

/** The standing rules for running the channel, so the blueprint is followed. */
export interface EngagementRule {
  rule: string
  detail: string
}
