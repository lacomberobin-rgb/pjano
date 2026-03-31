import { parseMidi } from 'midi-file'
import type { Song, SongNote } from '@/types/song'
import { isBlackKey } from './music-theory'

interface RawNote {
  midiNote: number
  startTick: number
  endTick: number
  velocity: number
  track: number
}

export function parseMidiFile(buffer: ArrayBuffer, title?: string): Song {
  const midi = parseMidi(new Uint8Array(buffer))
  const ticksPerBeat = midi.header.ticksPerBeat ?? 480

  // Extract tempo
  let bpm = 120
  for (const track of midi.tracks) {
    for (const event of track) {
      if (event.type === 'setTempo') {
        bpm = Math.round(60000000 / event.microsecondsPerBeat)
        break
      }
    }
    if (bpm !== 120) break
  }

  // Extract time signature
  let timeSig: [number, number] = [4, 4]
  for (const track of midi.tracks) {
    for (const event of track) {
      if (event.type === 'timeSignature') {
        timeSig = [event.numerator, Math.pow(2, event.denominator)]
        break
      }
    }
  }

  // Collect notes
  const rawNotes: RawNote[] = []
  for (let trackIndex = 0; trackIndex < midi.tracks.length; trackIndex++) {
    let absoluteTick = 0
    const pending = new Map<number, { tick: number; velocity: number }>()

    for (const event of midi.tracks[trackIndex]!) {
      absoluteTick += event.deltaTime

      if (event.type === 'noteOn' && event.velocity > 0) {
        pending.set(event.noteNumber, { tick: absoluteTick, velocity: event.velocity })
      } else if (
        event.type === 'noteOff' ||
        (event.type === 'noteOn' && event.velocity === 0)
      ) {
        const start = pending.get(event.noteNumber)
        if (start) {
          rawNotes.push({
            midiNote: event.noteNumber,
            startTick: start.tick,
            endTick: absoluteTick,
            velocity: start.velocity,
            track: trackIndex,
          })
          pending.delete(event.noteNumber)
        }
      }
    }
  }

  const tickToSeconds = (tick: number) => (tick / ticksPerBeat) * (60 / bpm)
  const hasMultipleTracks = new Set(rawNotes.map(n => n.track)).size > 1

  const notes: SongNote[] = rawNotes
    .sort((a, b) => a.startTick - b.startTick)
    .map((raw, index) => ({
      id: `m-${index}`,
      midiNote: raw.midiNote,
      time: tickToSeconds(raw.startTick),
      duration: Math.max(tickToSeconds(raw.endTick - raw.startTick), 0.05),
      hand: hasMultipleTracks
        ? (raw.track === 0 ? 'right' as const : raw.track === 1 ? 'left' as const : 'either' as const)
        : (raw.midiNote >= 60 ? 'right' as const : 'left' as const),
      velocity: raw.velocity,
    }))

  const duration = notes.length > 0
    ? notes[notes.length - 1]!.time + notes[notes.length - 1]!.duration
    : 0

  return {
    id: `midi-${Date.now()}`,
    title: title ?? 'Imported MIDI',
    difficulty: estimateDifficulty(notes, bpm),
    bpm,
    timeSignature: timeSig,
    keySignature: 'C',
    duration,
    countInBeats: timeSig[0],
    notes,
    metadata: { source: 'midi-import', midiFileName: title },
  }
}

function estimateDifficulty(notes: SongNote[], bpm: number): 1 | 2 | 3 | 4 | 5 {
  if (notes.length === 0) return 1
  const lastNote = notes[notes.length - 1]!
  const nps = notes.length / (lastNote.time + lastNote.duration || 1)
  const range = Math.max(...notes.map(n => n.midiNote)) - Math.min(...notes.map(n => n.midiNote))
  const bothHands = notes.some(n => n.hand === 'left') && notes.some(n => n.hand === 'right')
  const hasBlackKeys = notes.some(n => isBlackKey(n.midiNote))

  let score = 0
  score += nps * 10
  score += range / 12
  score += bothHands ? 15 : 0
  score += hasBlackKeys ? 5 : 0
  score += bpm > 140 ? 10 : bpm > 100 ? 5 : 0

  if (score < 10) return 1
  if (score < 20) return 2
  if (score < 35) return 3
  if (score < 50) return 4
  return 5
}
