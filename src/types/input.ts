export type InputEventType = 'noteon' | 'noteoff'
export type InputSource = 'midi' | 'screen' | 'keyboard'

export interface PianoInputEvent {
  type: InputEventType
  /** MIDI note number (0-127) */
  note: number
  /** Velocity (0-127) */
  velocity: number
  /** High-resolution timestamp from performance.now() */
  timestamp: DOMHighResTimeStamp
  source: InputSource
}

export type InputListener = (event: PianoInputEvent) => void

export interface InputAdapter {
  connect(): void | Promise<void>
  disconnect(): void
  isConnected(): boolean
  
  // Optional methods for hardware that supports visual feedback (like MIDI keys lighting up)
  lightUpNote?(note: number, colorVelocity?: number): void
  turnOffNote?(note: number): void
  clearAllLights?(): void
}
