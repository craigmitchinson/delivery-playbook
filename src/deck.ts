/** The deck: eight slides, in the order they are presented and exported. */
export type SlideId =
  | 'spine'
  | 'swimlane'
  | 'raci'
  | 'milestones'
  | 'comms'
  | 'engagement'
  | 'routes'
  | 'rules'

export const SLIDE_ORDER: SlideId[] = [
  'spine',
  'swimlane',
  'raci',
  'milestones',
  'comms',
  'engagement',
  'routes',
  'rules',
]

export const SLIDE_LABEL: Record<SlideId, string> = {
  spine: 'Spine',
  swimlane: 'Swimlane',
  raci: 'RACI',
  milestones: 'Milestones',
  comms: 'Comms',
  engagement: 'Engagement',
  routes: 'Routes',
  rules: 'Rules',
}

/** Contextual hint shown for each slide. */
export const SLIDE_HINT: Record<SlideId, string> = {
  spine: 'The five core moments end to end, with the stage gate that closes each one.',
  swimlane: 'What each role does inside a moment, and where ownership transfers.',
  raci: 'The accountable role for each moment, and the conventions the matrix follows.',
  milestones: 'Each event: what fires it, who acts, who receives it and by when.',
  comms: 'The standing forums, and the forum each communication takes place in.',
  engagement: 'The channel opened at intake and the pinned post it starts from.',
  routes:
    'The seven moments framed on each route, and the moments each delivery path travels.',
  rules:
    'Mandatory standards, the size bands that set FOV coverage and the hypercare window, and the stage gate ladder.',
}
