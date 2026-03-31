import { useGameStore } from '@/store/gameStore'

export function SongProgress() {
  const currentTime = useGameStore(s => s.currentTime)
  const song = useGameStore(s => s.song)

  if (!song) return null

  const progress = Math.max(0, Math.min(1, currentTime / song.duration))
  const elapsed = Math.max(0, Math.floor(currentTime))
  const total = Math.floor(song.duration)
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-muted-foreground tabular-nums w-10">
        {formatTime(elapsed)}
      </span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-100 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
        {formatTime(total)}
      </span>
    </div>
  )
}
