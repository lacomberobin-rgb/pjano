import { Application, Container, Graphics } from 'pixi.js'
import type { SongNote } from '@/types/song'
import type { NoteResult, TimingGrade } from '@/types/scoring'
import { isBlackKey } from '@/lib/music-theory'
import { PIXELS_PER_SECOND, VISIBLE_WINDOW_SECONDS } from '@/lib/constants'

const GRADE_COLORS: Record<TimingGrade, number> = {
  perfect: 0x22c55e,
  great: 0xeab308,
  good: 0xf97316,
  miss: 0xef4444,
}

const UPCOMING_COLOR = 0x7c3aed
const UPCOMING_BLACK_COLOR = 0x9333ea

export class FallingNotesRenderer {
  private app: Application
  private notesContainer: Container
  private hitZone: Graphics
  private laneLines: Graphics
  private noteGraphics = new Map<string, Graphics>()

  private songNotes: SongNote[] = []
  private noteResults = new Map<string, NoteResult>()
  private lowNote = 48
  private highNote = 84
  private pixelsPerSecond = PIXELS_PER_SECOND
  private visibleWindow = VISIBLE_WINDOW_SECONDS
  private _destroyed = false

  constructor() {
    this.app = new Application()
    this.notesContainer = new Container()
    this.hitZone = new Graphics()
    this.laneLines = new Graphics()
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      resizeTo: canvas.parentElement ?? undefined,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    })

    this.app.stage.addChild(this.laneLines)
    this.app.stage.addChild(this.notesContainer)
    this.app.stage.addChild(this.hitZone)
    this.drawChrome()
  }

  setNotes(notes: SongNote[], low: number, high: number): void {
    this.songNotes = notes
    this.lowNote = low
    this.highNote = high
    this.clearNoteGraphics()
    this.drawChrome()
  }

  setNoteResults(results: Map<string, NoteResult>): void {
    this.noteResults = results
  }

  /**
   * Compute X position and width for a note, matching the PianoKeyboard layout exactly.
   * White keys are evenly distributed across the canvas width.
   * Black keys are centered between their neighboring white keys with the same
   * per-note-in-octave offsets used by PianoKeyboard.
   */
  private getKeyX(midiNote: number): { x: number; width: number } {
    const w = this.app.screen.width
    const whiteCount = this.countWhiteKeys()
    const whiteKeyWidth = w / whiteCount

    if (isBlackKey(midiNote)) {
      // Count white keys before this black key
      let whiteIndex = 0
      for (let i = this.lowNote; i < midiNote; i++) {
        if (!isBlackKey(i)) whiteIndex++
      }
      // Same offset logic as PianoKeyboard
      const noteInOctave = midiNote % 12
      const offsets: Record<number, number> = {
        1: -0.05, 3: 0.05, 6: -0.08, 8: 0, 10: 0.08,
      }
      const offset = offsets[noteInOctave] ?? 0
      const centerX = (whiteIndex + offset) * whiteKeyWidth
      const bw = whiteKeyWidth * 0.6
      return { x: centerX - bw / 2, width: bw }
    }

    // White key
    let whiteIndex = 0
    for (let i = this.lowNote; i < midiNote; i++) {
      if (!isBlackKey(i)) whiteIndex++
    }
    return { x: whiteIndex * whiteKeyWidth, width: whiteKeyWidth - 1 }
  }

  private countWhiteKeys(): number {
    let count = 0
    for (let i = this.lowNote; i <= this.highNote; i++) {
      if (!isBlackKey(i)) count++
    }
    return count
  }

  /** Y coordinate of the "hit zone" line — notes reach here at their play time */
  private getHitZoneY(): number {
    return this.app.screen.height - 6
  }

  update(currentTime: number): void {
    if (this._destroyed) return

    const hitZoneY = this.getHitZoneY()
    const windowStart = currentTime - 0.5
    const windowEnd = currentTime + this.visibleWindow

    // Remove off-screen sprites
    for (const [id, gfx] of this.noteGraphics) {
      const note = this.songNotes.find(n => n.id === id)
      if (!note || note.time + note.duration < windowStart) {
        this.notesContainer.removeChild(gfx)
        gfx.destroy()
        this.noteGraphics.delete(id)
      }
    }

    // Add / update visible notes
    for (const note of this.songNotes) {
      if (note.time > windowEnd || note.time + note.duration < windowStart) continue

      let gfx = this.noteGraphics.get(note.id)
      if (!gfx) {
        gfx = new Graphics()
        this.notesContainer.addChild(gfx)
        this.noteGraphics.set(note.id, gfx)
      }

      const { x, width } = this.getKeyX(note.midiNote)
      const noteBottom = hitZoneY - (note.time - currentTime) * this.pixelsPerSecond
      const noteHeight = Math.max(note.duration * this.pixelsPerSecond, 10)

      // Determine color
      const result = this.noteResults.get(note.id)
      let color: number
      let alpha = 0.85
      if (result) {
        color = GRADE_COLORS[result.grade]
        if (result.grade === 'miss') alpha = 0.25
      } else if (note.missed) {
        color = GRADE_COLORS.miss
        alpha = 0.25
      } else {
        color = isBlackKey(note.midiNote) ? UPCOMING_BLACK_COLOR : UPCOMING_COLOR
      }

      gfx.clear()
      gfx.roundRect(x + 1, noteBottom - noteHeight, width - 2, noteHeight, 4)
      gfx.fill({ color, alpha })
    }
  }

  /** Draw the hit-zone line and faint lane separators */
  private drawChrome(): void {
    if (this._destroyed) return
    const w = this.app.screen.width
    const h = this.app.screen.height
    const hitY = this.getHitZoneY()
    const whiteCount = this.countWhiteKeys()
    const whiteKeyWidth = w / whiteCount

    // Hit zone glow + line
    this.hitZone.clear()
    this.hitZone.rect(0, hitY - 4, w, 8)
    this.hitZone.fill({ color: 0x7c3aed, alpha: 0.18 })
    this.hitZone.rect(0, hitY - 1, w, 3)
    this.hitZone.fill({ color: 0x7c3aed, alpha: 0.7 })

    // Lane separators (faint vertical lines between white keys)
    this.laneLines.clear()
    for (let i = 1; i < whiteCount; i++) {
      const x = i * whiteKeyWidth
      this.laneLines.moveTo(x, 0)
      this.laneLines.lineTo(x, h)
      this.laneLines.stroke({ color: 0xffffff, alpha: 0.04, width: 1 })
    }
  }

  resize(): void {
    if (this._destroyed) return
    this.app.resize()
    this.drawChrome()
  }

  private clearNoteGraphics(): void {
    for (const [, gfx] of this.noteGraphics) {
      this.notesContainer.removeChild(gfx)
      gfx.destroy()
    }
    this.noteGraphics.clear()
  }

  destroy(): void {
    this._destroyed = true
    this.clearNoteGraphics()
    this.app.destroy(true)
  }
}
