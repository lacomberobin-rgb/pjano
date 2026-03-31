import { useCallback, useEffect, useRef } from 'react'
import { FallingNotesRenderer } from '@/renderer/FallingNotesRenderer'
import type { SongNote } from '@/types/song'
import type { NoteResult } from '@/types/scoring'

interface FallingNotesCanvasProps {
  notes: SongNote[]
  noteResults: Map<string, NoteResult>
  currentTime: number
  lowNote: number
  highNote: number
}

export function FallingNotesCanvas({
  notes,
  noteResults,
  currentTime,
  lowNote,
  highNote,
}: FallingNotesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<FallingNotesRenderer | null>(null)

  // Initialize renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new FallingNotesRenderer()
    rendererRef.current = renderer

    renderer.init(canvas).then(() => {
      renderer.setNotes(notes, lowNote, highNote)
    })

    const observer = new ResizeObserver(() => renderer.resize())
    observer.observe(canvas.parentElement ?? canvas)

    return () => {
      observer.disconnect()
      renderer.destroy()
      rendererRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update notes when song changes
  useEffect(() => {
    rendererRef.current?.setNotes(notes, lowNote, highNote)
  }, [notes, lowNote, highNote])

  // Update results
  useEffect(() => {
    rendererRef.current?.setNoteResults(noteResults)
  }, [noteResults])

  // Animation frame update — driven by parent's currentTime
  const lastTimeRef = useRef(currentTime)
  useEffect(() => {
    lastTimeRef.current = currentTime
    rendererRef.current?.update(currentTime)
  }, [currentTime])

  const handleCanvasRef = useCallback((el: HTMLCanvasElement | null) => {
    (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = el
  }, [])

  return (
    <canvas
      ref={handleCanvasRef}
      className="w-full h-full block"
    />
  )
}
