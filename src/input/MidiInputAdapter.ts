import type { InputAdapter } from '@/types/input'
import type { InputManager } from './InputManager'

export class MidiInputAdapter implements InputAdapter {
  private manager: InputManager
  private connected = false
  private selectedDeviceId: string | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private webMidi: any = null

  constructor(manager: InputManager) {
    this.manager = manager
  }

  async connect(): Promise<void> {
    if (this.connected) return

    try {
      const { WebMidi } = await import('webmidi')
      await WebMidi.enable()
      this.webMidi = WebMidi

      const input = this.selectedDeviceId
        ? WebMidi.getInputById(this.selectedDeviceId)
        : WebMidi.inputs[0]

      if (!input) {
        console.warn('No MIDI input devices found')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input.addListener('noteon', (e: any) => {
        this.manager.emit({
          type: 'noteon',
          note: e.note.number as number,
          velocity: Math.round((e.velocity as number) * 127),
          timestamp: performance.now(),
          source: 'midi',
        })
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input.addListener('noteoff', (e: any) => {
        this.manager.emit({
          type: 'noteoff',
          note: e.note.number as number,
          velocity: 0,
          timestamp: performance.now(),
          source: 'midi',
        })
      })

      this.connected = true
    } catch (err) {
      console.warn('MIDI not available:', err)
    }
  }

  disconnect(): void {
    if (this.webMidi) {
      try {
        this.webMidi.disable()
      } catch {
        // ignore
      }
    }
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }

  selectDevice(deviceId: string): void {
    this.selectedDeviceId = deviceId
  }

  getAvailableDevices(): { id: string; name: string }[] {
    if (!this.webMidi) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.webMidi.inputs.map((input: any) => ({
      id: input.id,
      name: input.name,
    }))
  }
}
