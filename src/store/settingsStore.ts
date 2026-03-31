import { create } from 'zustand'

export type HandGuideLevel = 'full' | 'fingers' | 'off' | 'auto'

interface SettingsState {
  masterVolume: number
  metronomeVolume: number
  latencyOffset: number
  fallingNotesSpeed: number
  showFingerNumbers: boolean
  handGuideLevel: HandGuideLevel
  preferredInputMethod: 'midi' | 'screen' | 'keyboard'
  selectedMidiDeviceId: string | null
  defaultSpeed: number
  countdownBeats: number
  showTimingOffset: boolean
  dailyGoalMinutes: number
  onboardingComplete: boolean

  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  masterVolume: 0.8,
  metronomeVolume: 0.5,
  latencyOffset: 0,
  fallingNotesSpeed: 400,
  showFingerNumbers: true,
  handGuideLevel: 'auto',
  preferredInputMethod: 'screen',
  selectedMidiDeviceId: null,
  defaultSpeed: 1,
  countdownBeats: 4,
  showTimingOffset: false,
  dailyGoalMinutes: 15,
  onboardingComplete: false,

  updateSetting: (key, value) => set({ [key]: value }),
}))
