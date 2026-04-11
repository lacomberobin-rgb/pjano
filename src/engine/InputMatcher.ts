import type { PianoInputEvent } from '@/types/input'
import type { SongNote } from '@/types/song'
import type { NoteResult, TimingGrade } from '@/types/scoring'
import {
  PERFECT_WINDOW, GREAT_WINDOW, GOOD_WINDOW,
  PERFECT_POINTS, GREAT_POINTS, GOOD_POINTS, MISS_POINTS,
} from '@/lib/constants'

export class InputMatcher {
  private matchedNoteIds = new Set<string>()

  matchNote(
    input: PianoInputEvent,
    activeNotes: SongNote[],
    currentTime: number,
    latencyOffset: number,
    activeHand: 'left' | 'right' | 'both' = 'both',
  ): NoteResult {
    const adjustedTime = currentTime - latencyOffset / 1000

    let bestMatch: SongNote | null = null
    let bestOffset = Infinity

    for (const note of activeNotes) {
      if (note.midiNote !== input.note) continue
      if (this.matchedNoteIds.has(note.id)) continue
      
      // Only match if the hand matches
      if (activeHand !== 'both' && note.hand !== activeHand) continue

      const offset = Math.abs(adjustedTime - note.time)
      if (offset < bestOffset) {
        bestOffset = offset
        bestMatch = note
      }
    }

    if (!bestMatch || bestOffset > GOOD_WINDOW) {
      return {
        noteId: '',
        midiNote: input.note,
        expectedTime: currentTime,
        actualTime: adjustedTime,
        timingOffset: 0,
        grade: 'miss',
        pointsAwarded: MISS_POINTS,
      }
    }

    this.matchedNoteIds.add(bestMatch.id)
    bestMatch.matched = true

    const timingOffset = adjustedTime - bestMatch.time
    const absOffset = Math.abs(timingOffset)

    let grade: TimingGrade
    let points: number
    if (absOffset <= PERFECT_WINDOW) {
      grade = 'perfect'
      points = PERFECT_POINTS
    } else if (absOffset <= GREAT_WINDOW) {
      grade = 'great'
      points = GREAT_POINTS
    } else {
      grade = 'good'
      points = GOOD_POINTS
    }

    return {
      noteId: bestMatch.id,
      midiNote: input.note,
      expectedTime: bestMatch.time,
      actualTime: adjustedTime,
      timingOffset,
      grade,
      pointsAwarded: points,
    }
  }

  checkMissedNotes(missedNotes: SongNote[]): NoteResult[] {
    const results: NoteResult[] = []
    for (const note of missedNotes) {
      if (this.matchedNoteIds.has(note.id)) continue
      note.missed = true
      results.push({
        noteId: note.id,
        midiNote: note.midiNote,
        expectedTime: note.time,
        actualTime: -1,
        timingOffset: Infinity,
        grade: 'miss',
        pointsAwarded: 0,
      })
    }
    return results
  }

  reset(): void {
    this.matchedNoteIds.clear()
  }
}
