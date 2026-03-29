import type { MidiNote, NoteName, PitchClass } from '@/types/music'

const NOTE_NAMES: PitchClass[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
]

const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
}

/**
 * Convert MIDI note number to note name (e.g. 60 → "C4")
 */
export function midiToNoteName(midi: MidiNote): NoteName {
  const octave = Math.floor(midi / 12) - 1
  const noteIndex = midi % 12
  return `${NOTE_NAMES[noteIndex]}${octave}`
}

/**
 * Convert note name to MIDI number (e.g. "C4" → 60)
 */
export function noteNameToMidi(name: NoteName): MidiNote {
  const match = name.match(/^([A-G]#?)(\d+)$/)
  if (!match) throw new Error(`Invalid note name: ${name}`)
  const [, pitchClass, octaveStr] = match
  const noteIndex = NOTE_NAMES.indexOf(pitchClass as PitchClass)
  if (noteIndex === -1) throw new Error(`Invalid pitch class: ${pitchClass}`)
  return (parseInt(octaveStr) + 1) * 12 + noteIndex
}

/**
 * Get the pitch class of a MIDI note (e.g. 60 → "C")
 */
export function midiToPitchClass(midi: MidiNote): PitchClass {
  return NOTE_NAMES[midi % 12]!
}

/**
 * Get the octave of a MIDI note (e.g. 60 → 4)
 */
export function midiToOctave(midi: MidiNote): number {
  return Math.floor(midi / 12) - 1
}

/**
 * Check if a MIDI note is a black key
 */
export function isBlackKey(midi: MidiNote): boolean {
  const pc = midi % 12
  return pc === 1 || pc === 3 || pc === 6 || pc === 8 || pc === 10
}

/**
 * Check if a MIDI note is a white key
 */
export function isWhiteKey(midi: MidiNote): boolean {
  return !isBlackKey(midi)
}

/**
 * Get display name for a note (use flats when appropriate)
 */
export function midiToDisplayName(midi: MidiNote, useFlats = false): string {
  const octave = Math.floor(midi / 12) - 1
  const pitchClass = NOTE_NAMES[midi % 12]!
  if (useFlats && pitchClass in SHARP_TO_FLAT) {
    return `${SHARP_TO_FLAT[pitchClass]}${octave}`
  }
  return `${pitchClass}${octave}`
}

/**
 * Count white keys in a MIDI range (inclusive)
 */
export function countWhiteKeys(low: MidiNote, high: MidiNote): number {
  let count = 0
  for (let i = low; i <= high; i++) {
    if (isWhiteKey(i)) count++
  }
  return count
}
