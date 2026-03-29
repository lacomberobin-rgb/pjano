import { useCallback, useEffect, useMemo, useRef } from 'react'
import { isBlackKey, midiToNoteName } from '@/lib/music-theory'
import { inputManager } from '@/input/InputManager'
import { ScreenKeyboardAdapter } from '@/input/ScreenKeyboardAdapter'
import type { TimingGrade } from '@/types/scoring'
import { cn } from '@/lib/utils'

interface PianoKeyboardProps {
  lowNote: number
  highNote: number
  activeNotes: Set<number>
  targetNotes: Set<number>
  noteResults: Map<number, TimingGrade>
  fingerNumbers?: Map<number, number>
}

const GRADE_COLORS: Record<TimingGrade, string> = {
  perfect: 'bg-perfect',
  great: 'bg-great',
  good: 'bg-good',
  miss: 'bg-miss',
}

export function PianoKeyboard({
  lowNote,
  highNote,
  activeNotes,
  targetNotes,
  noteResults,
  fingerNumbers,
}: PianoKeyboardProps) {
  const adapterRef = useRef<ScreenKeyboardAdapter | null>(null)

  useEffect(() => {
    const adapter = new ScreenKeyboardAdapter(inputManager)
    adapter.connect()
    adapterRef.current = adapter
    return () => adapter.disconnect()
  }, [])

  const handleNoteOn = useCallback((note: number) => {
    adapterRef.current?.noteOn(note)
  }, [])

  const handleNoteOff = useCallback((note: number) => {
    adapterRef.current?.noteOff(note)
  }, [])

  // Build the list of keys to render
  const keys = useMemo(() => {
    const result: { midi: number; black: boolean }[] = []
    for (let midi = lowNote; midi <= highNote; midi++) {
      result.push({ midi, black: isBlackKey(midi) })
    }
    return result
  }, [lowNote, highNote])

  const whiteKeys = keys.filter(k => !k.black)
  const blackKeys = keys.filter(k => k.black)

  // Calculate black key positions relative to white keys
  const getBlackKeyPosition = useCallback((midi: number): number => {
    // Find the white key index to the left of this black key
    let whiteIndex = 0
    for (let i = lowNote; i < midi; i++) {
      if (!isBlackKey(i)) whiteIndex++
    }
    // Black keys sit between white keys, offset slightly
    const noteInOctave = midi % 12
    // Offset from center between the two white keys
    const offsets: Record<number, number> = {
      1: -0.05,   // C# — slightly left
      3: 0.05,    // D# — slightly right
      6: -0.08,   // F# — slightly left
      8: 0,       // G# — centered
      10: 0.08,   // A# — slightly right
    }
    const offset = offsets[noteInOctave] ?? 0
    return (whiteIndex + offset) // position in white-key units
  }, [lowNote])

  const whiteKeyCount = whiteKeys.length

  return (
    <div
      className="relative select-none touch-none"
      style={{ width: `min(100%, ${whiteKeyCount * 40}px)`, height: '200px' }}
    >
      {/* White keys */}
      {whiteKeys.map((key, index) => {
        const isActive = activeNotes.has(key.midi)
        const isTarget = targetNotes.has(key.midi)
        const result = noteResults.get(key.midi)
        const finger = fingerNumbers?.get(key.midi)

        return (
          <div
            key={key.midi}
            className={cn(
              'absolute top-0 border border-border/40 rounded-b-md cursor-pointer transition-colors duration-75',
              'hover:bg-gray-100',
              isActive && result ? GRADE_COLORS[result] : '',
              isActive && !result ? 'bg-primary/30' : '',
              !isActive && isTarget ? 'bg-primary/10' : '',
              !isActive && !isTarget && !result ? 'bg-white' : '',
            )}
            style={{
              left: `${(index / whiteKeyCount) * 100}%`,
              width: `${(1 / whiteKeyCount) * 100}%`,
              height: '100%',
              zIndex: 1,
            }}
            onPointerDown={(e) => {
              e.preventDefault()
              handleNoteOn(key.midi)
            }}
            onPointerUp={() => handleNoteOff(key.midi)}
            onPointerLeave={() => {
              if (activeNotes.has(key.midi)) handleNoteOff(key.midi)
            }}
            title={midiToNoteName(key.midi)}
          >
            {finger && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-bold">
                {finger}
              </span>
            )}
          </div>
        )
      })}

      {/* Black keys */}
      {blackKeys.map((key) => {
        const pos = getBlackKeyPosition(key.midi)
        const isActive = activeNotes.has(key.midi)
        const isTarget = targetNotes.has(key.midi)
        const result = noteResults.get(key.midi)
        const finger = fingerNumbers?.get(key.midi)

        return (
          <div
            key={key.midi}
            className={cn(
              'absolute top-0 rounded-b-md cursor-pointer transition-colors duration-75',
              isActive && result ? GRADE_COLORS[result] : '',
              isActive && !result ? 'bg-primary' : '',
              !isActive && isTarget ? 'bg-primary/60' : '',
              !isActive && !isTarget ? 'bg-gray-900' : '',
            )}
            style={{
              left: `${(pos / whiteKeyCount) * 100}%`,
              width: `${(0.6 / whiteKeyCount) * 100}%`,
              height: '62%',
              zIndex: 2,
              transform: 'translateX(-50%)',
            }}
            onPointerDown={(e) => {
              e.preventDefault()
              handleNoteOn(key.midi)
            }}
            onPointerUp={() => handleNoteOff(key.midi)}
            onPointerLeave={() => {
              if (activeNotes.has(key.midi)) handleNoteOff(key.midi)
            }}
            title={midiToNoteName(key.midi)}
          >
            {finger && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">
                {finger}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
