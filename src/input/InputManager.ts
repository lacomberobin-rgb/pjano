import type { InputAdapter, InputListener, PianoInputEvent } from '@/types/input'

export class InputManager {
  private listeners = new Set<InputListener>()
  private adapters: InputAdapter[] = []
  private activeNotes = new Set<number>()

  addAdapter(adapter: InputAdapter): void {
    this.adapters.push(adapter)
  }

  removeAdapter(adapter: InputAdapter): void {
    adapter.disconnect()
    this.adapters = this.adapters.filter(a => a !== adapter)
  }

  subscribe(listener: InputListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  emit(event: PianoInputEvent): void {
    if (event.type === 'noteon') {
      this.activeNotes.add(event.note)
    } else {
      this.activeNotes.delete(event.note)
    }
    for (const listener of this.listeners) {
      listener(event)
    }
  }

  getActiveNotes(): Set<number> {
    return new Set(this.activeNotes)
  }

  destroy(): void {
    for (const adapter of this.adapters) {
      adapter.disconnect()
    }
    this.adapters = []
    this.listeners.clear()
    this.activeNotes.clear()
  }
}

// Singleton — must NOT go through React for latency reasons
export const inputManager = new InputManager()
