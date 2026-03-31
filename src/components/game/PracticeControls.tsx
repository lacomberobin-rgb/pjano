import { useGameStore } from '@/store/gameStore'
import { cn } from '@/lib/utils'

export function PracticeControls() {
  const playbackSpeed = useGameStore(s => s.playbackSpeed)
  const isWaitMode = useGameStore(s => s.isWaitMode)
  const status = useGameStore(s => s.status)
  const setPlaybackSpeed = useGameStore(s => s.setPlaybackSpeed)
  const setWaitMode = useGameStore(s => s.setWaitMode)

  if (status === 'idle' || status === 'complete') return null

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Speed control */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Speed</span>
        {[0.5, 0.75, 1, 1.25, 1.5].map(speed => (
          <button
            key={speed}
            onClick={() => setPlaybackSpeed(speed)}
            className={cn(
              'px-2 py-1 rounded text-xs font-medium transition-colors',
              playbackSpeed === speed
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            {speed}x
          </button>
        ))}
      </div>

      {/* Wait mode toggle */}
      <button
        onClick={() => setWaitMode(!isWaitMode)}
        className={cn(
          'px-3 py-1 rounded text-xs font-medium transition-colors',
          isWaitMode
            ? 'bg-accent text-accent-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        )}
      >
        Wait Mode {isWaitMode ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}
