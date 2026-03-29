import type { InputAdapter } from '@/types/input'
import type { InputManager } from './InputManager'

export class ScreenKeyboardAdapter implements InputAdapter {
  private manager: InputManager
  private connected = false

  constructor(manager: InputManager) {
    this.manager = manager
  }

  noteOn(note: number, velocity = 80): void {
    if (!this.connected) return
    this.manager.emit({
      type: 'noteon',
      note,
      velocity,
      timestamp: performance.now(),
      source: 'screen',
    })
  }

  noteOff(note: number): void {
    if (!this.connected) return
    this.manager.emit({
      type: 'noteoff',
      note,
      velocity: 0,
      timestamp: performance.now(),
      source: 'screen',
    })
  }

  connect(): void {
    this.connected = true
  }

  disconnect(): void {
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }
}
