import { useEffect, useState } from 'react'
import { PianoKeyboard } from '@/components/game/PianoKeyboard'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import { useInput } from '@/hooks/useInput'
import { inputManager } from '@/input/InputManager'
import { ComputerKeyboardAdapter } from '@/input/ComputerKeyboardAdapter'

export default function App() {
  const { loaded, loadProgress } = useAudioEngine()
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set())

  // Set up computer keyboard adapter
  useEffect(() => {
    const adapter = new ComputerKeyboardAdapter(inputManager)
    adapter.connect()
    return () => adapter.disconnect()
  }, [])

  // Track active notes for keyboard highlighting
  useInput((event) => {
    setActiveNotes(prev => {
      const next = new Set(prev)
      if (event.type === 'noteon') {
        next.add(event.note)
      } else {
        next.delete(event.note)
      }
      return next
    })
  })

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">pjano</h1>
          <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Loading piano samples...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-center py-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">pjano</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-end pb-8">
        <p className="text-muted-foreground mb-8 text-sm">
          Play using your MIDI keyboard, click the keys, or use your computer keyboard (Z-/ and A-;)
        </p>
        <PianoKeyboard
          lowNote={48}
          highNote={84}
          activeNotes={activeNotes}
          targetNotes={new Set()}
          noteResults={new Map()}
        />
      </main>
    </div>
  )
}
