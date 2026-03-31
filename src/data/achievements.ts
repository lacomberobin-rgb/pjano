export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'practice' | 'skill' | 'curriculum' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  condition: AchievementCondition
}

export type AchievementCondition =
  | { type: 'streak_days'; days: number }
  | { type: 'total_practice_minutes'; minutes: number }
  | { type: 'lessons_completed'; count: number }
  | { type: 'perfect_scores'; count: number }
  | { type: 'max_combo'; combo: number }
  | { type: 'accuracy_in_session'; accuracy: number }
  | { type: 'songs_played'; count: number }
  | { type: 'total_xp'; xp: number }

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-note', title: 'First Note!', description: 'Play your first note', icon: 'Music', category: 'practice', rarity: 'common', xpReward: 10, condition: { type: 'songs_played', count: 1 } },
  { id: 'getting-started', title: 'Getting Started', description: 'Complete your first lesson', icon: 'BookOpen', category: 'curriculum', rarity: 'common', xpReward: 15, condition: { type: 'lessons_completed', count: 1 } },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Practice 7 days in a row', icon: 'Flame', category: 'practice', rarity: 'rare', xpReward: 50, condition: { type: 'streak_days', days: 7 } },
  { id: 'two-weeks', title: 'Fortnight Focus', description: 'Practice 14 days in a row', icon: 'Flame', category: 'practice', rarity: 'epic', xpReward: 100, condition: { type: 'streak_days', days: 14 } },
  { id: 'month-master', title: 'Monthly Master', description: 'Practice 30 days in a row', icon: 'Flame', category: 'practice', rarity: 'legendary', xpReward: 200, condition: { type: 'streak_days', days: 30 } },
  { id: 'flawless', title: 'Flawless', description: '100% accuracy in a song', icon: 'Star', category: 'skill', rarity: 'rare', xpReward: 30, condition: { type: 'accuracy_in_session', accuracy: 100 } },
  { id: 'sharpshooter', title: 'Sharpshooter', description: '95%+ accuracy 5 times', icon: 'Target', category: 'skill', rarity: 'rare', xpReward: 40, condition: { type: 'perfect_scores', count: 5 } },
  { id: 'combo-10', title: 'Combo Starter', description: 'Reach a 10-note combo', icon: 'Zap', category: 'skill', rarity: 'common', xpReward: 10, condition: { type: 'max_combo', combo: 10 } },
  { id: 'combo-25', title: 'Combo Builder', description: 'Reach a 25-note combo', icon: 'Zap', category: 'skill', rarity: 'rare', xpReward: 25, condition: { type: 'max_combo', combo: 25 } },
  { id: 'combo-50', title: 'On Fire', description: 'Reach a 50-note combo', icon: 'Zap', category: 'skill', rarity: 'epic', xpReward: 50, condition: { type: 'max_combo', combo: 50 } },
  { id: 'combo-100', title: 'Unstoppable', description: 'Reach a 100-note combo', icon: 'Zap', category: 'skill', rarity: 'legendary', xpReward: 100, condition: { type: 'max_combo', combo: 100 } },
  { id: 'five-lessons', title: 'Quick Learner', description: 'Complete 5 lessons', icon: 'GraduationCap', category: 'curriculum', rarity: 'common', xpReward: 20, condition: { type: 'lessons_completed', count: 5 } },
  { id: 'ten-lessons', title: 'Dedicated Student', description: 'Complete 10 lessons', icon: 'GraduationCap', category: 'curriculum', rarity: 'rare', xpReward: 40, condition: { type: 'lessons_completed', count: 10 } },
  { id: 'twenty-lessons', title: 'Scholar', description: 'Complete 20 lessons', icon: 'GraduationCap', category: 'curriculum', rarity: 'epic', xpReward: 75, condition: { type: 'lessons_completed', count: 20 } },
  { id: 'practice-1h', title: 'First Hour', description: 'Practice for 60 minutes total', icon: 'Clock', category: 'practice', rarity: 'common', xpReward: 15, condition: { type: 'total_practice_minutes', minutes: 60 } },
  { id: 'practice-10h', title: 'Dedicated', description: 'Practice for 10 hours total', icon: 'Clock', category: 'practice', rarity: 'rare', xpReward: 50, condition: { type: 'total_practice_minutes', minutes: 600 } },
  { id: 'practice-50h', title: 'Committed', description: 'Practice for 50 hours total', icon: 'Clock', category: 'practice', rarity: 'epic', xpReward: 150, condition: { type: 'total_practice_minutes', minutes: 3000 } },
  { id: 'xp-1000', title: 'Rising Star', description: 'Earn 1,000 XP', icon: 'TrendingUp', category: 'special', rarity: 'common', xpReward: 20, condition: { type: 'total_xp', xp: 1000 } },
  { id: 'xp-5000', title: 'Superstar', description: 'Earn 5,000 XP', icon: 'TrendingUp', category: 'special', rarity: 'rare', xpReward: 50, condition: { type: 'total_xp', xp: 5000 } },
  { id: 'xp-10000', title: 'Legend', description: 'Earn 10,000 XP', icon: 'Crown', category: 'special', rarity: 'legendary', xpReward: 100, condition: { type: 'total_xp', xp: 10000 } },
  { id: 'ten-songs', title: 'Music Lover', description: 'Play 10 songs', icon: 'Music', category: 'practice', rarity: 'common', xpReward: 20, condition: { type: 'songs_played', count: 10 } },
  { id: 'fifty-songs', title: 'Jukebox', description: 'Play 50 songs', icon: 'Music', category: 'practice', rarity: 'rare', xpReward: 50, condition: { type: 'songs_played', count: 50 } },
]
