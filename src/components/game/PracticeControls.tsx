import { useGameStore } from '@/store/gameStore'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Zap, Timer, Repeat, X, Hand } from 'lucide-react'

export function PracticeControls() {
  const playbackSpeed = useGameStore(s => s.playbackSpeed)
  const isWaitMode = useGameStore(s => s.isWaitMode)
  const isAutoSpeedEnabled = useGameStore(s => s.isAutoSpeedEnabled)
  const activeHand = useGameStore(s => s.activeHand)
  const loopStart = useGameStore(s => s.loopStart)
  const status = useGameStore(s => s.status)
  
  const setPlaybackSpeed = useGameStore(s => s.setPlaybackSpeed)
  const setWaitMode = useGameStore(s => s.setWaitMode)
  const setAutoSpeed = useGameStore(s => s.setAutoSpeed)
  const setActiveHand = useGameStore(s => s.setActiveHand)
  const setLoop = useGameStore(s => s.setLoop)

  if (status === 'idle' || status === 'complete') return null

  return (
    <div className="flex items-center gap-6 p-1">
      {/* Hand selection */}
      <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-2xl border border-border/50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveHand('left')}
          className={cn(
            'p-2 rounded-xl transition-all flex items-center justify-center',
            activeHand === 'left' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'
          )}
          title="Main Gauche"
        >
          <Hand size={16} className="-scale-x-100" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveHand('both')}
          className={cn(
            'px-3 py-1.5 rounded-xl transition-all flex items-center justify-center text-[10px] font-black',
            activeHand === 'both' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'
          )}
          title="Les Deux Mains"
        >
          2
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveHand('right')}
          className={cn(
            'p-2 rounded-xl transition-all flex items-center justify-center',
            activeHand === 'right' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'
          )}
          title="Main Droite"
        >
          <Hand size={16} />
        </motion.button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-2xl border border-border/50">
        <Timer size={16} className="text-muted-foreground ml-1" />
        <div className="flex gap-1">
          {[0.5, 0.75, 1, 1.25, 1.5].map(speed => (
            <motion.button
              key={speed}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-black transition-all',
                Math.abs(playbackSpeed - speed) < 0.01
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {speed}x
            </motion.button>
          ))}
        </div>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Auto Speed toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setAutoSpeed(!isAutoSpeedEnabled)}
          title="Auto Speed Up"
          className={cn(
            'p-2 rounded-xl transition-all',
            isAutoSpeedEnabled 
              ? 'bg-perfect text-white shadow-lg shadow-perfect/30' 
              : 'text-muted-foreground hover:bg-secondary'
          )}
        >
          <Zap size={16} fill={isAutoSpeedEnabled ? "currentColor" : "none"} />
        </motion.button>
      </div>

      <div className="flex gap-2">
        {/* Wait mode toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setWaitMode(!isWaitMode)}
          className={cn(
            'px-4 py-2 rounded-2xl text-xs font-black transition-all border flex items-center gap-2',
            isWaitMode
              ? 'bg-accent border-accent/20 text-white shadow-lg shadow-accent/30'
              : 'bg-card border-border text-muted-foreground hover:bg-secondary',
          )}
        >
          <div className={cn("w-2 h-2 rounded-full", isWaitMode ? "bg-white animate-pulse" : "bg-muted-foreground")} />
          MODE ATTENTE
        </motion.button>

        {/* Loop status/reset */}
        {loopStart !== null && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLoop(null, null)}
            className="px-4 py-2 rounded-2xl text-xs font-black transition-all border border-primary/20 bg-primary/10 text-primary flex items-center gap-2"
          >
            <Repeat size={14} />
            BOUCLE ACTIVE
            <X size={14} />
          </motion.button>
        )}
      </div>
    </div>
  )
}
