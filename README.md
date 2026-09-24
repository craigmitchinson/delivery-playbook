# Delivery playbook

Fixed-dimension (1920x1080, 16:9) slides for the delivery playbook, switched via tabs at the top.
One delivery spine, two CoE routes (Intelligent Automation and Smart Automation), seven delivery
moments with accountability, gates and comms visible at every step. React + Vite + TypeScript, no
backend. Part of the CCS suite (hub on `http://localhost:5170`); this app runs on port **5180**. It
uses the shared `@ccs/ui` tokens, fonts and glass chrome, vendored into
[src/vendor/ccs-ui/](src/vendor/ccs-ui/) so the repo is self-contained and clones anywhere.

## About this pack — the playbook skeleton

This is a **governance artefact**, not a process diagram. It exists so a request cannot reach
production without a route, an accountable owner, an evidenced gate and a named operational home.
The argument it makes, slide by slide:

1. **One spine, not two processes.** IA and SA differ in the weight of the gate, never in the
   shape of the journey. A single spine is what stops "which process is this?" being a question.
2. **One accountable per moment** — never two, never none. The Product Owner is A end to end; the
   Engineering Lead is R wherever the work is technical; the CoE is C at gates and never A for
   delivery.
3. **Gates are evidenced, not asserted.** No build without a passed assessment; no go-live without
   evidenced testing and CoE approval.
4. **Every moment has a forum.** Daily sync, weekly feature sync, planning & prioritisation — no
   side channels, and escalation has a defined route.
5. **Size plus risk routes a change**, not size alone. Small-but-critical still goes the long way
   round.
6. **Retirement is a step**, not an afterthought. The estate stays clean.

An in-app "About" button carries the same guidance.

## The short version

[simple/playbook-on-a-page.html](simple/playbook-on-a-page.html) is the playbook on one page for
people who need the shape rather than the full deck: the five steps with owner and gate, after
go-live (change and retirement), who does what, sizing, the six rules and the cadence. It is a
single self-contained file with the CCS fonts inlined, and
[simple/playbook-on-a-page.pdf](simple/playbook-on-a-page.pdf) is the same page as a eight-page A4
landscape PDF for presenting or printing. Edit `playbook-on-a-page.src.html`, run
`node simple/build.mjs` to regenerate the HTML, then `node simple/pdf.mjs` (needs `playwright`
resolvable and a Chromium; set `CHROMIUM_PATH` to point at one) to regenerate the PDF. Its content
is written by hand, so update it alongside [src/data/playbook.ts](src/data/playbook.ts) when the
playbook changes. The one-pager currently leads the deck on three points: a named delivery
engineer owns the gates and the Engineering Lead owns technology choice; the process map is a
business input at assessment; requirements and the process map are signed off before build.

## The eight slides

- **Spine** ([src/components/SpineSlide.tsx](src/components/SpineSlide.tsx)): the hero. The five
  core moments as five columns flowing left to right, each with its step number, name, accountable
  owner, gate marker, intent, and entry/exit criteria — exit given the visual weight, since it is
  the definition of done for that moment.
- **Swimlane** ([src/components/SwimlaneSlide.tsx](src/components/SwimlaneSlide.tsx)): five role
  lanes against the five core moments. Work blocks per lane distinguish activity / decision / gate
  / receive; each moment's artifact sits on its producing lane and each handoff is drawn as an
  explicit transfer of ownership between two lanes.
- **RACI** ([src/components/RaciSlide.tsx](src/components/RaciSlide.tsx)): all seven moments against
  the five roles, with the single accountable per row made instantly findable, plus the standing
  accountability rules.
- **Milestones** ([src/components/MilestonesSlide.tsx](src/components/MilestonesSlide.tsx)): the
  event timeline. Every milestone carries a trigger, the role that acts, everyone who receives it,
  the artefact or decision that changes hands, the forum, the stage gate it hangs off and the timing
  standard. All 36 events across all seven moments are shown, with the two in-life branch moments set
  apart, so the full SG1 to SG5 ladder is visible on one slide.
- **Comms** ([src/components/CommsSlide.tsx](src/components/CommsSlide.tsx)): the three standing
  cadences (daily sync, weekly feature sync, planning & prioritisation) over the per-moment
  communications, organised by forum.
- **Engagement** ([src/components/EngagementSlide.tsx](src/components/EngagementSlide.tsx)): the
  kickoff blueprint — the Teams channel and its pinned post as a literal fill-in-the-brackets
  template (what we are delivering, who is involved including named deputies, how we will work, what
  the business must supply and by when, and the full gate map), plus the six standing rules that keep
  it honest. The channel opens at intake, before SG1.
- **Routes** ([src/components/RoutesSlide.tsx](src/components/RoutesSlide.tsx)): IA against SA for
  the same seven moments — identical rows, different gate weight — plus the three delivery paths
  (new solution, minor change, major change) drawn as the actual sequence of moments each travels.
- **Rules** ([src/components/RulesSlide.tsx](src/components/RulesSlide.tsx)): the closing slide.
  The six non-negotiables, the sizing table (the size band drives the IA and SA build shape, the FOV
  window and the hypercare window), both sets of exit criteria, and every CoE gate in one place.

## Stage gates, FOV and sizing

The IA route runs **SG1 to SG5**: SG1 Opportunity Assessment (M2), SG2 Build readiness (M3), SG3 Test
to Live (M4), SG4 Hypercare to BAU (M5), SG5 Enhancement to Live (M6). SG1 to SG4 apply to a first
delivery; SG5 applies only when a live solution is changed, so it sits on the in-life branch. M1 is
pre-gate and M7 is a decommission sign-off rather than a stage gate. SA runs the same spine with
proportionate rigour. The ladder is defined once in `STAGE_GATES` and rendered by
[src/components/StageGateLadder.tsx](src/components/StageGateLadder.tsx) on the Spine, Routes and
Standards slides, so it cannot say four gates on one slide and five on another.

**Accountability.** The Product Owner is accountable for demand and value, and is the single A on
intake (M1) and change classification (M6). The Engineering Lead is accountable for delivery from
early assessment through retirement (M2 to M5, M7) and holds the CoE relationship; every gate is
submitted Engineering Lead to CoE. Engineers are Responsible wherever the work is technical, and are
Consulted at classification before becoming Responsible again once the change re-enters delivery.

**First Occurrence Validation (FOV)** sits between SG3 and full go-live: each in-scope scenario is
checked by a named validator the first time it runs live. FOV is a **coverage** measure, not a
time-box — complete when every in-scope scenario has been validated, its output reconciled and any
variant logged and handled, however long that takes. A scenario that fails validation returns the
work to build; it never scales on a promise to fix. Hypercare, by contrast, *is* a time-box, so the
two are deliberately different mechanisms rather than the same one twice.

**T-shirt sizing is route-split**, because the same letter means different work: an M is two to four
systems with exception handling in RPA, but a multi-screen Dataverse app in Power Platform. The size
band sets the expected FOV scenario count (XS 1–2 → XL 20+) and the hypercare window (XS 3 → XL 20
working days), so sizing the work also sizes the validation and the support that follow it.

## Flow walkthrough

**Play flow** ([src/flow-context.ts](src/flow-context.ts)) walks the work through the active slide:
the spine advances moment to moment, the swimlane lights a whole moment column at a time, RACI and
Routes step down their rows, Milestones and Engagement walk their sections. It loops continuously,
resets whenever you change slide, and yields to Spotlight (the two are competing focus tools).

It is a **web-only** affordance and cannot reach PowerPoint: the export clears it before capturing,
switching tabs during capture resets it again, and a CSS backstop
(`.stage[data-exporting='true'] .flow-dim { opacity: 1 !important }`) means even a mid-flight export
cannot record a dimmed element. When it is idle the slides render with no flow classes at all, so the
resting deck is byte-identical to what has always been exported. `prefers-reduced-motion` disables the
pulse and makes the emphasis change instant.

## Reading accessibility

Three reading aids sit in the control row and in present mode, ported from the sibling deck apps so
the suite behaves consistently — **Bionic** (bolds the start of each word), **Comfort** (a
dyslexia-friendly sans face with wider line and word spacing and no italics) and **Ruler** (a
line-focus mask that follows the cursor). All three, plus light/dark and the slide you were last on,
persist to `localStorage` under `delivery-playbook-v1`.

## Presenting

**Present mode.** The "Present" button hides the editing chrome (utility bar, actions), enlarges the
slide to fill the viewport and locks it. Navigate with the tabs or the left/right arrow keys; Escape
(or "Exit present") leaves.

**Spotlight.** The "Spotlight" toggle lets you click any block on any slide to lift it and dim the
rest, so you can focus the room on one thing as you talk. Clicking another block moves the
spotlight; clicking it again clears it. Blocks are marked with `data-spot`.

**Export to PowerPoint.** The "Export PPTX" button captures all six slides at 2x (3840x2160) using
the browser's own rendering and assembles a 16:9 `.pptx` with one full-bleed image per slide, so
nothing of the formatting, structure or quality is lost. It uses two lazy-loaded, pure-JS packages
(`html-to-image`, `pptxgenjs`); the slides are images in the deck, so they look identical but are
not editable as PowerPoint text. Export reflects the current light/dark mode.

## Run

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # type-check + production build into dist/
npm run lint     # oxlint
```

Or launch the whole suite from the Prototypes folder with `.\start-suite.ps1`.

The slide is centred on a neutral page and scaled to fit the viewport for on-screen viewing only.
The internal layout is always authored at 1920x1080, so a capture of the `.slide-frame` element at
`deviceScaleFactor: 2` produces a clean 3840x2160 PNG.

## How it is built

- **Content** ([src/data/playbook.ts](src/data/playbook.ts)), typed by
  [src/data/types.ts](src/data/types.ts): roles, the seven moments (each with intent, entry, exit,
  owner, gate, RACI, comms, lane tasks, artifact and handoff), the three delivery paths, the
  non-negotiables and the cadence. Editing content there updates every slide — no component
  changes needed.
- **Brand** ([src/theme.ts](src/theme.ts)): every colour, font and spacing token lives in one file
  so the look cannot drift. The canonical source is `@ccs/ui` (vendored under
  [src/vendor/ccs-ui/](src/vendor/ccs-ui/)) — wherever a value exists there this file references
  `var(--c-*)` instead of a literal, so the suite stays in step. Fonts are the shared self-hosted
  stacks (Fraunces/Gelasio, Inter/Carlito, JetBrains Mono).
- **Light and dark modes**: the token file ships a light and a dark variant of the same palette,
  supplied to the render layer through a small context
  ([src/theme-context.ts](src/theme-context.ts)). The toolbar toggle switches the slide and the
  surrounding chrome in step, and mirrors the mode onto `<html data-theme>` so the `@ccs/ui` tokens
  resolve to the same variant. No component holds a literal colour. The dark variant is the deck's
  own deep-teal print palette — deliberately the same artefact look as the QBR pack, so slides from
  both apps dropped into one PowerPoint read as a single family.
- **The slide frame** ([src/components/Slide.tsx](src/components/Slide.tsx)): the fixed canvas every
  slide shares — kicker, title, one-line lead, legend, rule, then a body that fills the remaining
  height exactly, so slides size their content to the slide rather than growing past it.
- **Shared vocabulary** ([src/components/primitives.tsx](src/components/primitives.tsx)): `Panel`,
  `RaciChip`, `RouteTag`, `RoleTag`, `GateBadge`, `MicroLabel` and `Legend`. One role keeps one
  colour across the spine, the swimlane and the RACI grid, and state is never encoded by colour
  alone — the letter, glyph or label always carries the meaning too.
- **The deck** ([src/deck.ts](src/deck.ts)): slide order, tab labels and the contextual hint shown
  in the utility bar. Export walks `SLIDE_ORDER`, so adding a slide adds it to the PowerPoint.
