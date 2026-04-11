import { useCallback, useEffect, useState } from 'react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useInput } from '@/hooks/useInput'
import { inputManager } from '@/input/InputManager'
import { ComputerKeyboardAdapter } from '@/input/ComputerKeyboardAdapter'
import { MidiInputAdapter } from '@/input/MidiInputAdapter'
import { PianoKeyboard } from '@/components/game/PianoKeyboard'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { CurriculumPage } from '@/components/curriculum/CurriculumPage'
import { GamePage } from '@/components/game/GamePage'
import { LibraryPage } from '@/components/library/LibraryPage'
import { SettingsPage } from '@/components/settings/SettingsPage'
import { EarTrainingPage } from '@/components/game/EarTrainingPage'
import { testSong } from '@/data/test-song'
import { getLesson } from '@/data/curriculum'
import { useCurriculumStore } from '@/store/curriculumStore'
import type { Song } from '@/types/song'

export default function App() {
  const { loaded, loadProgress } = useAudioEngine()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [activeSong, setActiveSong] = useState<Song | null>(null)
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)

  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set())

  // Set up input adapters
  useEffect(() => {
    const keyboard = new ComputerKeyboardAdapter(inputManager)
    keyboard.connect()

    const midi = new MidiInputAdapter(inputManager)
    midi.connect()

    return () => {
      keyboard.disconnect()
      midi.disconnect()
    }
  }, [])

  // Track active notes for the persistent piano keyboard
  useInput((event) => {
    setActiveNotes(prev => {
      const next = new Set(prev)
      if (event.type === 'noteon') next.add(event.note)
      else next.delete(event.note)
      return next
    })
  })

  const handlePlaySong = useCallback((song: Song) => {
    setActiveSong(song)
    setCurrentPage('game')
  }, [])

  const handleStartLesson = useCallback((lessonId: string) => {
    const found = getLesson(lessonId)
    if (found) {
      setActiveSong(found.lesson.song)
      setCurrentPage('game')
    }
  }, [])

  const handleGameBack = useCallback(() => {
    // Award some XP on game completion
    const store = useCurriculumStore.getState()
    if (activeSong) {
      // Check if it was a lesson song and mark as completed
      const found = getLesson(activeSong.id)
      if (found) {
        store.completeLesson(found.lesson.id, found.module.id, found.module.lessons.length)
      }
      setTotalXP(prev => prev + 25)
      setStreak(prev => prev || 1)
    }
    setActiveSong(null)
    setCurrentPage('dashboard')
  }, [activeSong])

  const handleNavigate = useCallback((page: string) => {
    if (page === 'play') {
      handlePlaySong(testSong)
    } else {
      setCurrentPage(page)
    }
  }, [handlePlaySong])

  // Loading screen
  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-black text-primary mb-8 tracking-tighter"
          >
            pjano<span className="text-accent">.</span>
          </motion.h1>
          <div className="w-64 h-3 bg-secondary rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loadProgress * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            />
          </div>
          <p className="text-muted-foreground mt-4 text-sm font-bold uppercase tracking-widest opacity-50">
            Initialisation du piano...
          </p>
        </div>
      </div>
    )
  }

  // Game view — full screen, no sidebar
  if (currentPage === 'game' && activeSong) {
    return (
      <div className="h-screen">
        <GamePage song={activeSong} onBack={handleGameBack} />
      </div>
    )
  }

  // Main app shell
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar totalXP={totalXP} streak={streak} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-card/20">
          {currentPage === 'dashboard' && (
            <DashboardPage totalXP={totalXP} streak={streak} onNavigate={handleNavigate} />
          )}
          {currentPage === 'learn' && (
            <CurriculumPage onStartLesson={handleStartLesson} />
          )}
          {currentPage === 'ear-training' && (
            <EarTrainingPage />
          )}
          {currentPage === 'library' && (
            <LibraryPage onPlaySong={handlePlaySong} />
          )}
          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>

        {/* Persistent piano keyboard — only visible on certain pages to save space */}
        {currentPage !== 'ear-training' && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="border-t border-border bg-card/80 backdrop-blur-md px-4 py-4 flex justify-center shadow-2xl"
          >
            <PianoKeyboard
              lowNote={48}
              highNote={84}
              activeNotes={activeNotes}
              targetNotes={new Set()}
              noteResults={new Map()}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
