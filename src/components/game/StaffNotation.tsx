import { useMemo } from 'react'
import type { Song } from '@/types/song'
import { isBlackKey } from '@/lib/music-theory'

interface StaffNotationProps {
  song: Song
  currentTime: number
}

// Vertical position on treble staff: C4=0, each step = half-space
// Middle line is B4 (index 6 from bottom of staff)
function noteToStaffY(midiNote: number): number {
  const noteMap: Record<number, number> = {
    0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6,
  }
  const octave = Math.floor(midiNote / 12) - 1
  const pc = midiNote % 12
  const stepsFromC4 = (octave - 4) * 7 + (noteMap[pc] ?? 0)
  // Staff Y: 0 = top line (F5), positive = down
  // Middle line (B4) is at y=40, spacing=8
  return 40 - stepsFromC4 * 4
}

export function StaffNotation({ song, currentTime }: StaffNotationProps) {
  const width = 400
  const height = 120

  // Show notes within a window around currentTime
  const visibleNotes = useMemo(() => {
    const windowStart = currentTime - 1
    const windowEnd = currentTime + 4
    return song.notes.filter(n => n.time >= windowStart && n.time <= windowEnd)
  }, [song.notes, currentTime])

  const pixelsPerSecond = 80

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Staff lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={i}
          x1="10" y1={24 + i * 8} x2={width - 10} y2={24 + i * 8}
          stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5}
        />
      ))}

      {/* Treble clef symbol */}
      <text x="16" y="50" fontSize="28" fill="currentColor" opacity={0.4}>
        {'\u{1D11E}'}
      </text>

      {/* Current position line */}
      <line
        x1="100" y1="16" x2="100" y2={height - 16}
        stroke="#7c3aed" strokeWidth={1.5} opacity={0.6}
      />

      {/* Notes */}
      {visibleNotes.map(note => {
        const x = 100 + (note.time - currentTime) * pixelsPerSecond
        const y = noteToStaffY(note.midiNote)
        const matched = note.matched
        const missed = note.missed
        const isSharp = isBlackKey(note.midiNote)

        if (x < 10 || x > width - 20) return null

        return (
          <g key={note.id}>
            {/* Ledger lines if needed */}
            {y > 56 && (
              <line x1={x - 6} y1={56} x2={x + 6} y2={56}
                stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.5} />
            )}
            {y < 24 && (
              <line x1={x - 6} y1={24} x2={x + 6} y2={24}
                stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.5} />
            )}

            {/* Accidental */}
            {isSharp && (
              <text x={x - 10} y={y + 3} fontSize="8" fill="currentColor" opacity={0.6}>
                #
              </text>
            )}

            {/* Note head */}
            <ellipse
              cx={x} cy={y} rx={3.5} ry={2.8}
              fill={matched ? '#22c55e' : missed ? '#ef4444' : 'currentColor'}
              opacity={missed ? 0.3 : 0.8}
              transform={`rotate(-15, ${x}, ${y})`}
            />

            {/* Stem */}
            <line
              x1={x + 3} y1={y} x2={x + 3} y2={y - 20}
              stroke={matched ? '#22c55e' : missed ? '#ef4444' : 'currentColor'}
              strokeWidth={0.8}
              opacity={missed ? 0.3 : 0.6}
            />

            {/* Finger number */}
            {note.finger && !matched && (
              <text x={x} y={y - 24} textAnchor="middle" fontSize="6"
                fill="#7c3aed" fontWeight="bold">
                {note.finger}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
