import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useInput } from '@/hooks/useInput'
import { PianoKeyboard } from '@/components/game/PianoKeyboard'
import { Music2, Volume2, CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const LEVELS = [
  { id: 1, notes: [60], label: 'Do Central' },
  { id: 2, notes: [60, 62, 64], label: 'Do - Ré - Mi' },
  { id: 3, notes: [60, 64, 67], label: 'Accord Majeur (Do)' },
  { id: 4, notes: [60, 63, 67], label: 'Accord Mineur (Do)' },
  { id: 5, notes: [60, 62, 64, 65, 67], label: 'Gamme Majeure' },
]

export function EarTrainingPage() {
  const { playNote, stopNote } = useAudioEngine()
  const [currentLevel, setCurrentLevel] = useState(0)
  const [targetNotes, setTargetNotes] = useState<number[]>([])
  const [userNotes, setUserNotes] = useState<number[]>([])
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'waiting' | 'success' | 'fail'>('idle')
  const [activeInputNotes, setActiveInputNotes] = useState<Set<number>>(new Set())

  const startLevel = useCallback((levelIdx: number) => {
    const level = LEVELS[levelIdx]
    // Randomly pick one note from the level's pool for now (or multiple for chords)
    // Simple version: pick one note
    const note = level.notes[Math.floor(Math.random() * level.notes.length)]
    
    setTargetNotes([note])
    setUserNotes([])
    setGameState('playing')
    
    // Play the target note
    setTimeout(() => {
      playNote(note, 0.5)
      setTimeout(() => {
        setGameState('waiting')
      }, 1000)
    }, 500)
  }, [playNote])

  useInput((event) => {
    if (gameState !== 'waiting') return

    if (event.type === 'noteon') {
      setActiveInputNotes(prev => new Set(prev).add(event.note))
      const isCorrect = targetNotes.includes(event.note)
      
      if (isCorrect) {
        setGameState('success')
        // Award some imaginary XP here?
      } else {
        setGameState('fail')
      }
    } else {
      setActiveInputNotes(prev => {
        const next = new Set(prev)
        next.delete(event.note)
        return next
      })
    }
  })

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <Volume2 className="text-accent" />
            Oreille Absolue
          </h2>
          <p className="text-muted-foreground font-medium">Écoute, identifie, et joue la note.</p>
        </div>
        <div className="bg-card px-4 py-2 rounded-2xl border border-border font-black text-accent">
          Niveau {currentLevel + 1}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Music2 size={48} className="text-accent" />
              </div>
              <button
                onClick={() => startLevel(currentLevel)}
                className="px-8 py-4 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all"
              >
                Commencer le Test
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <Volume2 size={32} className="text-primary" />
              </motion.div>
              <p className="font-black text-xl animate-pulse">ÉCOUTE...</p>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <p className="text-2xl font-black">À TON TOUR !</p>
              <p className="text-muted-foreground">Joue la note sur ton piano ou clavier.</p>
            </motion.div>
          )}

          {gameState === 'success' && (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 bg-perfect/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} className="text-perfect" />
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-perfect">PARFAIT !</p>
                <p className="text-muted-foreground font-medium">C'était bien un {targetNotes[0]}.</p>
              </div>
              <button
                onClick={() => {
                  if (currentLevel < LEVELS.length - 1) {
                    setCurrentLevel(l => l + 1)
                    startLevel(currentLevel + 1)
                  } else {
                    setGameState('idle')
                  }
                }}
                className="px-8 py-3 bg-perfect text-white rounded-2xl font-black shadow-lg"
              >
                {currentLevel < LEVELS.length - 1 ? 'Niveau Suivant' : 'Recommencer'}
              </button>
            </motion.div>
          )}

          {gameState === 'fail' && (
            <motion.div
              key="fail"
              initial={{ x: [-10, 10, -10, 10, 0], opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <XCircle size={48} className="text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-destructive">OUPS...</p>
                <p className="text-muted-foreground font-medium">Ce n'était pas la bonne note.</p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => startLevel(currentLevel)}
                  className="px-6 py-3 bg-secondary text-foreground rounded-2xl font-black border border-border flex items-center gap-2"
                >
                  Réessayer <RefreshCcw size={18} />
                </button>
                <button
                  onClick={() => {
                    playNote(targetNotes[0], 1)
                  }}
                  className="px-6 py-3 bg-card text-foreground rounded-2xl font-black border border-border flex items-center gap-2"
                >
                  Réécouter <Volume2 size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-border pt-8 pb-4 opacity-50">
        <PianoKeyboard
          lowNote={48}
          highNote={84}
          activeNotes={activeInputNotes}
          targetNotes={new Set()}
          noteResults={new Map()}
        />
      </div>
    </div>
  )
}
