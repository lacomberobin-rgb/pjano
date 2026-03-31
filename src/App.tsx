import { useCallback, useEffect, useState } from 'react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { inputManager } from '@/input/InputManager'
import { ComputerKeyboardAdapter } from '@/input/ComputerKeyboardAdapter'
import { MidiInputAdapter } from '@/input/MidiInputAdapter'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { CurriculumPage } from '@/components/curriculum/CurriculumPage'
import { GamePage } from '@/components/game/GamePage'
import { LibraryPage } from '@/components/library/LibraryPage'
import { SettingsPage } from '@/components/settings/SettingsPage'
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
          <h1 className="text-4xl font-black text-primary mb-6">pjano</h1>
          <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            Loading piano samples...
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
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar totalXP={totalXP} streak={streak} />

        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage totalXP={totalXP} streak={streak} onNavigate={handleNavigate} />
          )}
          {currentPage === 'learn' && (
            <CurriculumPage onStartLesson={handleStartLesson} />
          )}
          {currentPage === 'library' && (
            <LibraryPage onPlaySong={handlePlaySong} />
          )}
          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  )
}
