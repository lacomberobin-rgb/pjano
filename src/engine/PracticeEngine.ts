import type { NoteScheduler } from './NoteScheduler'

interface PracticeState {
  isWaitMode: boolean
  loopStart: number | null
  loopEnd: number | null
}

export class PracticeEngine {
  applyConstraints(
    proposedTime: number,
    scheduler: NoteScheduler,
    state: PracticeState,
  ): number {
    let time = proposedTime

    // Wait mode: freeze time if there's an unmatched note in the past
    if (state.isWaitMode) {
      const unmatched = scheduler.getFirstUnmatchedNote(time)
      if (unmatched) {
        time = unmatched.time
      }
    }

    // Loop mode: wrap around
    if (state.loopStart != null && state.loopEnd != null && state.loopEnd > state.loopStart) {
      if (time > state.loopEnd) {
        time = state.loopStart
        scheduler.resetRange(state.loopStart, state.loopEnd)
      }
    }

    return time
  }
}
