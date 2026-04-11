import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js'
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

interface Particle {
  gfx: Graphics
  vx: number
  vy: number
  life: number
}

interface FloatingText {
  text: Text
  vy: number
  life: number
}

export class FallingNotesRenderer {
  private app: Application
  private notesContainer: Container
  private particlesContainer: Container
  private textContainer: Container
  private hitZone: Graphics
  private laneLines: Graphics
  private noteGraphics = new Map<string, Graphics>()
  private noteTexts = new Map<string, Text>()
  private particles: Particle[] = []
  private floatingTexts: FloatingText[] = []

  private songNotes: SongNote[] = []
  private noteResults = new Map<string, NoteResult>()
  private activeHand: 'left' | 'right' | 'both' = 'both'
  private lowNote = 48
  private highNote = 84
  private pixelsPerSecond = PIXELS_PER_SECOND
  private visibleWindow = VISIBLE_WINDOW_SECONDS
  private _destroyed = false

  constructor() {
    this.app = new Application()
    this.notesContainer = new Container()
    this.particlesContainer = new Container()
    this.textContainer = new Container()
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
    this.app.stage.addChild(this.particlesContainer)
    this.app.stage.addChild(this.textContainer)
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

  setActiveHand(hand: 'left' | 'right' | 'both'): void {
    this.activeHand = hand
  }

  triggerHitEffect(noteId: string, grade: TimingGrade): void {
    const note = this.songNotes.find(n => n.id === noteId)
    if (!note) return

    const { x, width } = this.getKeyX(note.midiNote)
    const hitY = this.getHitZoneY()
    const color = GRADE_COLORS[grade]

    // Create particles
    const particleCount = grade === 'perfect' ? 12 : grade === 'great' ? 8 : 5
    for (let i = 0; i < particleCount; i++) {
      const gfx = new Graphics()
      const size = 2 + Math.random() * 4
      gfx.circle(0, 0, size)
      gfx.fill({ color })
      gfx.x = x + width / 2
      gfx.y = hitY

      this.particlesContainer.addChild(gfx)
      this.particles.push({
        gfx,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 10 - 2,
        life: 1,
      })
    }

    // Create floating text
    const style = new TextStyle({
      fontFamily: 'Inter',
      fontSize: grade === 'perfect' ? 24 : 18,
      fontWeight: '900',
      fill: color,
      dropShadow: {
        alpha: 0.5,
        blur: 4,
        color: 0x000000,
        distance: 2,
      },
    })
    const text = new Text({ text: grade.toUpperCase(), style })
    text.anchor.set(0.5)
    text.x = x + width / 2
    text.y = hitY - 40
    this.textContainer.addChild(text)
    this.floatingTexts.push({ text, vy: -2, life: 1 })
  }

  private getKeyX(midiNote: number): { x: number; width: number } {
    const w = this.app.screen.width
    const whiteCount = this.countWhiteKeys()
    const whiteKeyWidth = w / whiteCount

    if (isBlackKey(midiNote)) {
      let whiteIndex = 0
      for (let i = this.lowNote; i < midiNote; i++) {
        if (!isBlackKey(i)) whiteIndex++
      }
      const noteInOctave = midiNote % 12
      const offsets: Record<number, number> = { 1: -0.05, 3: 0.05, 6: -0.08, 8: 0, 10: 0.08 }
      const offset = offsets[noteInOctave] ?? 0
      const centerX = (whiteIndex + offset) * whiteKeyWidth
      const bw = whiteKeyWidth * 0.6
      return { x: centerX - bw / 2, width: bw }
    }

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

  private getHitZoneY(): number {
    return this.app.screen.height - 6
  }

  update(currentTime: number): void {
    if (this._destroyed) return

    const hitZoneY = this.getHitZoneY()
    const windowStart = currentTime - 0.5
    const windowEnd = currentTime + this.visibleWindow

    // 1. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      if (!p) continue
      
      p.life -= 0.02
      p.gfx.x += p.vx
      p.gfx.y += p.vy
      p.vy += 0.4
      p.gfx.alpha = p.life
      if (p.life <= 0) {
        this.particlesContainer.removeChild(p.gfx)
        p.gfx.destroy()
        this.particles.splice(i, 1)
      }
    }

    // 2. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i]
      if (!t) continue

      t.life -= 0.015
      t.text.y += t.vy
      t.vy *= 0.95
      t.text.alpha = t.life
      t.text.scale.set(1 + (1 - t.life) * 0.5)
      if (t.life <= 0) {
        this.textContainer.removeChild(t.text)
        t.text.destroy()
        this.floatingTexts.splice(i, 1)
      }
    }

    // 3. Update Notes
    for (const [id, gfx] of this.noteGraphics) {
      const note = this.songNotes.find(n => n.id === id)
      if (!note || note.time + note.duration < windowStart) {
        this.notesContainer.removeChild(gfx)
        gfx.destroy()
        this.noteGraphics.delete(id)
        const txt = this.noteTexts.get(id)
        if (txt) {
          this.textContainer.removeChild(txt)
          txt.destroy()
          this.noteTexts.delete(id)
        }
      }
    }

    const fingerStyle = new TextStyle({
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '900',
      fill: 0xffffff,
    })

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

      const result = this.noteResults.get(note.id)
      let color: number
      let alpha = (this.activeHand !== 'both' && note.hand !== this.activeHand) ? 0.15 : 0.85

      if (result) {
        color = GRADE_COLORS[result.grade]
        if (result.grade === 'miss') alpha *= 0.3
      } else if (note.missed) {
        color = GRADE_COLORS.miss
        alpha *= 0.3
      } else {
        color = isBlackKey(note.midiNote) ? UPCOMING_BLACK_COLOR : UPCOMING_COLOR
      }

      gfx.clear()
      gfx.roundRect(x + 1, noteBottom - noteHeight, width - 2, noteHeight, 4)
      gfx.fill({ color, alpha })

      if (note.finger && !result && !note.missed && alpha > 0.2) {
        let txt = this.noteTexts.get(note.id)
        if (!txt) {
          txt = new Text({ text: note.finger.toString(), style: fingerStyle })
          txt.anchor.set(0.5)
          this.textContainer.addChild(txt)
          this.noteTexts.set(note.id, txt)
        }
        txt.x = x + width / 2
        txt.y = noteBottom - 14
        txt.alpha = alpha
      } else if (this.noteTexts.has(note.id)) {
        const txt = this.noteTexts.get(note.id)!
        this.textContainer.removeChild(txt)
        txt.destroy()
        this.noteTexts.delete(note.id)
      }
    }
  }

  private drawChrome(): void {
    if (this._destroyed) return
    const w = this.app.screen.width
    const h = this.app.screen.height
    const hitY = this.getHitZoneY()
    const whiteCount = this.countWhiteKeys()
    const whiteKeyWidth = w / whiteCount

    this.hitZone.clear()
    this.hitZone.rect(0, hitY - 10, w, 20).fill({ color: 0x7c3aed, alpha: 0.12 })
    this.hitZone.rect(0, hitY - 2, w, 4).fill({ color: 0x7c3aed, alpha: 0.6 })
    this.hitZone.rect(0, hitY - 1, w, 2).fill({ color: 0xffffff, alpha: 0.8 })

    this.laneLines.clear()
    for (let i = 1; i < whiteCount; i++) {
      const x = i * whiteKeyWidth
      this.laneLines.moveTo(x, 0).lineTo(x, h).stroke({ color: 0xffffff, alpha: 0.04, width: 1 })
    }
  }

  resize(): void {
    if (this._destroyed) return
    this.app.resize()
    this.drawChrome()
  }

  private clearNoteGraphics(): void {
    for (const [, gfx] of this.noteGraphics) {
      this.notesContainer.removeChild(gfx); gfx.destroy()
    }
    this.noteGraphics.clear()
    for (const [, txt] of this.noteTexts) {
      this.textContainer.removeChild(txt); txt.destroy()
    }
    this.noteTexts.clear()
    for (const p of this.particles) {
      this.particlesContainer.removeChild(p.gfx); p.gfx.destroy()
    }
    this.particles = []
    for (const t of this.floatingTexts) {
      this.textContainer.removeChild(t.text); t.text.destroy()
    }
    this.floatingTexts = []
  }

  destroy(): void {
    this._destroyed = true
    this.clearNoteGraphics()
    this.app.destroy(true)
  }
}
