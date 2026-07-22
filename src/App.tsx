import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { applyBionic } from './bionic'
import { BionicProvider } from './bionic-context'
import { CommsSlide } from './components/CommsSlide'
import { EngagementSlide } from './components/EngagementSlide'
import { MilestonesSlide } from './components/MilestonesSlide'
import { RaciSlide } from './components/RaciSlide'
import { RoutesSlide } from './components/RoutesSlide'
import { RulesSlide } from './components/RulesSlide'
import { SpineSlide } from './components/SpineSlide'
import { SwimlaneSlide } from './components/SwimlaneSlide'
import { SLIDE_HINT, SLIDE_LABEL, SLIDE_ORDER, type SlideId } from './deck'
import { FLOW_STEPS, FlowProvider } from './flow-context'
import { slide, themes, type Mode } from './theme'
import { ThemeContext } from './theme-context'

// Scale the fixed 1920x1080 canvas to fit the viewport for on-screen viewing
// only. The internal layout is always authored at full size, so a capture of
// the .slide-frame at 2x yields a clean 3840x2160 PNG regardless of this.
function useFitScale(margin: number) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const recompute = () => {
      const sx = (window.innerWidth - 64) / slide.width
      const sy = (window.innerHeight - margin) / slide.height
      setScale(Math.min(1, sx, sy))
    }
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [margin])
  return scale
}

// Small target glyph for the Spotlight toggle.
const SpotIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    style={{ verticalAlign: '-2px', marginRight: 5 }}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// Two rules, for the reading-ruler toggle.
const RulerIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    style={{ verticalAlign: '-2px', marginRight: 5 }}
    aria-hidden="true"
  >
    <path d="M3 9h18M3 15h18" />
  </svg>
)

// Triangle / pause bars, for the flow walkthrough toggle.
const FlowIcon = ({ on }: { on: boolean }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ verticalAlign: '-2px', marginRight: 5 }}
    aria-hidden="true"
  >
    {on ? <path d="M7 5h4v14H7zm6 0h4v14h-4z" /> : <path d="M8 5l11 7-11 7z" />}
  </svg>
)

const SLIDES: Record<SlideId, () => React.ReactElement> = {
  spine: SpineSlide,
  swimlane: SwimlaneSlide,
  raci: RaciSlide,
  milestones: MilestonesSlide,
  comms: CommsSlide,
  engagement: EngagementSlide,
  routes: RoutesSlide,
  rules: RulesSlide,
}

// One localStorage blob holds the whole chrome state, read once at module scope
// so the first render already shows the reader's last choices.
const PERSIST_KEY = 'delivery-playbook-v1'
interface Saved {
  mode?: Mode
  bionic?: boolean
  ruler?: boolean
  comfort?: boolean
  slide?: SlideId
}
const SAVED: Saved = (() => {
  try {
    return JSON.parse(localStorage.getItem(PERSIST_KEY) || 'null') || {}
  } catch {
    return {}
  }
})()

/** One beat of the flow walkthrough, in milliseconds. */
const FLOW_BEAT = 1100

const TOGGLE_TITLE = {
  bionic: 'Bionic reading: bolds the start of each word so the eye fixates on word beginnings',
  comfort:
    'Comfort text: a dyslexia-friendly sans face, wider line and word spacing, and no italics',
  ruler:
    'Reading ruler: a line-focus mask that follows the cursor, an aid for dyslexia and visual stress',
} as const

export default function App() {
  const [activeSlide, setActiveSlide] = useState<SlideId>(
    SAVED.slide && SLIDE_ORDER.includes(SAVED.slide) ? SAVED.slide : 'spine',
  )
  const [mode, setMode] = useState<Mode>(SAVED.mode ?? 'light')
  const [presenting, setPresenting] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [about, setAbout] = useState(false)
  const [bionic, setBionic] = useState<boolean>(SAVED.bionic ?? false)
  const [ruler, setRuler] = useState<boolean>(SAVED.ruler ?? false)
  const [comfort, setComfort] = useState<boolean>(SAVED.comfort ?? false)
  // Deliberately not persisted: a deck should never start moving on load.
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(-1)
  const liveRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  const t = themes[mode]
  const scale = useFitScale(presenting ? 84 : 150)
  const Active = SLIDES[activeSlide]

  // Mirror the deck's mode onto <html data-theme> so the @ccs/ui tokens the
  // chrome uses resolve to the same variant as the slide.
  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  useEffect(() => {
    document.title = `Delivery playbook · ${SLIDE_LABEL[activeSlide]}`
  }, [activeSlide])

  // Persist the chrome state as one blob, including the slide being read.
  useEffect(() => {
    try {
      localStorage.setItem(
        PERSIST_KEY,
        JSON.stringify({ mode, bionic, ruler, comfort, slide: activeSlide }),
      )
    } catch {
      /* ignore */
    }
  }, [mode, bionic, ruler, comfort, activeSlide])

  // Bionic reading: transform the mounted slide's text after it commits and
  // restore the original text nodes on teardown. Keyed on the slide id too, so
  // switching tabs re-applies it to the newly mounted slide.
  useLayoutEffect(() => {
    if (!bionic || !liveRef.current) return
    return applyBionic(liveRef.current)
  }, [bionic, activeSlide])

  // Reading ruler: moved by ref on mousemove, so the pointer never re-renders
  // the deck.
  useEffect(() => {
    if (!ruler) return
    const onMove = (e: MouseEvent) => {
      if (rulerRef.current) rulerRef.current.style.top = `${e.clientY - 30}px`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [ruler])

  // Flow walkthrough: while playing, advance one step a beat. Past the active
  // slide's last step it loops back to 0 — a continuously cycling walkthrough
  // reads better than one that stops dead mid-sentence.
  useEffect(() => {
    if (!playing) return
    const total = FLOW_STEPS[activeSlide]
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % total)
    }, FLOW_BEAT)
    return () => window.clearInterval(id)
  }, [playing, activeSlide])

  // Each slide's walkthrough starts clean: changing tabs stops it and clears the
  // lit step. This also covers the tab switching the exporter does.
  useEffect(() => {
    setPlaying(false)
    setStep(-1)
  }, [activeSlide])

  // The walkthrough must never reach the export, and it fights spotlight, which
  // is a manual focus tool. Either one wins over it.
  useEffect(() => {
    if (!exporting && !spotlight) return
    setPlaying(false)
    setStep(-1)
  }, [exporting, spotlight])

  // In present mode, arrow keys move between slides and Escape exits.
  useEffect(() => {
    if (!presenting) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPresenting(false)
        return
      }
      const i = SLIDE_ORDER.indexOf(activeSlide)
      if (e.key === 'ArrowRight' && i < SLIDE_ORDER.length - 1) {
        setActiveSlide(SLIDE_ORDER[i + 1])
      }
      if (e.key === 'ArrowLeft' && i > 0) setActiveSlide(SLIDE_ORDER[i - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [presenting, activeSlide])

  // Spotlight: while on, clicking a [data-spot] block lifts it above a scrim
  // and dims the rest. Clicking another moves it; clicking it again clears.
  useEffect(() => {
    const root = liveRef.current
    if (!root) return
    const frame = () => root.querySelector('.slide-frame')

    if (!spotlight) {
      frame()?.classList.remove('is-spotting')
      root.querySelectorAll('[data-spot].is-spot').forEach((el) => el.classList.remove('is-spot'))
      return
    }

    const onClick = (e: MouseEvent) => {
      const f = frame()
      if (!f) return
      const block = (e.target as HTMLElement).closest('[data-spot]')
      const current = f.querySelector('[data-spot].is-spot')
      if (current) current.classList.remove('is-spot')
      if (block && block !== current) {
        block.classList.add('is-spot')
        f.classList.add('is-spotting')
      } else {
        f.classList.remove('is-spotting')
      }
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [spotlight, activeSlide])

  // Export all eight slides as a 16:9 .pptx, one full-bleed 2x (3840x2160)
  // image per slide. Tabs are switched in turn and each .slide-frame is captured
  // with the browser's own rendering, so nothing of the formatting is lost. The
  // chrome lives outside .slide-frame, so none of it can leak into a capture.
  const handleExport = async () => {
    if (exporting) return
    // Stop the walkthrough before anything is captured, so no frame can be
    // photographed mid-animation with part of the slide dimmed.
    setPlaying(false)
    setStep(-1)
    setExporting(true)
    const previous = activeSlide
    try {
      const { toPng } = await import('html-to-image')
      const PptxGen = (await import('pptxgenjs')).default
      await document.fonts.ready

      const shots: string[] = []
      for (const id of SLIDE_ORDER) {
        setActiveSlide(id)
        // Let React commit the new slide and the browser paint it.
        await new Promise((r) => setTimeout(r, 350))
        const node = liveRef.current?.querySelector('.slide-frame') as HTMLElement | null
        if (!node) continue
        shots.push(
          await toPng(node, {
            pixelRatio: 2,
            cacheBust: true,
            width: slide.width,
            height: slide.height,
          }),
        )
      }

      const pptx = new PptxGen()
      pptx.defineLayout({ name: 'PLAYBOOK16x9', width: 13.333, height: 7.5 })
      pptx.layout = 'PLAYBOOK16x9'
      shots.forEach((data) => {
        pptx.addSlide().addImage({ data, x: 0, y: 0, w: 13.333, h: 7.5 })
      })
      await pptx.writeFile({ fileName: 'Delivery playbook.pptx' })
    } finally {
      setActiveSlide(previous)
      setExporting(false)
    }
  }

  // The three reading aids, shared by the editing chrome and the floating
  // present-mode group — a presenter may want them mid-talk.
  const readingAids = (
    <>
      <button
        className={bionic ? '' : 'ghost'}
        onClick={() => setBionic((b) => !b)}
        title={TOGGLE_TITLE.bionic}
        aria-pressed={bionic}
      >
        <span style={{ fontWeight: 800 }}>Bio</span>nic
      </button>
      <button
        className={comfort ? '' : 'ghost'}
        onClick={() => setComfort((c) => !c)}
        title={TOGGLE_TITLE.comfort}
        aria-pressed={comfort}
      >
        Comfort
      </button>
      <button
        className={ruler ? '' : 'ghost'}
        onClick={() => setRuler((r) => !r)}
        title={TOGGLE_TITLE.ruler}
        aria-pressed={ruler}
      >
        <RulerIcon />
        Ruler
      </button>
    </>
  )

  const spotlightButton = (
    <button
      className={spotlight ? '' : 'ghost'}
      onClick={() => setSpotlight((s) => !s)}
      title="Spotlight: click a block on the slide to lift it above a scrim while you talk"
      aria-pressed={spotlight}
    >
      <SpotIcon />
      Spotlight
    </button>
  )

  // Play flow: walks the work through the slide a step at a time. Starting it
  // clears spotlight, so the two focus tools never fight over the same slide.
  const flowButton = (
    <button
      className={playing ? '' : 'ghost'}
      onClick={() => {
        if (playing) {
          setPlaying(false)
          return
        }
        setSpotlight(false)
        setStep(0)
        setPlaying(true)
      }}
      disabled={exporting}
      title="Play flow: walk the work through this slide a step at a time, looping until you pause"
      aria-pressed={playing}
    >
      <FlowIcon on={playing} />
      {playing ? 'Pause' : 'Play flow'}
    </button>
  )

  const flowState = useMemo(() => ({ playing, step }), [playing, step])

  return (
    <ThemeContext.Provider value={t}>
      <BionicProvider value={bionic}>
        <FlowProvider value={flowState}>
          <div
            className="stage"
            data-mode={mode}
            data-presenting={presenting ? 'true' : undefined}
            data-spotlight={spotlight ? 'true' : undefined}
            data-comfort={comfort ? 'true' : undefined}
            data-exporting={exporting ? 'true' : undefined}
            data-flow={playing ? 'true' : undefined}
            data-flow-step={step >= 0 ? step : undefined}
            style={{ background: t.page }}
          >
            <a className="ccs-skip-link" href="#deck">
              Skip to the deck
            </a>

            <div className="stage__frame" style={{ width: slide.width * scale }}>
              {/* One control row above the slide: tabs left, everything else right. */}
              <div className="stage__controls">
                {!presenting && (
                  <nav className="stage__tabs" aria-label="Slides">
                    {SLIDE_ORDER.map((id) => (
                      <button
                        key={id}
                        className={`stage__tab${id === activeSlide ? ' is-active' : ''}`}
                        aria-current={id === activeSlide ? 'page' : undefined}
                        title={SLIDE_HINT[id]}
                        onClick={() => setActiveSlide(id)}
                      >
                        {SLIDE_LABEL[id]}
                      </button>
                    ))}
                  </nav>
                )}
                <span className="spacer" />
                {presenting ? (
                  <div className="stage__actions stage__actions--present ccs-glass">
                    {flowButton}
                    {spotlightButton}
                    {readingAids}
                    <button
                      className="ghost"
                      onClick={() => setPresenting(false)}
                      title="Leave present mode and return to the editing chrome (Escape)"
                    >
                      Exit present
                    </button>
                  </div>
                ) : (
                  <div className="stage__actions">
                    <div className="stage__about">
                      <button
                        className="ghost"
                        onClick={() => setAbout((a) => !a)}
                        aria-expanded={about}
                        title="About this pack: what the playbook is for and the rules it enforces"
                      >
                        About
                      </button>
                      {about && (
                        <div className="about-panel ccs-glass-strong">
                          <h2>About this pack</h2>
                          <p>
                            This pack documents the delivery process for Intelligent Automation (RPA)
                            and Smart Automation (Power Platform). Both routes follow the same seven
                            moments and differ only in the weight of the CoE gate applied at each one.
                          </p>
                          <ol>
                            <li>
                              <b>Stage gates.</b> SG1 to SG4 apply to a first delivery. SG5 applies
                              only when a live solution is changed.
                            </li>
                            <li>
                              <b>Accountability.</b> The Product Owner is accountable for demand and
                              value. The Engineering Lead is accountable for delivery from assessment
                              through retirement, and holds the CoE relationship.
                            </li>
                            <li>
                              <b>Evidence at gates.</b> A release reaches production only on evidenced
                              testing and CoE approval.
                            </li>
                            <li>
                              <b>Forums.</b> Daily sync, weekly feature sync and planning and
                              prioritisation. Decisions are recorded in the delivery channel.
                            </li>
                            <li>
                              <b>Classification.</b> Size and risk together route a change. A small
                              change carrying risk takes the full route.
                            </li>
                            <li>
                              <b>Retirement.</b> Decommissioning is a required lifecycle step and is
                              completed with CoE sign-off.
                            </li>
                          </ol>
                          <p>
                            Present with the tabs or arrow keys. Play flow walks the slide a step at a
                            time. Spotlight lifts one block. Bionic, Comfort and Ruler are reading
                            aids. Export PPTX writes all eight slides to PowerPoint at
                            3840&times;2160.
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      className="ghost"
                      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                      title="Switch between the light paper palette and the deep-teal dark palette"
                    >
                      {mode === 'light' ? 'Dark' : 'Light'}
                    </button>
                    {readingAids}
                    {spotlightButton}
                    {flowButton}
                    <button
                      className="ghost"
                      onClick={handleExport}
                      disabled={exporting}
                      title="Export all eight slides to a 16:9 PowerPoint file at 3840×2160"
                    >
                      {exporting ? 'Exporting…' : 'Export PPTX'}
                    </button>
                    <button
                      onClick={() => setPresenting(true)}
                      title="Present mode: hide the editing chrome; arrow keys move, Escape exits"
                    >
                      Present
                    </button>
                  </div>
                )}
              </div>

              {/* Wrapper sized to the scaled canvas so the page flows without scroll. */}
              <main
                className="stage__canvas"
                id="deck"
                aria-label={`${SLIDE_LABEL[activeSlide]} slide`}
                style={{ width: slide.width * scale, height: slide.height * scale }}
              >
                <div
                  ref={liveRef}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: slide.width,
                    height: slide.height,
                  }}
                >
                  <Active />
                </div>
              </main>
            </div>

            {/* Reading ruler: dims everything except a horizontal band at the cursor. */}
            {ruler && !exporting && !spotlight && (
              <div
                ref={rulerRef}
                aria-hidden
                style={{
                  position: 'fixed',
                  left: 0,
                  right: 0,
                  top: '42%',
                  height: 60,
                  pointerEvents: 'none',
                  zIndex: 60,
                  boxShadow: `0 0 0 9999px ${
                    mode === 'dark' ? 'rgba(3,10,12,0.55)' : 'rgba(11,50,57,0.30)'
                  }`,
                  borderTop: `2px solid ${t.accent}`,
                  borderBottom: `2px solid ${t.accent}`,
                }}
              />
            )}
          </div>
        </FlowProvider>
      </BionicProvider>
    </ThemeContext.Provider>
  )
}
