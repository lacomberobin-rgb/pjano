import { create } from 'zustand'

interface AppState {
  midiConnected: boolean
  midiDeviceName: string | null
  audioLoaded: boolean
  audioLoadProgress: number
  showLevelUpModal: boolean
  levelUpData: { oldLevel: number; newLevel: number } | null

  setMidiConnected: (connected: boolean, deviceName?: string) => void
  setAudioLoaded: (loaded: boolean) => void
  setAudioLoadProgress: (progress: number) => void
  showLevelUp: (oldLevel: number, newLevel: number) => void
  dismissLevelUp: () => void
}

export const useAppStore = create<AppState>((set) => ({
  midiConnected: false,
  midiDeviceName: null,
  audioLoaded: false,
  audioLoadProgress: 0,
  showLevelUpModal: false,
  levelUpData: null,

  setMidiConnected: (connected, deviceName) =>
    set({ midiConnected: connected, midiDeviceName: deviceName ?? null }),
  setAudioLoaded: (loaded) => set({ audioLoaded: loaded }),
  setAudioLoadProgress: (progress) => set({ audioLoadProgress: progress }),
  showLevelUp: (oldLevel, newLevel) =>
    set({ showLevelUpModal: true, levelUpData: { oldLevel, newLevel } }),
  dismissLevelUp: () =>
    set({ showLevelUpModal: false, levelUpData: null }),
}))
