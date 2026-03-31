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

    this.app.stage.addChild(this.notesContainer)
    this.app.stage.addChild(this.hitZone)
    this.drawHitZone()
  }

  setNotes(notes: SongNote[], low: number, high: number): void {
    this.songNotes = notes
    this.lowNote = low
    this.highNote = high
    this.clearNoteGraphics()
  }

  setNoteResults(results: Map<string, NoteResult>): void {
    this.noteResults = results
  }

  private getKeyX(midiNote: number): { x: number; width: number } {
    const w = this.app.screen.width
    // Count white keys in range
    let whiteCount = 0
    for (let i = this.lowNote; i <= this.highNote; i++) {
      if (!isBlackKey(i)) whiteCount++
    }
    const whiteKeyWidth = w / whiteCount

    if (isBlackKey(midiNote)) {
      // Position black key between surrounding white keys
      let whiteIndex = 0
      for (let i = this.lowNote; i < midiNote; i++) {
        if (!isBlackKey(i)) whiteIndex++
      }
      return {
        x: whiteIndex * whiteKeyWidth - whiteKeyWidth * 0.15,
        width: whiteKeyWidth * 0.6,
      }
    }

    let whiteIndex = 0
    for (let i = this.lowNote; i < midiNote; i++) {
      if (!isBlackKey(i)) whiteIndex++
    }
    return {
      x: whiteIndex * whiteKeyWidth,
      width: whiteKeyWidth - 1,
    }
  }

  update(currentTime: number): void {
    if (this._destroyed) return

    const h = this.app.screen.height
    const hitZoneY = h * 0.88

    // Determine visible notes
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

    // Add/update visible notes
    for (const note of this.songNotes) {
      if (note.time > windowEnd || note.time + note.duration < windowStart) continue

      let gfx = this.noteGraphics.get(note.id)
      if (!gfx) {
        gfx = new Graphics()
        this.notesContainer.addChild(gfx)
        this.noteGraphics.set(note.id, gfx)
      }

      const { x, width } = this.getKeyX(note.midiNote)
      const noteTop = hitZoneY - (note.time - currentTime) * this.pixelsPerSecond
      const noteHeight = Math.max(note.duration * this.pixelsPerSecond, 8)

      // Determine color
      const result = this.noteResults.get(note.id)
      let color: number
      if (result) {
        color = GRADE_COLORS[result.grade]
      } else if (note.missed) {
        color = GRADE_COLORS.miss
      } else {
        color = isBlackKey(note.midiNote) ? UPCOMING_BLACK_COLOR : UPCOMING_COLOR
      }

      gfx.clear()
      gfx.roundRect(x + 1, noteTop - noteHeight, width - 2, noteHeight, 4)
      gfx.fill({ color, alpha: result?.grade === 'miss' ? 0.3 : 0.85 })

      // Finger number label
      if (note.finger && !result) {
        gfx.circle(x + width / 2, noteTop - noteHeight / 2, 8)
        gfx.fill({ color: 0xffffff, alpha: 0.9 })
      }
    }
  }

  private drawHitZone(): void {
    const w = this.app.screen.width
    const h = this.app.screen.height
    const y = h * 0.88

    this.hitZone.clear()
    this.hitZone.rect(0, y - 2, w, 4)
    this.hitZone.fill({ color: 0x7c3aed, alpha: 0.8 })

    // Glow
    this.hitZone.rect(0, y - 6, w, 12)
    this.hitZone.fill({ color: 0x7c3aed, alpha: 0.15 })
  }

  resize(): void {
    if (this._destroyed) return
    this.app.resize()
    this.drawHitZone()
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
