import { useEffect, useRef } from 'react'
import type { PianoInputEvent } from '@/types/input'
import { inputManager } from '@/input/InputManager'

/**
 * Subscribe to all piano input events (MIDI, screen, keyboard).
 * The callback fires synchronously on every event.
 */
export function useInput(callback: (event: PianoInputEvent) => void): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    return inputManager.subscribe((event) => callbackRef.current(event))
  }, [])
}
