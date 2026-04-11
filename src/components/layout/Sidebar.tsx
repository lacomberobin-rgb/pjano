import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  GraduationCap, 
  Piano, 
  Library, 
  Settings, 
  Ear 
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'learn', label: 'Parcours', icon: GraduationCap },
  { id: 'ear-training', label: 'Oreille', icon: Ear },
  { id: 'play', label: 'Jouer', icon: Piano },
  { id: 'library', label: 'Bibliothèque', icon: Library },
  { id: 'settings', label: 'Réglages', icon: Settings },
]

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border flex flex-col bg-card/50 backdrop-blur-xl">
      <div className="p-8">
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-black text-primary tracking-tighter"
        >
          pjano<span className="text-accent">.</span>
        </motion.h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all group relative',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              {item.label}
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1"
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      <div className="p-6">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Version</p>
          <p className="text-xs font-bold text-muted-foreground">2.0.0 Neon Harmony</p>
        </div>
      </div>
    </aside>
  )
}
