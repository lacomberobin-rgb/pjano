import { module01, type CurriculumModule } from './module-01-first-notes'

export type { CurriculumModule, CurriculumLesson } from './module-01-first-notes'

export const curriculum: CurriculumModule[] = [
  module01,
]

export function getModule(moduleId: string): CurriculumModule | undefined {
  return curriculum.find(m => m.id === moduleId)
}

export function getLesson(lessonId: string): { module: CurriculumModule; lesson: CurriculumModule['lessons'][0] } | undefined {
  for (const mod of curriculum) {
    const lesson = mod.lessons.find(l => l.id === lessonId)
    if (lesson) return { module: mod, lesson }
  }
  return undefined
}
