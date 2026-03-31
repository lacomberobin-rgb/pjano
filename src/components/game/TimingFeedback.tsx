import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import type { TimingGrade } from '@/types/scoring'
import { cn } from '@/lib/utils'

const GRADE_STYLES: Record<TimingGrade, string> = {
  perfect: 'text-perfect text-2xl',
  great: 'text-great text-xl',
  good: 'text-good text-lg',
  miss: 'text-miss text-lg',
}

const GRADE_LABELS: Record<TimingGrade, string> = {
  perfect: 'Perfect!',
  great: 'Great!',
  good: 'Good',
  miss: 'Miss',
}

export function TimingFeedback() {
  const lastGrade = useGameStore(s => s.lastGrade)
  const [visible, setVisible] = useState(false)
  const [displayGrade, setDisplayGrade] = useState<TimingGrade | null>(null)

  useEffect(() => {
    if (!lastGrade) return
    setDisplayGrade(lastGrade)
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 600)
    return () => clearTimeout(timer)
  }, [lastGrade, useGameStore.getState().noteResults.length])

  if (!displayGrade) return null

  return (
    <div
      className={cn(
        'font-bold transition-all duration-300 pointer-events-none',
        GRADE_STYLES[displayGrade],
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
      )}
    >
      {GRADE_LABELS[displayGrade]}
    </div>
  )
}
