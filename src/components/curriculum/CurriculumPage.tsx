import { curriculum } from '@/data/curriculum'
import { useCurriculumStore } from '@/store/curriculumStore'
import { cn } from '@/lib/utils'

interface CurriculumPageProps {
  onStartLesson: (lessonId: string) => void
}

export function CurriculumPage({ onStartLesson }: CurriculumPageProps) {
  const completedLessons = useCurriculumStore(s => s.completedLessons)
  const moduleProgress = useCurriculumStore(s => s.moduleProgress)
  const isModuleUnlocked = useCurriculumStore(s => s.isModuleUnlocked)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Learn</h2>

      {curriculum.map(mod => {
        const unlocked = isModuleUnlocked(mod.prerequisites)
        const progress = moduleProgress.get(mod.id) ?? 0

        return (
          <div
            key={mod.id}
            className={cn(
              'bg-card border border-border rounded-xl p-5 transition-opacity',
              !unlocked && 'opacity-40 pointer-events-none',
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold" style={{ color: mod.color }}>{mod.title}</h3>
                <p className="text-xs text-muted-foreground">{mod.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(progress * 100)}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-secondary rounded-full mb-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress * 100}%`, backgroundColor: mod.color }}
              />
            </div>

            {/* Lessons */}
            <div className="space-y-2">
              {mod.lessons.map(lesson => {
                const completed = completedLessons.has(lesson.id)
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onStartLesson(lesson.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors',
                      completed
                        ? 'bg-perfect/10 text-perfect'
                        : 'bg-secondary/50 hover:bg-secondary text-foreground',
                    )}
                  >
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border',
                      completed ? 'border-perfect text-perfect' : 'border-muted-foreground text-muted-foreground',
                    )}>
                      {completed ? '✓' : lesson.order}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
