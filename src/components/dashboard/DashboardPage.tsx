import { curriculum } from '@/data/curriculum'
import { useCurriculumStore } from '@/store/curriculumStore'
import { ACHIEVEMENTS } from '@/data/achievements'

interface DashboardPageProps {
  totalXP: number
  streak: number
  onNavigate: (page: string) => void
}

export function DashboardPage({ totalXP, streak, onNavigate }: DashboardPageProps) {
  const completedLessons = useCurriculumStore(s => s.completedLessons)

  const totalLessons = curriculum.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedCount = completedLessons.size

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Total XP</p>
          <p className="text-2xl font-bold text-xp">{totalXP}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="text-2xl font-bold text-streak">{streak} 🔥</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Lessons</p>
          <p className="text-2xl font-bold">{completedCount}/{totalLessons}</p>
        </div>
      </div>

      {/* Continue learning CTA */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h3 className="font-bold mb-1">Continue Learning</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {completedCount === 0
            ? 'Start your piano journey with the first lesson!'
            : `You've completed ${completedCount} lessons. Keep going!`}
        </p>
        <button
          onClick={() => onNavigate('learn')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {completedCount === 0 ? 'Start First Lesson' : 'Continue'}
        </button>
      </div>

      {/* Quick play */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold mb-1">Quick Play</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Jump into a song for free practice.
        </p>
        <button
          onClick={() => onNavigate('play')}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Play Now
        </button>
      </div>

      {/* Achievements preview */}
      <div>
        <h3 className="font-bold mb-3">Achievements</h3>
        <div className="grid grid-cols-4 gap-3">
          {ACHIEVEMENTS.slice(0, 8).map(a => (
            <div
              key={a.id}
              className="bg-card border border-border rounded-lg p-3 text-center opacity-40"
            >
              <p className="text-lg mb-1">{a.icon === 'Music' ? '🎵' : a.icon === 'Flame' ? '🔥' : a.icon === 'Star' ? '⭐' : a.icon === 'Zap' ? '⚡' : '🏆'}</p>
              <p className="text-[10px] font-medium text-muted-foreground">{a.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
