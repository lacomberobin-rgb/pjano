import * as Tone from 'tone'
import { midiToNoteName } from './music-theory'
import { SAMPLE_BASE_URL } from './constants'

interface AudioEngineOptions {
  sampleBaseUrl?: string
  onProgress?: (percent: number) => void
}

class AudioEngine {
  private sampler: Tone.Sampler | null = null
  private masterVolume: Tone.Volume
  private loaded = false
  private loading = false

  constructor() {
    this.masterVolume = new Tone.Volume(0).toDestination()
  }

  async load(options: AudioEngineOptions = {}): Promise<void> {
    if (this.loaded || this.loading) return
    this.loading = true

    const baseUrl = options.sampleBaseUrl ?? SAMPLE_BASE_URL

    // Use Salamander Grand Piano samples — load a subset of notes
    // Tone.js interpolates the rest. We use notes every minor 3rd across the range.
    const sampleNotes: Record<string, string> = {
      A0: 'A0.ogg', C1: 'C1.ogg', 'D#1': 'Ds1.ogg', 'F#1': 'Fs1.ogg',
      A1: 'A1.ogg', C2: 'C2.ogg', 'D#2': 'Ds2.ogg', 'F#2': 'Fs2.ogg',
      A2: 'A2.ogg', C3: 'C3.ogg', 'D#3': 'Ds3.ogg', 'F#3': 'Fs3.ogg',
      A3: 'A3.ogg', C4: 'C4.ogg', 'D#4': 'Ds4.ogg', 'F#4': 'Fs4.ogg',
      A4: 'A4.ogg', C5: 'C5.ogg', 'D#5': 'Ds5.ogg', 'F#5': 'Fs5.ogg',
      A5: 'A5.ogg', C6: 'C6.ogg', 'D#6': 'Ds6.ogg', 'F#6': 'Fs6.ogg',
      A6: 'A6.ogg', C7: 'C7.ogg', 'D#7': 'Ds7.ogg', 'F#7': 'Fs7.ogg',
      A7: 'A7.ogg', C8: 'C8.ogg',
    }

    return new Promise<void>((resolve, reject) => {
      this.sampler = new Tone.Sampler({
        urls: sampleNotes,
        baseUrl,
        release: 1,
        onload: () => {
          this.loaded = true
          this.loading = false
          options.onProgress?.(1)
          resolve()
        },
        onerror: (err) => {
          this.loading = false
          reject(err)
        },
      }).connect(this.masterVolume)

      // Set lookAhead to 0 for interactive use (minimal latency)
      Tone.getContext().lookAhead = 0
    })
  }

  noteOn(midiNote: number, velocity = 80): void {
    if (!this.sampler || !this.loaded) return
    const noteName = midiToNoteName(midiNote)
    this.sampler.triggerAttack(noteName, Tone.now(), velocity / 127)
  }

  noteOff(midiNote: number): void {
    if (!this.sampler || !this.loaded) return
    const noteName = midiToNoteName(midiNote)
    this.sampler.triggerRelease(noteName, Tone.now())
  }

  setVolume(db: number): void {
    this.masterVolume.volume.value = db
  }

  async resume(): Promise<void> {
    await Tone.start()
  }

  isLoaded(): boolean {
    return this.loaded
  }

  destroy(): void {
    this.sampler?.dispose()
    this.masterVolume.dispose()
    this.loaded = false
  }
}

export const audioEngine = new AudioEngine()
