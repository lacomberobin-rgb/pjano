import { curriculum } from '@/data/curriculum'
import { useCurriculumStore } from '@/store/curriculumStore'
import { ACHIEVEMENTS } from '@/data/achievements'
import { motion } from 'framer-motion'
import { Flame, Trophy, Zap, Star, Play, BookOpen } from 'lucide-react'

interface DashboardPageProps {
  totalXP: number
  streak: number
  onNavigate: (page: string) => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function DashboardPage({ totalXP, streak, onNavigate }: DashboardPageProps) {
  const completedLessons = useCurriculumStore(s => s.completedLessons)

  const totalLessons = curriculum.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedCount = completedLessons.size
  const level = Math.floor(totalXP / 100) + 1
  const xpInLevel = totalXP % 100

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-4xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <motion.h2 variants={item} className="text-4xl font-black tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Salut, Virtuose !
          </motion.h2>
          <motion.p variants={item} className="text-muted-foreground font-medium">
            Prêt pour ta session quotidienne ?
          </motion.p>
        </div>
        
        {/* Mascot Pippy Placeholder */}
        <motion.div 
          variants={item}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
          <div className="relative w-16 h-16 bg-card border-2 border-primary/20 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
            📐
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-perfect rounded-full border-2 border-background" />
        </motion.div>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative overflow-hidden bg-card rounded-3xl p-6 border border-border shadow-xl group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Zap size={48} className="text-xp" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Niveau {level}</p>
          <p className="text-4xl font-black text-xp mb-4">{totalXP} XP</p>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xpInLevel}%` }}
              className="h-full bg-gradient-to-r from-xp to-primary" 
            />
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative overflow-hidden bg-card rounded-3xl p-6 border border-border shadow-xl group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Flame size={48} className="text-streak" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Série</p>
          <p className="text-4xl font-black text-streak">{streak} Jours 🔥</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Continue comme ça !</p>
        </motion.div>

        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative overflow-hidden bg-card rounded-3xl p-6 border border-border shadow-xl group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Trophy size={48} className="text-perfect" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Leçons</p>
          <p className="text-4xl font-black text-foreground">{completedCount}<span className="text-xl text-muted-foreground">/{totalLessons}</span></p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">En route vers le sommet</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue learning CTA */}
        <motion.div 
          variants={item}
          className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/5 border border-primary/20 rounded-3xl p-8"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              <BookOpen className="text-primary" />
              Continuer l'aventure
            </h3>
            <p className="text-muted-foreground font-medium mb-6">
              {completedCount === 0
                ? 'Apprends tes premières notes aujourd\'hui.'
                : `Tu as déjà complété ${completedCount} leçons. La suite t'attend !`}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('learn')}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              C'est parti <Play size={18} fill="currentColor" />
            </motion.button>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
        </motion.div>

        {/* Quick play */}
        <motion.div 
          variants={item}
          className="relative overflow-hidden bg-card border border-border rounded-3xl p-8 group"
        >
          <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Star className="text-accent" />
            Session Libre
          </h3>
          <p className="text-muted-foreground font-medium mb-6">
            Détends-toi en jouant tes morceaux préférés.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('play')}
            className="px-8 py-4 bg-secondary text-foreground rounded-2xl font-bold border border-border hover:bg-secondary/80 transition-colors"
          >
            Jouer maintenant
          </motion.button>
          <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
            <Star size={120} fill="currentColor" />
          </div>
        </motion.div>
      </div>

      {/* Achievements preview */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-xl font-black flex items-center gap-2 px-2">
          <Trophy size={20} className="text-perfect" />
          Succès Récents
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {ACHIEVEMENTS.slice(0, 8).map(a => (
            <motion.div
              key={a.id}
              whileHover={{ y: -5, rotate: [0, -5, 5, 0] }}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help"
              title={a.description}
            >
              <div className="text-2xl bg-secondary w-12 h-12 flex items-center justify-center rounded-xl">
                {a.icon === 'Music' ? '🎵' : a.icon === 'Flame' ? '🔥' : a.icon === 'Star' ? '⭐' : a.icon === 'Zap' ? '⚡' : '🏆'}
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase text-center leading-tight">{a.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
