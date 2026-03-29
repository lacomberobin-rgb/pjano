import type { InputAdapter } from '@/types/input'
import type { InputManager } from './InputManager'
import { KEYBOARD_MAP } from '@/lib/constants'

export class ComputerKeyboardAdapter implements InputAdapter {
  private manager: InputManager
  private connected = false
  private heldKeys = new Set<string>()
  private handleKeyDown: (e: KeyboardEvent) => void
  private handleKeyUp: (e: KeyboardEvent) => void

  constructor(manager: InputManager) {
    this.manager = manager

    this.handleKeyDown = (e: KeyboardEvent) => {
      // Ignore repeat events and modifier combos
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return

      const midi = KEYBOARD_MAP[e.code]
      if (midi === undefined) return

      // Prevent duplicate note-on for held keys
      if (this.heldKeys.has(e.code)) return
      this.heldKeys.add(e.code)

      e.preventDefault()
      this.manager.emit({
        type: 'noteon',
        note: midi,
        velocity: 80,
        timestamp: performance.now(),
        source: 'keyboard',
      })
    }

    this.handleKeyUp = (e: KeyboardEvent) => {
      const midi = KEYBOARD_MAP[e.code]
      if (midi === undefined) return

      this.heldKeys.delete(e.code)
      e.preventDefault()
      this.manager.emit({
        type: 'noteoff',
        note: midi,
        velocity: 0,
        timestamp: performance.now(),
        source: 'keyboard',
      })
    }
  }

  connect(): void {
    if (this.connected) return
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    this.connected = true
  }

  disconnect(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    this.heldKeys.clear()
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }
}
