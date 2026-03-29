export type TimingGrade = 'perfect' | 'great' | 'good' | 'miss'

export interface NoteResult {
  noteId: string
  midiNote: number
  expectedTime: number
  actualTime: number
  /** Negative = early, positive = late */
  timingOffset: number
  grade: TimingGrade
  pointsAwarded: number
}

export type SessionGrade = 'S' | 'A' | 'B' | 'C' | 'D'

export interface SessionScore {
  totalScore: number
  accuracy: number
  maxCombo: number
  perfectCount: number
  greatCount: number
  goodCount: number
  missCount: number
  grade: SessionGrade
}
