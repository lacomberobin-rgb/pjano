import { useGameStore } from '@/store/gameStore'

interface GameOverScreenProps {
  onReplay: () => void
  onBack: () => void
}

export function GameOverScreen({ onReplay, onBack }: GameOverScreenProps) {
  const score = useGameStore(s => s.score)
  const accuracy = useGameStore(s => s.accuracy)
  const maxCombo = useGameStore(s => s.maxCombo)
  const noteResults = useGameStore(s => s.noteResults)
  const getGrade = useGameStore(s => s.getSessionGrade)

  const grade = getGrade()
  const perfect = noteResults.filter(r => r.grade === 'perfect').length
  const great = noteResults.filter(r => r.grade === 'great').length
  const good = noteResults.filter(r => r.grade === 'good').length
  const miss = noteResults.filter(r => r.grade === 'miss').length

  const gradeColors: Record<string, string> = {
    S: 'text-perfect', A: 'text-great', B: 'text-good', C: 'text-muted-foreground', D: 'text-miss',
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-xl font-bold">Song Complete!</h2>

      <div className={`text-7xl font-black ${gradeColors[grade]}`}>{grade}</div>

      <div className="text-4xl font-bold tabular-nums">{score.toLocaleString()}</div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <span className="text-muted-foreground">Accuracy</span>
        <span className="font-bold text-right">{accuracy}%</span>
        <span className="text-muted-foreground">Max Combo</span>
        <span className="font-bold text-right">{maxCombo}x</span>
        <span className="text-perfect">Perfect</span>
        <span className="font-bold text-right">{perfect}</span>
        <span className="text-great">Great</span>
        <span className="font-bold text-right">{great}</span>
        <span className="text-good">Good</span>
        <span className="font-bold text-right">{good}</span>
        <span className="text-miss">Miss</span>
        <span className="font-bold text-right">{miss}</span>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onReplay}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  )
}
