import { createContext, useContext } from 'react'

// Whether bionic-reading emphasis is on. Flows down so a slide can react to it,
// from the single toggle in the chrome.
const BionicContext = createContext(false)

export const BionicProvider = BionicContext.Provider
export const useBionic = (): boolean => useContext(BionicContext)
