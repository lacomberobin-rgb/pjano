import { useCallback, useEffect, useRef } from 'react'
import { GameEngine } from '@/engine/GameEngine'
import { FallingNotesRenderer } from '@/renderer/FallingNotesRenderer'
import { inputManager } from '@/input/InputManager'
import type { Song } from '@/types/song'

export function useGameEngine() {
  const engineRef = useRef<GameEngine | null>(null)
  const rendererRef = useRef<FallingNotesRenderer | null>(null)
  const rendererReadyRef = useRef(false)
  const pendingSongRef = useRef<Song | null>(null)

  useEffect(() => {
    const engine = new GameEngine()
    engineRef.current = engine

    // Wire input to game engine
    const unsub = inputManager.subscribe((event) => {
      engine.handleInput(event)
    })

    return () => {
      unsub()
      engine.destroy()
      rendererRef.current?.destroy()
      rendererRef.current = null
      rendererReadyRef.current = false
    }
  }, [])

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    // Destroy previous renderer if any
    rendererRef.current?.destroy()
    rendererReadyRef.current = false

    const renderer = new FallingNotesRenderer()
    rendererRef.current = renderer
    renderer.init(canvas).then(() => {
      rendererReadyRef.current = true
      engineRef.current?.setRenderer(renderer)

      // If a song was waiting for the renderer, start it now
      if (pendingSongRef.current) {
        engineRef.current?.start(pendingSongRef.current)
        pendingSongRef.current = null
      }
    })
  }, [])

  const startGame = useCallback((song: Song) => {
    if (rendererReadyRef.current) {
      engineRef.current?.start(song)
    } else {
      // Renderer not ready yet — queue the start
      pendingSongRef.current = song
    }
  }, [])

  const pauseGame = useCallback(() => {
    engineRef.current?.pause()
  }, [])

  const resumeGame = useCallback(() => {
    engineRef.current?.resume()
  }, [])

  const stopGame = useCallback(() => {
    engineRef.current?.stop()
  }, [])

  return { startGame, pauseGame, resumeGame, stopGame, setCanvas }
}
