import type { KeySignature, MidiNote, TimeSignature } from './music'

export interface SongNote {
  id: string
  midiNote: MidiNote
  /** Seconds from song start */
  time: number
  /** Duration in seconds */
  duration: number
  hand: 'left' | 'right' | 'either'
  /** Suggested finger (1=thumb, 5=pinky) */
  finger?: number
  /** Suggested velocity 0-127 */
  velocity: number
  /** Runtime state — not serialized */
  matched?: boolean
  missed?: boolean
}

export interface SongSection {
  name: string
  startTime: number
  endTime: number
}

export interface SongMetadata {
  source: 'curriculum' | 'midi-import' | 'user-created'
  midiFileName?: string
  importedAt?: Date
}

export interface Song {
  id: string
  title: string
  composer?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  bpm: number
  timeSignature: TimeSignature
  keySignature: KeySignature
  /** Total duration in seconds */
  duration: number
  /** Count-in beats before notes start */
  countInBeats: number
  notes: SongNote[]
  sections?: SongSection[]
  metadata?: SongMetadata
}
