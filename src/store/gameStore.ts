import { create } from 'zustand'
import type { Song } from '@/types/song'
import type { NoteResult, SessionGrade, TimingGrade } from '@/types/scoring'
import {
  GRADE_S, GRADE_A, GRADE_B, GRADE_C,
  COMBO_MULTIPLIER_STEP, COMBO_MULTIPLIER_INC, COMBO_MULTIPLIER_MAX,
} from '@/lib/constants'

export type GameStatus = 'idle' | 'loading' | 'countdown' | 'playing' | 'paused' | 'complete'

interface GameState {
  status: GameStatus
  song: Song | null
  currentTime: number
  playbackSpeed: number
  isWaitMode: boolean
  isAutoSpeedEnabled: boolean
  activeHand: 'left' | 'right' | 'both'
  score: number
  combo: number
  maxCombo: number
  noteResults: NoteResult[]
  accuracy: number
  loopStart: number | null
  loopEnd: number | null
  lastGrade: TimingGrade | null

  setStatus: (status: GameStatus) => void
  startGame: (song: Song) => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  setCurrentTime: (time: number) => void
  recordNoteResult: (result: NoteResult) => void
  setPlaybackSpeed: (speed: number) => void
  setWaitMode: (enabled: boolean) => void
  setAutoSpeed: (enabled: boolean) => void
  setActiveHand: (hand: 'left' | 'right' | 'both') => void
  setLoop: (start: number | null, end: number | null) => void
  getSessionGrade: () => SessionGrade
  reset: () => void
}

function computeAccuracy(results: NoteResult[]): number {
  if (results.length === 0) return 100
  const hits = results.filter(r => r.grade !== 'miss').length
  return Math.round((hits / results.length) * 100)
}

function computeMultiplier(combo: number): number {
  return Math.min(1 + Math.floor(combo / COMBO_MULTIPLIER_STEP) * COMBO_MULTIPLIER_INC, COMBO_MULTIPLIER_MAX)
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'idle',
  song: null,
  currentTime: 0,
  playbackSpeed: 1,
  isWaitMode: false,
  isAutoSpeedEnabled: false,
  activeHand: 'both',
  score: 0,
  combo: 0,
  maxCombo: 0,
  noteResults: [],
  accuracy: 100,
  loopStart: null,
  loopEnd: null,
  lastGrade: null,

  setStatus: (status) => set({ status }),

  startGame: (song) => set({
    status: 'countdown',
    song,
    currentTime: -(song.countInBeats * (60 / song.bpm)),
    score: 0,
    combo: 0,
    maxCombo: 0,
    noteResults: [],
    accuracy: 100,
    lastGrade: null,
  }),

  pauseGame: () => set({ status: 'paused' }),
  resumeGame: () => set({ status: 'playing' }),

  endGame: () => set({ status: 'complete' }),

  setCurrentTime: (time) => set({ currentTime: time }),

  recordNoteResult: (result) => {
    const state = get()
    const isMiss = result.grade === 'miss'
    const newCombo = isMiss ? 0 : state.combo + 1
    const multiplier = computeMultiplier(newCombo)
    const points = Math.round(result.pointsAwarded * multiplier)
    const newResults = [...state.noteResults, result]

    set({
      noteResults: newResults,
      score: state.score + points,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      accuracy: computeAccuracy(newResults),
      lastGrade: result.grade,
    })
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: Math.min(Math.max(0.1, speed), 2) }),
  setWaitMode: (enabled) => set({ isWaitMode: enabled }),
  setAutoSpeed: (enabled) => set({ isAutoSpeedEnabled: enabled }),
  setActiveHand: (hand) => set({ activeHand: hand }),
  setLoop: (start, end) => set({ loopStart: start, loopEnd: end }),

  getSessionGrade: () => {
    const { accuracy } = get()
    if (accuracy >= GRADE_S) return 'S'
    if (accuracy >= GRADE_A) return 'A'
    if (accuracy >= GRADE_B) return 'B'
    if (accuracy >= GRADE_C) return 'C'
    return 'D'
  },

  reset: () => set({
    status: 'idle',
    song: null,
    currentTime: 0,
    playbackSpeed: 1,
    isWaitMode: false,
    isAutoSpeedEnabled: false,
    activeHand: 'both',
    score: 0,
    combo: 0,
    maxCombo: 0,
    noteResults: [],
    accuracy: 100,
    lastGrade: null,
    loopStart: null,
    loopEnd: null,
  }),
}))
