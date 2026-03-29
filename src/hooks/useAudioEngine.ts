import { useCallback, useEffect, useRef, useState } from 'react'
import { audioEngine } from '@/lib/audio-engine'
import { inputManager } from '@/input/InputManager'

export function useAudioEngine() {
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const unsubRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      // Resume AudioContext on first user gesture
      const resumeOnGesture = async () => {
        await audioEngine.resume()
        window.removeEventListener('click', resumeOnGesture)
        window.removeEventListener('keydown', resumeOnGesture)
      }
      window.addEventListener('click', resumeOnGesture)
      window.addEventListener('keydown', resumeOnGesture)

      try {
        await audioEngine.load({
          onProgress: (p) => {
            if (!cancelled) setLoadProgress(p)
          },
        })
        if (!cancelled) setLoaded(true)
      } catch (err) {
        console.error('Failed to load audio samples:', err)
      }
    }

    init()

    // Wire input → audio (play sounds immediately on any input)
    unsubRef.current = inputManager.subscribe((event) => {
      if (event.type === 'noteon') {
        audioEngine.noteOn(event.note, event.velocity)
      } else {
        audioEngine.noteOff(event.note)
      }
    })

    return () => {
      cancelled = true
      unsubRef.current?.()
    }
  }, [])

  const setVolume = useCallback((db: number) => {
    audioEngine.setVolume(db)
  }, [])

  return { loaded, loadProgress, setVolume }
}
