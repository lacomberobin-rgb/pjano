import { cn } from '@/lib/utils'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'learn', label: 'Learn', icon: '📚' },
  { id: 'play', label: 'Play', icon: '🎹' },
  { id: 'library', label: 'Library', icon: '🎵' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-56 border-r border-border flex flex-col bg-card">
      <div className="p-4">
        <h1 className="text-xl font-black text-primary">pjano</h1>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              currentPage === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
