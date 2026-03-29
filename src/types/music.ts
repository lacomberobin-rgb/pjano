/** MIDI note number (0-127), e.g. Middle C = 60 */
export type MidiNote = number

/** Note name with octave, e.g. "C4", "F#3", "Bb5" */
export type NoteName = string

/** Time signature as [beats per measure, beat unit] */
export type TimeSignature = [number, number]

/** Key signature, e.g. "C", "G", "F", "Bb", "D" */
export type KeySignature = string

/** Duration in beats */
export type BeatDuration = number

/** A pitch class without octave: "C", "C#", "D", etc. */
export type PitchClass =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
