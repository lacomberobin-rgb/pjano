import { useGameStore } from '@/store/gameStore'

export function ScoreDisplay() {
  const score = useGameStore(s => s.score)
  const combo = useGameStore(s => s.combo)
  const accuracy = useGameStore(s => s.accuracy)

  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <div className="text-3xl font-bold tabular-nums">{score.toLocaleString()}</div>
      <div className="flex items-center gap-3 text-sm">
        {combo > 0 && (
          <span className="text-primary font-bold">{combo}x combo</span>
        )}
        <span className="text-muted-foreground">{accuracy}%</span>
      </div>
    </div>
  )
}
