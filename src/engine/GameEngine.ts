import type { Song } from '@/types/song'
import type { PianoInputEvent } from '@/types/input'
import type { NoteResult } from '@/types/scoring'
import { NoteScheduler } from './NoteScheduler'
import { InputMatcher } from './InputMatcher'
import { PracticeEngine } from './PracticeEngine'
import { FallingNotesRenderer } from '@/renderer/FallingNotesRenderer'
import { useGameStore } from '@/store/gameStore'

export class GameEngine {
  private scheduler = new NoteScheduler()
  private matcher = new InputMatcher()
  private practice = new PracticeEngine()
  private renderer: FallingNotesRenderer | null = null

  private song: Song | null = null
  private currentTime = 0
  private lastTimestamp: DOMHighResTimeStamp = 0
  private rafId: number | null = null
  private running = false
  private latencyOffset = 0

  private noteResultsMap = new Map<string, NoteResult>()

  // Throttle React store updates to ~30fps
  private lastStoreUpdate = 0
  private readonly storeUpdateInterval = 33 // ms

  setRenderer(renderer: FallingNotesRenderer): void {
    this.renderer = renderer
  }

  start(song: Song): void {
    this.song = song
    this.scheduler.load(song.notes.map(n => ({ ...n, matched: false, missed: false })))
    this.matcher.reset()
    this.noteResultsMap.clear()
    this.currentTime = -(song.countInBeats * (60 / song.bpm))
    this.running = true

    const store = useGameStore.getState()
    store.startGame(song)
    this.renderer?.setNotes(
      this.scheduler.getAllNotes(),
      this.getMinNote(),
      this.getMaxNote(),
    )

    this.lastTimestamp = performance.now()
    this.rafId = requestAnimationFrame(this.loop)
  }

  stop(): void {
    this.running = false
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  pause(): void {
    this.running = false
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    useGameStore.getState().pauseGame()
  }

  resume(): void {
    if (this.running) return
    this.running = true
    this.lastTimestamp = performance.now()
    useGameStore.getState().resumeGame()
    this.rafId = requestAnimationFrame(this.loop)
  }

  handleInput(event: PianoInputEvent): void {
    const store = useGameStore.getState()
    if (store.status !== 'playing' || event.type !== 'noteon') return

    const activeNotes = this.scheduler.getActiveNotes(this.currentTime)
    const result = this.matcher.matchNote(event, activeNotes, this.currentTime, this.latencyOffset)

    if (result.noteId) {
      this.noteResultsMap.set(result.noteId, result)
      this.renderer?.setNoteResults(this.noteResultsMap)
    }
    store.recordNoteResult(result)
  }

  setLatencyOffset(ms: number): void {
    this.latencyOffset = ms
  }

  private loop = (timestamp: DOMHighResTimeStamp): void => {
    if (!this.running || !this.song) return

    const rawDt = (timestamp - this.lastTimestamp) / 1000
    this.lastTimestamp = timestamp

    const store = useGameStore.getState()
    const speed = store.playbackSpeed
    const dt = rawDt * speed

    // Countdown phase
    if (store.status === 'countdown') {
      this.currentTime += dt
      if (this.currentTime >= 0) {
        store.setStatus('playing')
      }
    }

    if (store.status === 'playing') {
      const proposed = this.currentTime + dt
      this.currentTime = this.practice.applyConstraints(proposed, this.scheduler, store)

      // Check missed notes
      const missed = this.matcher.checkMissedNotes(this.scheduler.getMissedNotes(this.currentTime))
      for (const miss of missed) {
        this.noteResultsMap.set(miss.noteId, miss)
        store.recordNoteResult(miss)
      }

      // Check if song is complete
      if (this.currentTime > this.song.duration + 1) {
        this.running = false
        store.endGame()
        if (this.rafId != null) cancelAnimationFrame(this.rafId)
        return
      }
    }

    // Update PixiJS renderer directly (60fps)
    this.renderer?.setNoteResults(this.noteResultsMap)
    this.renderer?.update(this.currentTime)

    // Throttle React store updates
    if (timestamp - this.lastStoreUpdate > this.storeUpdateInterval) {
      store.setCurrentTime(this.currentTime)
      this.lastStoreUpdate = timestamp
    }

    this.rafId = requestAnimationFrame(this.loop)
  }

  private getMinNote(): number {
    if (!this.song || this.song.notes.length === 0) return 48
    return Math.max(36, Math.min(...this.song.notes.map(n => n.midiNote)) - 2)
  }

  private getMaxNote(): number {
    if (!this.song || this.song.notes.length === 0) return 84
    return Math.min(96, Math.max(...this.song.notes.map(n => n.midiNote)) + 2)
  }

  destroy(): void {
    this.stop()
  }
}
