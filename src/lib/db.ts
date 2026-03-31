import Dexie, { type EntityTable } from 'dexie'

// ── Interfaces ──

export interface UserProfile {
  userId: string
  displayName: string
  totalXP: number
  level: number
  streak: StreakData
  skills: SkillLevels
  createdAt: Date
  updatedAt: Date
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastPracticeDate: string
  practiceDates: string[]
}

export interface SkillLevels {
  noteReading: number
  rhythm: number
  leftHand: number
  rightHand: number
  bothHands: number
  chords: number
}

export interface LessonProgress {
  id?: number
  lessonId: string
  moduleId: string
  bestScore: number
  bestAccuracy: number
  bestGrade: string
  completedAt: Date | null
  attempts: number
  totalPracticeSeconds: number
  lastPlayedAt: Date
}

export interface SongScore {
  id?: number
  songId: string
  score: number
  accuracy: number
  grade: string
  maxCombo: number
  perfectCount: number
  greatCount: number
  goodCount: number
  missCount: number
  playbackSpeed: number
  playedAt: Date
  durationSeconds: number
}

export interface XPHistoryEntry {
  id?: number
  source: string
  amount: number
  description: string
  timestamp: Date
}

export interface UnlockedAchievement {
  id?: number
  achievementId: string
  unlockedAt: Date
}

export interface ImportedSong {
  id?: number
  title: string
  artist?: string
  difficulty: number
  bpm: number
  duration: number
  songData: string
  importedAt: Date
  lastPlayedAt?: Date
  playCount: number
}

export interface PracticeSession {
  id?: number
  date: string
  totalSeconds: number
  lessonsCompleted: number
  songsPlayed: number
  averageAccuracy: number
}

export interface Setting {
  key: string
  value: string | number | boolean
}

// ── Database ──

export class PjanoDB extends Dexie {
  userProfiles!: EntityTable<UserProfile, 'userId'>
  lessonProgress!: EntityTable<LessonProgress, 'id'>
  songScores!: EntityTable<SongScore, 'id'>
  xpHistory!: EntityTable<XPHistoryEntry, 'id'>
  unlockedAchievements!: EntityTable<UnlockedAchievement, 'id'>
  importedSongs!: EntityTable<ImportedSong, 'id'>
  practiceSessions!: EntityTable<PracticeSession, 'id'>
  settings!: EntityTable<Setting, 'key'>

  constructor() {
    super('PjanoDB')

    this.version(1).stores({
      userProfiles: 'userId',
      lessonProgress: '++id, lessonId, moduleId, [moduleId+lessonId], lastPlayedAt',
      songScores: '++id, songId, playedAt, score',
      xpHistory: '++id, source, timestamp',
      unlockedAchievements: '++id, achievementId, unlockedAt',
      importedSongs: '++id, title, importedAt, lastPlayedAt',
      practiceSessions: '++id, date',
      settings: 'key',
    })
  }
}

export const db = new PjanoDB()
