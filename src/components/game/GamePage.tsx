import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useGameEngine } from '@/hooks/useGameEngine'
import { useInput } from '@/hooks/useInput'
import { inputManager } from '@/input/InputManager'
import { PianoKeyboard } from './PianoKeyboard'
import { ScoreDisplay } from './ScoreDisplay'
import { TimingFeedback } from './TimingFeedback'
import { PracticeControls } from './PracticeControls'
import { SongProgress } from './SongProgress'
import { GameOverScreen } from './GameOverScreen'
import type { Song } from '@/types/song'
import type { TimingGrade } from '@/types/scoring'
import { isBlackKey } from '@/lib/music-theory'

interface GamePageProps {
  song: Song
  onBack: () => void
}

export function GamePage({ song, onBack }: GamePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { startGame, pauseGame, resumeGame, setCanvas } = useGameEngine()
  const status = useGameStore(s => s.status)
  const keyboardSize = useSettingsStore(s => s.keyboardSize)
  
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set())
  const [noteResultMap, setNoteResultMap] = useState<Map<number, TimingGrade>>(new Map())

  // Determine piano range from song notes or forced by physical keyboard size
  const { minNote, maxNote } = useMemo(() => {
    if (keyboardSize !== 'auto') {
      switch (keyboardSize) {
        case 25: return { minNote: 48, maxNote: 72 } // C3 - C5
        case 37: return { minNote: 36, maxNote: 72 } // C2 - C5
        case 49: return { minNote: 36, maxNote: 84 } // C2 - C6
        case 61: return { minNote: 36, maxNote: 96 } // C2 - C7
        case 88: return { minNote: 21, maxNote: 108 } // A0 - C8
      }
    }
    // Auto mode: find bounds based on the song
    const songMin = Math.min(...song.notes.map(n => n.midiNote))
    const songMax = Math.max(...song.notes.map(n => n.midiNote))
    // Add a small buffer around the song's range
    return {
      minNote: Math.max(21, songMin - 2),
      maxNote: Math.min(108, songMax + 2)
    }
  }, [song.notes, keyboardSize])

  // Count white keys to set a consistent width for both canvas and keyboard
  const whiteKeyCount = useMemo(() => {
    let count = 0
    for (let i = minNote; i <= maxNote; i++) {
      if (!isBlackKey(i)) count++
    }
    return count
  }, [minNote, maxNote])

  // In 1:1 mode, you want keys to roughly match physical size (approx 22-24mm per white key). 
  // We'll use 40px base, but it scales via CSS depending on screen. 
  // The important part is that the ratio between keys is perfect.
  const containerWidth = whiteKeyCount * 40

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current)
    }
  }, [setCanvas])

  // Start game — wait a bit for renderer to initialize
  useEffect(() => {
    const timer = setTimeout(() => startGame(song), 800)
    return () => {
      clearTimeout(timer)
      inputManager.clearAllLights()
    }
  }, [song, startGame])

  // Track active notes for keyboard
  useInput((event) => {
    setActiveNotes(prev => {
      const next = new Set(prev)
      if (event.type === 'noteon') next.add(event.note)
      else next.delete(event.note)
      return next
    })

    // Flash note result on keyboard
    if (event.type === 'noteon') {
      const results = useGameStore.getState().noteResults
      const lastResult = results[results.length - 1]
      if (lastResult) {
        setNoteResultMap(prev => {
          const next = new Map(prev)
          next.set(event.note, lastResult.grade)
          return next
        })
        setTimeout(() => {
          setNoteResultMap(prev => {
            const next = new Map(prev)
            next.delete(event.note)
            return next
          })
        }, 300)
      }
    }
  })

  const handleReplay = useCallback(() => {
    useGameStore.getState().reset()
    setTimeout(() => startGame(song), 500)
  }, [song, startGame])

  // Keyboard shortcut for pause
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault()
        const s = useGameStore.getState().status
        if (s === 'playing') pauseGame()
        else if (s === 'paused') resumeGame()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pauseGame, resumeGame])

  // Get matched note IDs from the store to compute target notes
  const noteResults = useGameStore(s => s.noteResults)
  const currentTime = useGameStore(s => s.currentTime)
  const matchedNoteIds = useMemo(
    () => new Set(noteResults.filter(r => r.noteId).map(r => r.noteId)),
    [noteResults],
  )

  // Target notes and their fingerings
  const isWaitMode = useGameStore(s => s.isWaitMode)
  const { targetNotes, fingerNumbers } = useMemo(() => {
    const upcoming = song.notes.filter(n => !matchedNoteIds.has(n.id) && n.time >= currentTime - 0.1)
    if (upcoming.length === 0) return { targetNotes: new Set<number>(), fingerNumbers: new Map<number, number>() }
    
    let filtered: typeof upcoming
    if (isWaitMode) {
      const firstTime = Math.min(...upcoming.map(n => n.time))
      filtered = upcoming.filter(n => n.time === firstTime)
    } else {
      filtered = upcoming.filter(n => n.time - currentTime < 0.3)
    }

    const notes = new Set(filtered.map(n => n.midiNote))
    const fingers = new Map<number, number>()
    filtered.forEach(n => {
      if (n.finger) fingers.set(n.midiNote, n.finger)
    })

    return { targetNotes: notes, fingerNumbers: fingers }
  }, [song.notes, matchedNoteIds, currentTime, isWaitMode])

  // Sync target notes with physical MIDI keyboard lights
  const prevTargetNotesRef = useRef<Set<number>>(new Set())
  useEffect(() => {
    if (status !== 'playing') {
      if (prevTargetNotesRef.current.size > 0) {
        inputManager.clearAllLights()
        prevTargetNotesRef.current.clear()
      }
      return
    }

    const current = targetNotes
    const previous = prevTargetNotesRef.current

    // Turn off notes that are no longer targeted
    for (const note of previous) {
      if (!current.has(note)) {
        inputManager.turnOffNote(note)
      }
    }

    // Turn on new target notes
    for (const note of current) {
      if (!previous.has(note)) {
        // Use a velocity of 127 for bright, or map based on finger if available.
        inputManager.lightUpNote(note, 127)
      }
    }

    prevTargetNotesRef.current = new Set(current)
  }, [targetNotes, status])

  if (status === 'complete') {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background">
        <GameOverScreen onReplay={handleReplay} onBack={onBack} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Top bar: song info + score */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-md z-10 relative shadow-xl">
        <div>
          <h2 className="text-xl font-black text-foreground">{song.title}</h2>
          {song.composer && (
            <p className="text-sm font-medium text-muted-foreground">{song.composer}</p>
          )}
        </div>
        <div className="flex items-center gap-8">
          <TimingFeedback />
          <ScoreDisplay />
        </div>
      </div>

      {/* Falling notes + keyboard share the same width, centered */}
      <div className="flex-1 flex flex-col items-center min-h-0 bg-gradient-to-b from-background to-card/30 relative">
        
        {/* Wait Mode visual indicator background pulse */}
        {isWaitMode && targetNotes.size > 0 && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
        )}

        {/* Falling notes canvas — same width as keyboard */}
        <div
          className="flex-1 relative min-h-0 w-full"
          style={{ maxWidth: `${containerWidth}px` }}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Countdown overlay */}
          {status === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-black text-primary animate-pulse drop-shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                {Math.max(1, Math.ceil(-currentTime / (60 / song.bpm)))}
              </span>
            </div>
          )}

          {/* Pause overlay */}
          {status === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
              <div className="text-center bg-card p-8 rounded-3xl border border-border shadow-2xl">
                <p className="text-4xl font-black mb-2">En Pause</p>
                <p className="text-muted-foreground font-medium">Appuyez sur <kbd className="bg-muted px-2 py-1 rounded-md text-xs">Échap</kbd> pour reprendre</p>
              </div>
            </div>
          )}
        </div>

        {/* Song progress */}
        <div className="w-full px-4 py-2 z-10" style={{ maxWidth: `${containerWidth}px` }}>
          <SongProgress />
        </div>

        {/* Piano keyboard — same width as canvas */}
        <div className="pb-4 z-10 w-full px-2" style={{ maxWidth: `${containerWidth + 16}px` }}>
          <div className="bg-card/80 backdrop-blur-xl p-2 rounded-2xl border border-border/50 shadow-2xl">
            <PianoKeyboard
              lowNote={minNote}
              highNote={maxNote}
              activeNotes={activeNotes}
              targetNotes={targetNotes}
              noteResults={noteResultMap}
              fingerNumbers={fingerNumbers}
            />
          </div>
        </div>

        {/* Practice controls */}
        <div className="absolute bottom-6 right-6 z-20 bg-card/90 backdrop-blur-md p-2 rounded-2xl border border-border shadow-2xl">
          <PracticeControls />
        </div>
      </div>
    </div>
  )
}
