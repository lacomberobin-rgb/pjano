import type { SongNote } from '@/types/song'
import { GOOD_WINDOW } from '@/lib/constants'

export class NoteScheduler {
  private notes: SongNote[] = []

  load(notes: SongNote[]): void {
    this.notes = [...notes].sort((a, b) => a.time - b.time)
  }

  /** Notes within the matching window around currentTime */
  getActiveNotes(currentTime: number): SongNote[] {
    const windowStart = currentTime - GOOD_WINDOW
    const windowEnd = currentTime + GOOD_WINDOW
    return this.notes.filter(
      n => n.time >= windowStart && n.time <= windowEnd && !n.matched && !n.missed,
    )
  }

  /** Notes that have passed beyond the miss window */
  getMissedNotes(currentTime: number): SongNote[] {
    const missTime = currentTime - GOOD_WINDOW - 0.05
    return this.notes.filter(
      n => n.time < missTime && !n.matched && !n.missed,
    )
  }

  /** Notes visible in the falling notes window */
  getVisibleNotes(currentTime: number, windowSeconds: number): SongNote[] {
    return this.notes.filter(
      n => n.time >= currentTime - 0.5 && n.time <= currentTime + windowSeconds,
    )
  }

  /** Get the first unmatched note (for wait mode) */
  getFirstUnmatchedNote(currentTime: number): SongNote | null {
    return this.notes.find(
      n => n.time <= currentTime && !n.matched && !n.missed,
    ) ?? null
  }

  getAllNotes(): SongNote[] {
    return this.notes
  }

  resetRange(start: number, end: number): void {
    for (const note of this.notes) {
      if (note.time >= start && note.time <= end) {
        note.matched = false
        note.missed = false
      }
    }
  }

  resetAll(): void {
    for (const note of this.notes) {
      note.matched = false
      note.missed = false
    }
  }
}
