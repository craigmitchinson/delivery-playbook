import { createContext, useContext } from 'react'
import type { SlideId } from './deck'

// The state of the "Play flow" walkthrough. Flows down so a slide can light its
// own steps in turn, from the single control in the chrome. Web-only: nothing
// here reaches the PPTX export, which forces the walkthrough off before it
// captures anything.
export interface FlowState {
  /** True while the walkthrough is running. */
  playing: boolean
  /** Zero-based index of the currently lit step, or -1 when idle. */
  step: number
}

const FlowContext = createContext<FlowState>({ playing: false, step: -1 })

export const FlowProvider = FlowContext.Provider
export const useFlow = (): FlowState => useContext(FlowContext)

/** How many steps each slide's walkthrough has. Agreed with the slides: a slide
 *  must expose exactly this many steps, indexed 0..n-1, so the driver knows when
 *  to loop back to the start. */
export const FLOW_STEPS: Record<SlideId, number> = {
  spine: 5,
  swimlane: 5,
  raci: 7,
  // All seven moments now, including the two in-life branch moments.
  milestones: 7,
  comms: 3,
  engagement: 5,
  routes: 7,
  rules: 3,
}
