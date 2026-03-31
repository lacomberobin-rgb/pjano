import { getXPProgress } from '@/lib/xp-engine'

interface TopBarProps {
  totalXP: number
  streak: number
}

export function TopBar({ totalXP, streak }: TopBarProps) {
  const { level, percent } = getXPProgress(totalXP)

  return (
    <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
      <div className="flex items-center gap-4">
        {/* Level badge */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-level bg-level/10 px-2 py-0.5 rounded-full">
            Lvl {level}
          </span>
          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-xp rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* XP */}
        <span className="text-xs text-muted-foreground">{totalXP} XP</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-streak">🔥</span>
            <span className="text-xs font-bold text-streak">{streak}</span>
          </div>
        )}
      </div>
    </header>
  )
}
