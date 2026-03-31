import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useGameEngine } from '@/hooks/useGameEngine'
import { useInput } from '@/hooks/useInput'
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
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set())
  const [noteResultMap, setNoteResultMap] = useState<Map<number, TimingGrade>>(new Map())

  // Determine piano range from song notes
  const minNote = Math.max(36, Math.min(...song.notes.map(n => n.midiNote)) - 2)
  const maxNote = Math.min(96, Math.max(...song.notes.map(n => n.midiNote)) + 2)

  // Count white keys to set a consistent width for both canvas and keyboard
  const whiteKeyCount = useMemo(() => {
    let count = 0
    for (let i = minNote; i <= maxNote; i++) {
      if (!isBlackKey(i)) count++
    }
    return count
  }, [minNote, maxNote])

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
    return () => clearTimeout(timer)
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

  const targetNotes = useMemo(() => new Set(
    song.notes
      .filter(n => !matchedNoteIds.has(n.id) && Math.abs(n.time - currentTime) < 0.3)
      .map(n => n.midiNote),
  ), [song.notes, matchedNoteIds, currentTime])

  if (status === 'complete') {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background">
        <GameOverScreen onReplay={handleReplay} onBack={onBack} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top bar: song info + score */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div>
          <h2 className="text-sm font-bold">{song.title}</h2>
          {song.composer && (
            <p className="text-xs text-muted-foreground">{song.composer}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <TimingFeedback />
          <ScoreDisplay />
        </div>
      </div>

      {/* Falling notes + keyboard share the same width, centered */}
      <div className="flex-1 flex flex-col items-center min-h-0">
        {/* Falling notes canvas — same width as keyboard */}
        <div
          className="flex-1 relative min-h-0 w-full"
          style={{ maxWidth: `${containerWidth}px` }}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Countdown overlay */}
          {status === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-black text-primary animate-pulse">
                {Math.max(1, Math.ceil(-currentTime / (60 / song.bpm)))}
              </span>
            </div>
          )}

          {/* Pause overlay */}
          {status === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <p className="text-2xl font-bold mb-2">Paused</p>
                <p className="text-sm text-muted-foreground">Press Esc to resume</p>
              </div>
            </div>
          )}
        </div>

        {/* Song progress */}
        <div className="w-full px-4 py-1" style={{ maxWidth: `${containerWidth}px` }}>
          <SongProgress />
        </div>

        {/* Piano keyboard — same width as canvas */}
        <div className="pb-2">
          <PianoKeyboard
            lowNote={minNote}
            highNote={maxNote}
            activeNotes={activeNotes}
            targetNotes={targetNotes}
            noteResults={noteResultMap}
          />
        </div>

        {/* Practice controls */}
        <div className="pb-3">
          <PracticeControls />
        </div>
      </div>
    </div>
  )
}
