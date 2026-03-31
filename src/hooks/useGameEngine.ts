import { useCallback, useEffect, useRef } from 'react'
import { GameEngine } from '@/engine/GameEngine'
import { FallingNotesRenderer } from '@/renderer/FallingNotesRenderer'
import { inputManager } from '@/input/InputManager'
import type { Song } from '@/types/song'

export function useGameEngine() {
  const engineRef = useRef<GameEngine | null>(null)
  const rendererRef = useRef<FallingNotesRenderer | null>(null)

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
    }
  }, [])

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    const renderer = new FallingNotesRenderer()
    rendererRef.current = renderer
    renderer.init(canvas).then(() => {
      engineRef.current?.setRenderer(renderer)
    })
  }, [])

  const startGame = useCallback((song: Song) => {
    engineRef.current?.start(song)
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
