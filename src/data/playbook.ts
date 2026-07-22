import type {
  Cadence,
  DeliveryPath,
  EngagementRule,
  EngagementSection,
  Moment,
  PathKey,
  Role,
  SizeBand,
} from './types'

export const ROLES: Role[] = [
  { key: 'biz', name: 'Business / Requestor', sub: 'Ops owner', side: 'demand' },
  { key: 'po', name: 'Product Owner', sub: 'Demand & value', side: 'delivery' },
  { key: 'el', name: 'Engineering Lead', sub: 'Delivery owner', side: 'delivery' },
  { key: 'eng', name: 'Engineers', sub: 'Squad', side: 'delivery' },
  { key: 'coe', name: 'CoE', sub: 'Gate approver', side: 'governance' },
]

/**
 * T-shirt sizing. The same size means different work on each route, so the build
 * shape is stated per route. FOV scope and the hypercare window are both keyed
 * to the size. Sizing is set provisionally at intake and confirmed at SG1
 * against an indicative breakdown produced by the squad.
 */
export const SIZES: SizeBand[] = [
  {
    key: 'XS',
    iaShape: 'One process, one system, no exceptions',
    iaEffort: '5 days or under',
    saShape: 'One form or one flow',
    saEffort: '3 days or under',
    fovScope: '1-2 scenarios',
    hypercareDays: 3,
    hypercare: '3 working days',
  },
  {
    key: 'S',
    iaShape: 'One process, one or two systems',
    iaEffort: '1 to 2 weeks',
    saShape: 'App plus a few flows',
    saEffort: 'About 1 week',
    fovScope: '3-5 scenarios',
    hypercareDays: 5,
    hypercare: '5 working days',
  },
  {
    key: 'M',
    iaShape: 'Two to four systems, exception handling',
    iaEffort: '3 to 4 weeks',
    saShape: 'Multi-screen app over Dataverse',
    saEffort: '2 to 3 weeks',
    fovScope: '6-10 scenarios',
    hypercareDays: 10,
    hypercare: '10 working days',
  },
  {
    key: 'L',
    iaShape: 'Multi-system, queues, orchestration',
    iaEffort: '6 to 8 weeks',
    saShape: 'Multi-app solution with integrations',
    saEffort: '5 to 6 weeks',
    fovScope: '11-20 scenarios',
    hypercareDays: 15,
    hypercare: '15 working days',
  },
  {
    key: 'XL',
    iaShape: 'Multi-process programme, shared components',
    iaEffort: '10 weeks or more',
    saShape: 'Enterprise solution, ALM across environments',
    saEffort: '8 weeks or more',
    fovScope: '21+ scenarios',
    hypercareDays: 20,
    hypercare: '20 working days',
  },
]

/** Hypercare is a time-box. It closes when all four of these are true. */
export const HYPERCARE_EXIT: string[] = [
  'Stable in production for the full window',
  'No P1 or P2 defects open',
  'Ops trained on the runbook and confident to operate',
  'Benefit tracking live and reporting',
]

/**
 * FOV is a coverage measure rather than a time-box. It closes when all four of
 * these are true, however long that takes.
 */
export const FOV_EXIT: string[] = [
  'Every in-scope scenario validated on its first live run',
  'Output reconciled and correct for each one',
  'Exceptions and variants logged and handled',
  'Business validator has signed the FOV off',
]

/**
 * The stage gate ladder. SG1 to SG4 run on the delivery spine; SG5 applies only
 * to a change against a live solution, so it sits on the in-life branch and is
 * never reached by a first delivery.
 */
export const STAGE_GATES = [
  { sg: 'SG1', name: 'Opportunity Assessment', moment: 2, branch: false },
  { sg: 'SG2', name: 'Build readiness', moment: 3, branch: false },
  { sg: 'SG3', name: 'Test to Live', moment: 4, branch: false },
  { sg: 'SG4', name: 'Hypercare to BAU', moment: 5, branch: false },
  { sg: 'SG5', name: 'Enhancement to Live', moment: 6, branch: true },
]

export const MOMENTS: Moment[] = [
  {
    id: 1,
    core: true,
    name: 'Intake & qualification',
    ia: 'Pre-gate activity',
    sa: 'Pre-gate activity',
    intent:
      'Capture the request, decide the route on technical grounds, avoid side-door delivery and establish named Ops contacts.',
    entry: 'A demand exists, from the business, the pipeline or a leadership ask.',
    exit: 'Request logged and qualified, route decided by the Engineering Lead, named Ops contact established, provisional T-shirt size and risk flag set.',
    owner: 'Product Owner',
    raci: { biz: 'R', po: 'A', el: 'R', eng: 'C', coe: 'I' },
    comms: [
      {
        t: 'Confirm scope and contact',
        d: 'PO confirms scope with the requestor and establishes the named Ops contact.',
        m: 'Direct, on intake',
      },
      {
        t: 'Route decision',
        d: 'Engineering Lead sets the route and records the technical reason for it.',
        m: 'Direct, on intake',
      },
      {
        t: 'Surface new demand',
        d: 'New request raised to the squad at daily sync and added to the pipeline at the weekly feature sync.',
        m: 'Daily sync · Feature sync',
      },
    ],
    milestones: [
      {
        trigger: 'A demand is raised',
        from: 'biz',
        to: ['po'],
        what: 'The request, its business context and the named Ops contact',
        forum: 'Direct, on intake',
        timing: 'Same day the demand is raised',
      },
      {
        trigger: 'Request logged',
        from: 'po',
        to: ['el'],
        what: 'Qualified demand with its business outcome and priority, passed for routing',
        forum: 'Direct, on intake',
        timing: 'Within 1 working day of logging',
      },
      {
        trigger: 'Routing needed',
        from: 'eng',
        to: ['el'],
        what: 'Current platform capability and squad capacity',
        forum: 'Daily sync',
        timing: 'Before the route is set',
      },
      {
        trigger: 'Route decided',
        from: 'el',
        to: ['po', 'biz'],
        what: 'IA or SA, the technical reason for it, the provisional size and the risk flag',
        forum: 'Direct, on intake',
        timing: 'Within 2 working days of qualification',
      },
      {
        trigger: 'Route confirmed',
        from: 'po',
        to: ['el', 'eng'],
        what: 'New demand added to the squad view and the visible pipeline',
        forum: 'Daily sync · Feature sync',
        timing: 'Next daily sync, then the next feature sync',
      },
    ],
    tasks: [
      { role: 'biz', label: 'Raise demand', kind: 'activity' },
      { role: 'po', label: 'Confirm outcome & priority', kind: 'activity' },
      { role: 'el', label: 'Qualify & decide route (IA / SA)', kind: 'decision' },
      { role: 'eng', label: 'Input on platform capability', kind: 'activity' },
    ],
    artifact: { label: 'Logged & routed request', role: 'el' },
    handoff: { from: 'biz', to: 'po', label: 'Demand & named Ops contact' },
  },
  {
    id: 2,
    core: true,
    name: 'Early assessment',
    ia: 'Stage Gate 1, Opportunity Assessment',
    sa: 'Register (lighter, impact pre-assessed)',
    intent:
      'Confirm suitability, business outcome, high-level requirements, data, connectors, users and platform fit.',
    entry: 'Qualified request from intake, route confirmed.',
    exit: 'IA: SG1 approved by CoE. SA: register complete. Business outcome and high-level requirements confirmed, platform fit signed, T-shirt size confirmed against an indicative breakdown.',
    owner: 'Engineering Lead',
    gate: 'CoE gate. Proportionate rigour: full opportunity case for IA, lighter register for SA.',
    sg: 'SG1',
    raci: { biz: 'C', po: 'R', el: 'A', eng: 'R', coe: 'C' },
    comms: [
      {
        t: 'Submit to gate',
        d: 'Engineering Lead submits the case to the CoE and receives the gate decision.',
        m: 'CoE gate',
      },
      {
        t: 'Outcome broadcast',
        d: 'PO reports the assessment outcome to the business and logs it at the feature sync.',
        m: 'Feature sync',
      },
      {
        t: 'Escalate on fail',
        d: 'Platform fit or suitability failure escalated to leads at planning and prioritisation.',
        m: 'Planning & prioritisation',
      },
    ],
    milestones: [
      {
        trigger: 'Assessment starts',
        from: 'po',
        to: ['el', 'biz'],
        what: 'Business outcome, benefit owner and success measure confirmed',
        forum: 'Direct',
        timing: 'Before the case is built',
      },
      {
        trigger: 'Platform fit under review',
        from: 'eng',
        to: ['el'],
        what: 'Platform fit, data, connectors and access assessed, with an indicative work breakdown and the size it supports',
        forum: 'Daily sync',
        timing: 'Before submission',
      },
      {
        trigger: 'Case complete',
        from: 'el',
        to: ['coe'],
        what: 'SG1 opportunity case for IA, or the completed register entry for SA',
        forum: 'CoE gate',
        sg: 'SG1',
        timing: 'At the CoE gate',
      },
      {
        trigger: 'Gate held',
        from: 'coe',
        to: ['el'],
        what: 'SG1 decision, with any conditions attached',
        forum: 'CoE gate',
        sg: 'SG1',
        timing: 'At the CoE gate',
      },
      {
        trigger: 'SG1 decided',
        from: 'po',
        to: ['biz'],
        what: 'Assessment outcome, confirmed size and what happens next. A failure is escalated to leads.',
        forum: 'Feature sync · Planning & prioritisation',
        sg: 'SG1',
        timing: 'Within 2 working days of the decision',
      },
    ],
    tasks: [
      { role: 'biz', label: 'Confirm business outcome', kind: 'activity' },
      { role: 'po', label: 'Own outcome, benefit & priority', kind: 'activity' },
      { role: 'el', label: 'Own the case, submit to CoE', kind: 'activity' },
      { role: 'eng', label: 'Assess platform fit & data', kind: 'activity' },
      { role: 'eng', label: 'Indicative breakdown & size', kind: 'activity' },
      { role: 'coe', label: 'SG1 / register decision', kind: 'gate' },
    ],
    artifact: { label: 'Approved assessment', role: 'el' },
    handoff: { from: 'coe', to: 'el', label: 'Gate decision' },
  },
  {
    id: 3,
    core: true,
    name: 'Build & delivery',
    ia: 'Stage Gate 2, Build',
    sa: 'Develop',
    intent:
      'Confirm requirements, break the work down, complete charter and route-to-live material, secure access, build and prepare the test plan.',
    entry: 'Assessment passed or register done, requirements confirmed, access secured.',
    exit: 'Work broken down and sequenced, build complete, charter and route-to-live material done, test plan ready, SG2 criteria met.',
    owner: 'Engineering Lead',
    gate: 'CoE gate. SG2 build readiness against the charter and route-to-live material.',
    sg: 'SG2',
    raci: { biz: 'R', po: 'C', el: 'A', eng: 'R', coe: 'C' },
    comms: [
      {
        t: 'Progress & blockers',
        d: 'Squad reports build progress and blockers daily, and chases access and requirement gaps with the business.',
        m: 'Daily sync',
      },
      {
        t: 'Deadline tracking',
        d: 'Feature deadline tracked and any slippage called out early at the weekly feature sync.',
        m: 'Feature sync',
      },
    ],
    milestones: [
      {
        trigger: 'SG1 approved',
        from: 'po',
        to: ['biz'],
        what: 'Requirements confirmation and the formal access request',
        forum: 'Direct',
        timing: 'Within 2 working days of SG1',
      },
      {
        trigger: 'Access requested',
        from: 'biz',
        to: ['el', 'eng'],
        what: 'System access, credentials and representative test data',
        forum: 'Direct',
        timing: 'Before the first build day',
      },
      {
        trigger: 'Access granted',
        from: 'eng',
        to: ['el', 'po'],
        what: 'Detailed story breakdown, sequence and estimate against the confirmed size',
        forum: 'Daily sync',
        timing: 'Before the first build day',
      },
      {
        trigger: 'Build in progress',
        from: 'eng',
        to: ['el', 'po'],
        what: 'Progress, blockers and gaps reported first hand. The squad takes its own technical decisions unless scope, cost or the date moves.',
        forum: 'Daily sync',
        timing: 'Every working day',
      },
      {
        trigger: 'Build complete',
        from: 'el',
        to: ['coe'],
        what: 'SG2 build readiness, with the charter and route-to-live material. Slippage is called out at the feature sync in the week it appears.',
        forum: 'CoE gate · Feature sync',
        sg: 'SG2',
        timing: 'At the CoE gate',
      },
    ],
    tasks: [
      { role: 'biz', label: 'Confirm requirements & grant access', kind: 'activity' },
      { role: 'po', label: 'Hold priority & business context', kind: 'activity' },
      { role: 'el', label: 'Charter, route-to-live, submit SG2', kind: 'activity' },
      { role: 'eng', label: 'Break down, size & sequence work', kind: 'activity' },
      { role: 'eng', label: 'Build the solution', kind: 'activity' },
      { role: 'coe', label: 'SG2 build readiness', kind: 'gate' },
    ],
    artifact: { label: 'Built solution + test plan', role: 'eng' },
    handoff: { from: 'biz', to: 'el', label: 'Requirements & access' },
  },
  {
    id: 4,
    core: true,
    name: 'Formal testing',
    ia: 'Stage Gate 3, Test to Live',
    sa: 'Test',
    intent: 'Complete testing, evidence results, triage defects and secure approvals.',
    entry: 'Build complete, test plan ready, test environment and data available.',
    exit: 'Testing complete, results evidenced, defects triaged, UAT signed off by the business, test-to-live approval secured.',
    owner: 'Engineering Lead',
    gate: 'CoE gate. SG3 test-to-live approval on evidenced results.',
    sg: 'SG3',
    raci: { biz: 'R', po: 'C', el: 'A', eng: 'R', coe: 'C' },
    comms: [
      {
        t: 'Coordinate UAT',
        d: 'Engineering Lead opens UAT with the business and confirms the sign-off criteria.',
        m: 'Direct',
      },
      {
        t: 'Defect triage',
        d: 'Defects triaged by the squad at daily sync; P1 and P2 escalated to leads.',
        m: 'Daily sync',
      },
      {
        t: 'Gate submission',
        d: 'Engineering Lead submits evidenced results to the CoE for the test-to-live gate.',
        m: 'CoE gate',
      },
    ],
    milestones: [
      {
        trigger: 'SG2 approved',
        from: 'eng',
        to: ['el', 'po'],
        what: 'Test cycle opened and run against the agreed test plan',
        forum: 'Daily sync',
        timing: 'Immediately after SG2',
      },
      {
        trigger: 'Defect found',
        from: 'eng',
        to: ['el', 'po'],
        what: 'Defect raised, triaged and prioritised. P1 and P2 are escalated to leads with the date impact.',
        forum: 'Daily sync · Planning & prioritisation',
        timing: 'Same day it is found',
      },
      {
        trigger: 'Test cycle passed',
        from: 'eng',
        to: ['el'],
        what: 'Evidenced results against every test case, assembled by the squad',
        forum: 'Direct',
        timing: 'Before UAT opens',
      },
      {
        trigger: 'Evidence ready',
        from: 'el',
        to: ['biz'],
        what: 'UAT opened, with its scope, test data and sign-off criteria',
        forum: 'Direct',
        timing: 'At least 3 working days before UAT',
      },
      {
        trigger: 'UAT complete',
        from: 'biz',
        to: ['el', 'po'],
        what: 'Business UAT sign-off, or the defects blocking it',
        forum: 'Direct',
        timing: 'Within 5 working days of UAT opening',
      },
      {
        trigger: 'UAT signed off',
        from: 'el',
        to: ['coe'],
        what: 'SG3 test-to-live submission with evidence and UAT sign-off. CoE returns the decision at the gate.',
        forum: 'CoE gate',
        sg: 'SG3',
        timing: 'At the CoE gate',
      },
    ],
    tasks: [
      { role: 'biz', label: 'UAT & business sign-off', kind: 'activity' },
      { role: 'po', label: 'Hold business availability', kind: 'activity' },
      { role: 'el', label: 'Own quality bar, submit SG3', kind: 'activity' },
      { role: 'eng', label: 'Run test cycle, evidence results', kind: 'activity' },
      { role: 'eng', label: 'Triage & fix defects', kind: 'activity' },
      { role: 'coe', label: 'SG3 test-to-live approval', kind: 'gate' },
    ],
    artifact: { label: 'Evidenced test results', role: 'eng' },
    handoff: { from: 'el', to: 'biz', label: 'Test evidence for sign-off' },
  },
  {
    id: 5,
    core: true,
    name: 'Release & adoption',
    ia: 'FOV, then Live, then SG4 Hypercare to BAU',
    sa: 'Pilot, then Live (hypercare aligned)',
    intent:
      'Validate every in-scope scenario on its first live run, then deploy, monitor, support hypercare, confirm operational ownership and begin benefit tracking.',
    entry: 'Test-to-live approval secured, deployment plan ready, in-scope scenario list and its validators agreed, Ops ownership agreed.',
    exit: 'Every in-scope scenario validated on first occurrence and FOV signed off, deployed and scaled, hypercare complete for the window the size sets, operational ownership confirmed, benefit tracking begun, hypercare closed to BAU at SG4.',
    owner: 'Engineering Lead',
    gate: 'CoE gate. SG4 hypercare exit to BAU, on the hypercare exit criteria.',
    sg: 'SG4',
    fov: 'First Occurrence Validation: each in-scope scenario is checked by a named validator the first time it runs live. Coverage is the measure rather than volume or elapsed time. FOV is complete when every in-scope scenario has had its first occurrence validated, its output reconciled and any variant logged and handled. The T-shirt size sets the expected scenario count. A scenario that fails validation returns the work to build.',
    hyper:
      'Hypercare applies to both routes and follows FOV. Unlike FOV it is a time-box: the window is keyed to the T-shirt size, from 3 working days at XS to 20 at XL. It closes when the solution has been stable for the full window, no P1 or P2 is open, Ops is trained on the runbook and benefit tracking is live.',
    raci: { biz: 'R', po: 'R', el: 'A', eng: 'R', coe: 'C' },
    comms: [
      {
        t: 'FOV scenario list',
        d: 'Squad sets out the in-scope scenarios and the business names a validator for each.',
        m: 'Direct',
      },
      {
        t: 'Go-live notice',
        d: 'PO notifies the business and Ops of go-live and the hypercare window.',
        m: 'Direct + broadcast',
      },
      {
        t: 'FOV and hypercare watch',
        d: 'Scenario coverage and hypercare status reviewed at daily sync until both close.',
        m: 'Daily sync',
      },
      {
        t: 'Benefit tracking',
        d: 'Operational ownership and benefit tracking reported to leadership.',
        m: 'Planning & prioritisation',
      },
    ],
    milestones: [
      {
        trigger: 'SG3 approved',
        from: 'eng',
        to: ['po', 'biz'],
        what: 'The in-scope scenario list FOV will validate, and a named validator for each',
        forum: 'Daily sync',
        sg: 'SG3',
        timing: 'Within 2 working days of SG3',
      },
      {
        trigger: 'Scenario list agreed',
        from: 'po',
        to: ['biz'],
        what: 'Go-live plan, validator availability and what the business must do',
        forum: 'Direct + broadcast',
        timing: 'Before FOV opens',
      },
      {
        trigger: 'FOV running',
        from: 'eng',
        to: ['el', 'po', 'biz'],
        what: 'Scenario coverage so far: validated, outstanding, and any variant found',
        forum: 'Daily sync',
        timing: 'Every day until coverage is complete',
      },
      {
        trigger: 'A scenario fails validation',
        from: 'eng',
        to: ['el', 'po'],
        what: 'The failing scenario, its cause, and the return to build',
        forum: 'Daily sync',
        timing: 'Same day it fails',
      },
      {
        trigger: 'Every in-scope scenario validated',
        from: 'biz',
        to: ['el', 'po'],
        what: 'FOV sign-off: full scenario coverage, output reconciled, variants handled',
        forum: 'Direct',
        timing: 'When coverage is complete, however long that takes',
      },
      {
        trigger: 'Hypercare exit criteria met',
        from: 'el',
        to: ['coe'],
        what: 'SG4 hypercare-to-BAU submission with confirmed Ops ownership',
        forum: 'CoE gate',
        sg: 'SG4',
        timing: 'At the end of the hypercare window',
      },
      {
        trigger: 'SG4 approved',
        from: 'po',
        to: ['biz'],
        what: 'Operational ownership confirmed and benefit tracking reported',
        forum: 'Planning & prioritisation',
        sg: 'SG4',
        timing: 'Within 5 working days of SG4',
      },
    ],
    tasks: [
      { role: 'biz', label: 'Validate scenarios & sign FOV off', kind: 'decision' },
      { role: 'biz', label: 'Value creation, own & operate', kind: 'receive' },
      { role: 'po', label: 'Go-live comms, benefit tracking', kind: 'activity' },
      { role: 'el', label: 'Deploy, monitor, submit SG4', kind: 'activity' },
      { role: 'eng', label: 'Run FOV, track scenario coverage', kind: 'activity' },
      { role: 'eng', label: 'Hypercare support', kind: 'activity' },
      { role: 'coe', label: 'SG4 hypercare to BAU', kind: 'gate' },
    ],
    artifact: { label: 'FOV sign-off + live solution', role: 'eng' },
    handoff: { from: 'el', to: 'biz', label: 'Delivery & transfer of ownership' },
  },
  {
    id: 6,
    core: false,
    name: 'Existing solution change',
    ia: 'Change Request, or SG5 Enhancement to Live',
    sa: 'Existing solution route via CoE sign-off',
    intent:
      'Assess the scale of change and follow the correct path, either a minor change or a larger enhancement.',
    entry: 'A change is requested against a live solution.',
    exit: 'Change classified by T-shirt size and risk flag, then routed. Minor takes the light path; major re-enters the full gates as SG5 Enhancement to Live for IA, or CoE sign-off for SA. A small but critical change still takes the long route.',
    owner: 'Product Owner',
    gate: 'Classification gate. The path is decided by size and risk together.',
    sg: 'SG5',
    raci: { biz: 'R', po: 'A', el: 'R', eng: 'C', coe: 'C' },
    comms: [
      {
        t: 'Classify & route',
        d: 'PO classifies the change and confirms the path. A risk flag triggers a CoE consult even at a small size.',
        m: 'Feature sync',
      },
      {
        t: 'Re-enter delivery',
        d: 'Minor changes are tracked at the feature sync; major changes re-enter the full comms rhythm from build.',
        m: 'Feature sync · Daily sync',
      },
    ],
    milestones: [
      {
        trigger: 'Change requested',
        from: 'biz',
        to: ['po'],
        what: 'Change request against a live solution, with the driver behind it',
        forum: 'Direct',
        timing: 'Same day it is raised',
      },
      {
        trigger: 'Change received',
        from: 'el',
        to: ['po'],
        what: 'Technical impact, size advice and the risk flag, with squad input on effort',
        forum: 'Direct',
        timing: 'Within 2 working days',
      },
      {
        trigger: 'Impact understood',
        from: 'po',
        to: ['biz', 'el', 'eng'],
        what: 'Classification by size and risk, the path it will take, and the moment it re-enters delivery at',
        forum: 'Feature sync · Daily sync',
        timing: 'Within 3 working days of the request',
      },
      {
        trigger: 'Risk flag set, or classified as major',
        from: 'el',
        to: ['coe'],
        what: 'SG5 enhancement submission, or a CoE consult on a risk-flagged change of any size',
        forum: 'CoE gate',
        sg: 'SG5',
        timing: 'Before the change moves',
      },
    ],
    tasks: [
      { role: 'biz', label: 'Request change to live solution', kind: 'activity' },
      { role: 'po', label: 'Classify by size + risk', kind: 'decision' },
      { role: 'el', label: 'Assess impact, submit to CoE', kind: 'activity' },
      { role: 'eng', label: 'Input on effort & feasibility', kind: 'activity' },
      { role: 'coe', label: 'SG5 / risk-flagged consult', kind: 'gate' },
    ],
    artifact: { label: 'Classified change', role: 'po' },
    handoff: { from: 'biz', to: 'po', label: 'Change request' },
  },
  {
    id: 7,
    core: false,
    name: 'Retirement & clean-up',
    ia: 'Housekeeping / Decommission',
    sa: 'Decommission via CoE sign-off (defined to match)',
    intent:
      'Remove obsolete assets, retire solutions where required and protect the estate from clutter.',
    entry: 'A solution is flagged obsolete, superseded or requested for decommission.',
    exit: 'Assets removed, access revoked, documentation archived, estate register updated. Applied consistently across both routes.',
    owner: 'Engineering Lead',
    gate: 'CoE sign-off on decommission.',
    raci: { biz: 'C', po: 'C', el: 'A', eng: 'R', coe: 'C' },
    comms: [
      {
        t: 'Confirm redundancy',
        d: 'PO confirms with the business that the solution is no longer needed.',
        m: 'Direct',
      },
      {
        t: 'Log & update estate',
        d: 'Decommission logged, CoE notified, estate register updated.',
        m: 'CoE sign-off',
      },
    ],
    milestones: [
      {
        trigger: 'Solution flagged obsolete',
        from: 'biz',
        to: ['po'],
        what: 'Confirmation the solution is no longer needed, and why',
        forum: 'Direct',
        timing: 'Same day it is flagged',
      },
      {
        trigger: 'Redundancy confirmed',
        from: 'po',
        to: ['el', 'eng'],
        what: 'Decommission instruction and the agreed removal date',
        forum: 'Daily sync',
        timing: 'Within 5 working days',
      },
      {
        trigger: 'Removal date reached',
        from: 'eng',
        to: ['el'],
        what: 'Assets removed, schedules disabled, access revoked and documentation archived',
        forum: 'Daily sync',
        timing: 'On the agreed removal date',
      },
      {
        trigger: 'Clean-up complete',
        from: 'el',
        to: ['coe'],
        what: 'Decommission sign-off and the estate register update',
        forum: 'CoE sign-off',
        timing: 'At CoE sign-off',
      },
    ],
    tasks: [
      { role: 'biz', label: 'Confirm no longer needed', kind: 'activity' },
      { role: 'po', label: 'Confirm redundancy with business', kind: 'activity' },
      { role: 'el', label: 'Own clean-up, submit sign-off', kind: 'activity' },
      { role: 'eng', label: 'Remove assets, revoke access', kind: 'activity' },
      { role: 'coe', label: 'Decommission sign-off', kind: 'gate' },
    ],
    artifact: { label: 'Updated estate register', role: 'el' },
  },
]

export const PATHS: Record<PathKey, DeliveryPath> = {
  new: {
    label: 'New solution',
    inPath: [1, 2, 3, 4, 5],
    entry: 1,
    note: 'Full run of the spine, SG1 to SG4, with FOV and full hypercare. Retirement follows later in life.',
  },
  minor: {
    label: 'Minor change',
    inPath: [6, 3, 4, 5],
    entry: 6,
    note: 'Enters at classification and skips the full opportunity assessment. Light build and test, with FOV and hypercare scaled to the size.',
  },
  major: {
    label: 'Major change',
    inPath: [6, 2, 3, 4, 5],
    entry: 6,
    note: 'Classified as major, so it re-runs the assessment and the full gates as an enhancement to live, with FOV and full hypercare.',
  },
}

/** Mandatory standards. These apply to every delivery on both routes. */
export const NON_NEGOTIABLES: string[] = [
  'All demand enters through intake and is logged, routed and given a named Ops contact before any work starts.',
  'No build begins before the assessment is approved or the register entry is complete, and the business outcome is confirmed.',
  'No solution scales beyond FOV until every in-scope scenario has been validated on its first live run.',
  'No release reaches production without evidenced testing and CoE gate approval.',
  'Every change to a live solution is classified by size and risk before it moves.',
  'Operational ownership is confirmed and accepted by the business before hypercare closes to BAU.',
]

export const CADENCE: Cadence[] = [
  {
    n: 'Daily sync',
    who: 'Squad: Engineers, EL, PO',
    d: 'Progress, blockers, defect triage, FOV coverage and hypercare status.',
  },
  {
    n: 'Weekly feature sync',
    who: 'POs and ELs, cross-squad',
    d: 'Feature deadlines, gate status and any slippage, called out early.',
  },
  {
    n: 'Planning & prioritisation',
    who: 'Leads and leadership',
    d: 'Portfolio priority, escalations, benefit and capacity.',
  },
]

export const RACI_FULL: Record<string, string> = {
  A: 'Accountable',
  R: 'Responsible',
  C: 'Consulted',
  I: 'Informed',
}

/** The accountability conventions this matrix follows. */
export const RACI_RULES: { chip: string; rule: string }[] = [
  {
    chip: 'A',
    rule: 'Exactly one accountable role per moment. The Product Owner is accountable where the moment is about demand and value; the Engineering Lead is accountable for delivery from assessment through retirement.',
  },
  {
    chip: 'R',
    rule: 'Responsible is whoever does the work, and more than one role can be responsible. Engineers are responsible wherever the work is technical.',
  },
  {
    chip: 'C',
    rule: 'Consulted is a two-way exchange before a decision. Engineers are consulted at classification and become responsible once the change re-enters delivery.',
  },
  {
    chip: 'I',
    rule: 'Informed is one-way, after the fact. The CoE is consulted at gates and is never accountable for delivery.',
  },
]

// ---------------------------------------------------------------------------
// Engagement blueprint
// ---------------------------------------------------------------------------
// The operational side of the playbook. Most avoidable delay traces to the
// business not knowing what would be asked of them or when, so the channel is
// opened at intake, before SG1, and the same pinned post is used every time.
// Copy it, fill the bracketed fields, pin it, and update it at every gate.

export const ENGAGEMENT_WHEN =
  'Created at intake, before SG1 and before the assessment starts.'
export const ENGAGEMENT_CHANNEL =
  'Teams channel: “[Solution name], Automation delivery”, business and squad in one place.'
export const ENGAGEMENT_OWNER =
  'PO creates it and owns the pinned post. Engineers own the delivery thread inside it.'

export const ENGAGEMENT_SECTIONS: EngagementSection[] = [
  {
    heading: '1 · What we are delivering',
    lines: [
      'Feature: [ABC-1234], [Jira Feature title]',
      'Description: [the Feature description, copied from Jira so both sides read the same words]',
      'Outcome: [the business outcome in one line]',
      'Route: [Intelligent Automation (RPA) / Smart Automation (Power Platform)]',
      'Size: [XS / S / M / L / XL], provisional until SG1',
      'Benefit: [hours returned or capacity created], tracked by [benefit owner]',
    ],
    why: 'The Jira Feature is the single source of truth. Quoting its reference and description here stops the channel and the backlog drifting apart.',
  },
  {
    heading: '2 · Who is involved',
    lines: [
      'Product Owner: [name], owns the outcome, the priority and this post',
      'Engineering Lead: [name], accountable for delivery and the CoE gates',
      'Engineers: [names], own the build, the testing and the delivery thread',
      'Ops contact: [name], business owner, confirms requirements and access',
      'Benefit owner: [name], signs off the value',
      'Deputies: [name] for PO, [name] for Ops, to cover leave and absence',
    ],
    why: 'A named deputy on both sides prevents a two-week gate slip when someone is away.',
  },
  {
    heading: '3 · How we will work',
    lines: [
      'This channel is the record. Decisions made by DM or email do not count.',
      'Pinned post: owned by the PO. Gates, dates, decisions and what we need from you.',
      'Delivery thread: owned by the Engineers. Breakdown, estimates, blockers, technical calls.',
      'Daily sync: squad only. Progress, blockers, defects, FOV coverage, hypercare status.',
      'Weekly feature sync: Feature [ABC-1234] gate status and any slippage.',
      'Response expected within [2] working days, or the gate date moves.',
    ],
    why: 'Engineers speak to the business directly in their own thread rather than reporting through the lead, so detail is not lost in translation.',
  },
  {
    heading: '4 · What we need from you, and when',
    lines: [
      'Before SG1: business outcome and success measure confirmed, by [date]',
      'Before SG2: system access, credentials and test data granted, by [date]',
      'At SG3: UAT completed and signed off within 5 working days of opening',
      'At FOV: a named validator per scenario, on call until every one has run live',
      'Before SG4: operational ownership confirmed and the runbook accepted',
    ],
    why: 'Every gate the business can block is listed with a date before the work starts.',
  },
  {
    heading: '5 · The gates, so nothing is a surprise',
    lines: [
      'SG1 Opportunity Assessment, target [date]',
      'SG2 Build readiness, target [date]',
      'SG3 Test to Live, target [date]',
      'FOV First Occurrence Validation, [n] in-scope scenarios, from [date] until all are validated',
      'SG4 Hypercare to BAU, target [date], hypercare runs [n] working days',
      'SG5 Enhancement to Live applies only if this changes once it is live',
    ],
    why: 'The whole gate map is visible on day one, so no one meets a stage gate for the first time at the gate.',
  },
]

export const ENGAGEMENT_RULES: EngagementRule[] = [
  {
    rule: 'Channel opens at intake',
    detail: 'The channel is created before SG1. No channel means no route has been set and no work has started.',
  },
  {
    rule: 'One pinned post, kept current',
    detail: 'The PO updates it at every gate, and any date change is made in the post itself.',
  },
  {
    rule: 'Decisions are recorded in-channel',
    detail: 'Approvals given verbally or by direct message do not count. A decision holds once it is posted in the channel.',
  },
  {
    rule: 'Gate outcomes posted within 2 days',
    detail: 'Every CoE decision is posted to the channel with what changes as a result.',
  },
  {
    rule: 'Named deputies on both sides',
    detail: 'PO and Ops contact each name a deputy at kickoff, so absence never stalls a gate.',
  },
  {
    rule: 'A non-response is escalated',
    detail: 'No reply within the agreed window is raised at the weekly feature sync, then at planning.',
  },
]
