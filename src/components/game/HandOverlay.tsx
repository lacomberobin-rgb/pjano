import type { Song } from '@/types/song'

interface HandOverlayProps {
  song: Song
  currentTime: number
  level: 'full' | 'fingers' | 'off'
}

export function HandOverlay({ song, currentTime, level }: HandOverlayProps) {
  if (level === 'off') return null

  // Find the active note to highlight which finger to press
  const activeNotes = song.notes.filter(
    n => !n.matched && !n.missed && Math.abs(n.time - currentTime) < 0.4 && n.finger,
  )

  if (activeNotes.length === 0) return null

  const hand = activeNotes[0]?.hand ?? 'right'

  if (level === 'fingers') {
    // Just show finger numbers as floating badges
    return (
      <div className="absolute bottom-[220px] left-0 right-0 flex justify-center gap-2 pointer-events-none">
        {activeNotes.map(note => (
          <div
            key={note.id}
            className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg"
          >
            {note.finger}
          </div>
        ))}
      </div>
    )
  }

  // Full hand overlay — simplified SVG hand
  const isRight = hand === 'right'
  const activeFingers = new Set(activeNotes.map(n => n.finger))

  return (
    <div className="absolute bottom-[210px] left-1/2 -translate-x-1/2 pointer-events-none opacity-60">
      <svg
        width="200" height="100" viewBox="0 0 200 100"
        style={{ transform: isRight ? 'none' : 'scaleX(-1)' }}
      >
        {/* Simplified hand outline */}
        <ellipse cx="100" cy="75" rx="60" ry="30" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.3} />

        {/* 5 finger circles */}
        {[
          { finger: 1, cx: 50, cy: 55 },
          { finger: 2, cx: 65, cy: 25 },
          { finger: 3, cx: 85, cy: 15 },
          { finger: 4, cx: 110, cy: 22 },
          { finger: 5, cx: 135, cy: 40 },
        ].map(({ finger, cx, cy }) => {
          const isActive = activeFingers.has(finger)
          return (
            <g key={finger}>
              <circle
                cx={cx} cy={cy} r={isActive ? 14 : 10}
                fill={isActive ? '#7c3aed' : 'transparent'}
                stroke={isActive ? '#7c3aed' : 'currentColor'}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.3}
              >
                {isActive && (
                  <animate attributeName="r" values="12;14;12" dur="0.6s" repeatCount="indefinite" />
                )}
              </circle>
              <text
                x={cx} y={cy + 4} textAnchor="middle" fontSize="12"
                fontWeight="bold"
                fill={isActive ? 'white' : 'currentColor'}
                opacity={isActive ? 1 : 0.4}
              >
                {finger}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
