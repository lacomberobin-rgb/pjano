import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'

export function SongProgress() {
  const currentTime = useGameStore(s => s.currentTime)
  const song = useGameStore(s => s.song)
  const loopStart = useGameStore(s => s.loopStart)
  const loopEnd = useGameStore(s => s.loopEnd)
  const setLoop = useGameStore(s => s.setLoop)
  const setCurrentTime = useGameStore(s => s.setCurrentTime)

  if (!song) return null

  const progress = Math.max(0, Math.min(1, currentTime / song.duration))
  const elapsed = Math.max(0, Math.floor(currentTime))
  const total = Math.floor(song.duration)
  
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickedTime = (x / rect.width) * song.duration

    if (loopStart === null) {
      // First click sets start
      setLoop(clickedTime, null)
    } else if (loopEnd === null) {
      // Second click sets end
      if (clickedTime > loopStart) {
        setLoop(loopStart, clickedTime)
      } else {
        setLoop(clickedTime, loopStart)
      }
    } else {
      // Third click sets playhead or resets? 
      // Let's make it set playhead to allow jumping around
      setCurrentTime(clickedTime)
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full group">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black text-muted-foreground tabular-nums">
          {formatTime(elapsed)}
        </span>
        <span className="text-[10px] font-black text-muted-foreground tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
          CLIQUE POUR BOUCLER
        </span>
        <span className="text-[10px] font-black text-muted-foreground tabular-nums">
          {formatTime(total)}
        </span>
      </div>

      <div 
        onClick={handleBarClick}
        className="relative h-3 bg-secondary/50 rounded-full overflow-hidden cursor-crosshair border border-border/20 shadow-inner"
      >
        {/* Active Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent z-10 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.3)]"
          style={{ width: `${progress * 100}%` }}
        />

        {/* Loop Selection Overlay */}
        {loopStart !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 h-full bg-primary/20 border-x border-primary/50 z-0"
            style={{
              left: `${(loopStart / song.duration) * 100}%`,
              width: loopEnd !== null 
                ? `${((loopEnd - loopStart) / song.duration) * 100}%`
                : '2px'
            }}
          />
        )}

        {/* Playhead handle */}
        <motion.div 
          className="absolute top-0 w-1 h-full bg-white z-20 shadow-[0_0_8px_white]"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
