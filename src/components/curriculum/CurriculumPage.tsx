import { curriculum } from '@/data/curriculum'
import { useCurriculumStore } from '@/store/curriculumStore'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CheckCircle2, Lock, PlayCircle, Star, Music2 } from 'lucide-react'

interface CurriculumPageProps {
  onStartLesson: (lessonId: string) => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const item = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 }
}

export function CurriculumPage({ onStartLesson }: CurriculumPageProps) {
  const completedLessons = useCurriculumStore(s => s.completedLessons)
  const moduleProgress = useCurriculumStore(s => s.moduleProgress)
  const isModuleUnlocked = useCurriculumStore(s => s.isModuleUnlocked)

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-3xl mx-auto space-y-12"
    >
      <header className="space-y-2 text-center md:text-left">
        <motion.h2 variants={item} className="text-4xl font-black tracking-tight flex items-center gap-3 justify-center md:justify-start">
          <Music2 className="text-primary" size={32} />
          Ton Parcours
        </motion.h2>
        <motion.p variants={item} className="text-muted-foreground font-medium">
          Maîtrise le piano, un module à la fois.
        </motion.p>
      </header>

      <div className="space-y-10 relative">
        {/* Connection line between modules */}
        <div className="absolute left-10 top-20 bottom-20 w-1 bg-gradient-to-b from-primary/20 via-accent/20 to-transparent rounded-full -z-10 hidden md:block" />

        {curriculum.map((mod, idx) => {
          const unlocked = isModuleUnlocked(mod.prerequisites)
          const progress = moduleProgress.get(mod.id) ?? 0

          return (
            <motion.div
              key={mod.id}
              variants={item}
              className={cn(
                'relative flex flex-col md:flex-row gap-6 items-start transition-all',
                !unlocked && 'opacity-60 grayscale'
              )}
            >
              {/* Module Hexagon/Icon */}
              <div className="relative flex-shrink-0">
                <motion.div 
                  whileHover={unlocked ? { scale: 1.1, rotate: 5 } : {}}
                  className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-2xl z-10 relative",
                    unlocked ? "bg-card border-2 border-primary/20" : "bg-muted border-2 border-border"
                  )}
                  style={unlocked ? { color: mod.color, boxShadow: `0 10px 30px -10px ${mod.color}44` } : {}}
                >
                  {unlocked ? (mod.id === 'module-01' ? '🎹' : '🎼') : <Lock size={32} className="text-muted-foreground" />}
                </motion.div>
                {unlocked && progress === 1 && (
                  <div className="absolute -top-2 -right-2 bg-perfect text-white p-1 rounded-full shadow-lg">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Module Content */}
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black" style={{ color: unlocked ? mod.color : 'inherit' }}>
                      {mod.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{mod.description}</p>
                  </div>
                  <span className="text-sm font-black opacity-40">{Math.round(progress * 100)}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: mod.color }}
                  />
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {mod.lessons.map((lesson) => {
                    const completed = completedLessons.has(lesson.id)
                    return (
                      <motion.button
                        key={lesson.id}
                        whileHover={unlocked ? { x: 10, backgroundColor: 'rgba(var(--color-primary), 0.05)' } : {}}
                        whileTap={unlocked ? { scale: 0.98 } : {}}
                        onClick={() => unlocked && onStartLesson(lesson.id)}
                        disabled={!unlocked}
                        className={cn(
                          'group flex items-center gap-4 p-4 rounded-2xl text-left transition-all border',
                          completed
                            ? 'bg-perfect/5 border-perfect/20 text-perfect'
                            : unlocked 
                              ? 'bg-card border-border hover:border-primary/50' 
                              : 'bg-muted/30 border-transparent cursor-not-allowed'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-colors',
                          completed ? 'bg-perfect text-white' : 'bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                        )}>
                          {completed ? <CheckCircle2 size={20} /> : lesson.order}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold tracking-tight">{lesson.title}</p>
                          <p className="text-xs opacity-70 font-medium">{lesson.description}</p>
                        </div>
                        {unlocked && !completed && (
                          <PlayCircle className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" size={24} />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
