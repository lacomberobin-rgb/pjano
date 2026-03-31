import type { SessionScore } from '@/types/scoring'

const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200,
  6600, 8200, 10000, 12000, 14500, 17500, 21000, 25000, 30000, 36000,
]

export function getLevelForXP(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]!) return i + 1
  }
  return 1
}

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) return Infinity
  return LEVEL_THRESHOLDS[currentLevel] ?? Infinity
}

export function getXPProgress(totalXP: number): { level: number; current: number; needed: number; percent: number } {
  const level = getLevelForXP(totalXP)
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 1000
  const current = totalXP - currentThreshold
  const needed = nextThreshold - currentThreshold
  return { level, current, needed, percent: Math.min(100, Math.round((current / needed) * 100)) }
}

export function calculateSessionXP(score: SessionScore): number {
  let xp = 0
  xp += Math.floor(score.accuracy * 0.5)
  xp += score.grade === 'S' ? 30 : score.grade === 'A' ? 20 : score.grade === 'B' ? 10 : 5
  xp += Math.floor(score.maxCombo / 10) * 5
  if (score.accuracy === 100) xp += 25
  return xp
}
