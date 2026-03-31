import { create } from 'zustand'
import type { SkillLevels } from '@/lib/db'

interface CurriculumState {
  completedLessons: Set<string>
  moduleProgress: Map<string, number>
  currentModuleId: string | null
  currentLessonId: string | null
  skills: SkillLevels

  completeLesson: (lessonId: string, moduleId: string, totalLessonsInModule: number) => void
  isModuleUnlocked: (prerequisites: string[]) => boolean
  updateSkills: (skills: Partial<SkillLevels>) => void
  reset: () => void
}

const defaultSkills: SkillLevels = {
  noteReading: 0, rhythm: 0, leftHand: 0, rightHand: 0, bothHands: 0, chords: 0,
}

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  completedLessons: new Set(),
  moduleProgress: new Map(),
  currentModuleId: null,
  currentLessonId: null,
  skills: { ...defaultSkills },

  completeLesson: (lessonId, moduleId, totalLessonsInModule) => {
    const state = get()
    const newCompleted = new Set(state.completedLessons)
    newCompleted.add(lessonId)

    const completedInModule = Array.from(newCompleted).filter(id => id.startsWith(moduleId)).length
    const progress = completedInModule / totalLessonsInModule

    const newProgress = new Map(state.moduleProgress)
    newProgress.set(moduleId, progress)

    set({ completedLessons: newCompleted, moduleProgress: newProgress })
  },

  isModuleUnlocked: (prerequisites) => {
    const state = get()
    return prerequisites.every(prereqId => (state.moduleProgress.get(prereqId) ?? 0) >= 1.0)
  },

  updateSkills: (newSkills) => {
    const state = get()
    set({ skills: { ...state.skills, ...newSkills } })
  },

  reset: () => set({
    completedLessons: new Set(),
    moduleProgress: new Map(),
    currentModuleId: null,
    currentLessonId: null,
    skills: { ...defaultSkills },
  }),
}))
