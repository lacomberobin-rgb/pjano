import type { Song } from '@/types/song'

export interface CurriculumModule {
  id: string
  title: string
  description: string
  order: number
  icon: string
  color: string
  prerequisites: string[]
  lessons: CurriculumLesson[]
}

export interface CurriculumLesson {
  id: string
  title: string
  description: string
  order: number
  passingScore: number
  song: Song
}

export const module01: CurriculumModule = {
  id: 'module-01',
  title: 'Your First Notes',
  description: 'Learn Middle C and its neighbors',
  order: 1,
  icon: 'Music',
  color: '#22c55e',
  prerequisites: [],
  lessons: [
    {
      id: 'module-01-lesson-01',
      title: 'Meet Middle C',
      description: 'Find and play Middle C with your right thumb',
      order: 1,
      passingScore: 60,
      song: {
        id: 'ex-01-01',
        title: 'Middle C Exercise',
        bpm: 72,
        timeSignature: [4, 4],
        keySignature: 'C',
        difficulty: 1,
        duration: 8,
        countInBeats: 4,
        notes: [
          { id: 'n1', midiNote: 60, time: 0, duration: 1, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n2', midiNote: 60, time: 1.333, duration: 1, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n3', midiNote: 60, time: 2.667, duration: 1, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n4', midiNote: 60, time: 4, duration: 2, hand: 'right', finger: 1, velocity: 80 },
        ],
      },
    },
    {
      id: 'module-01-lesson-02',
      title: 'C and D',
      description: 'Play C and D with thumb and index finger',
      order: 2,
      passingScore: 60,
      song: {
        id: 'ex-01-02',
        title: 'C and D',
        bpm: 80,
        timeSignature: [4, 4],
        keySignature: 'C',
        difficulty: 1,
        duration: 10,
        countInBeats: 4,
        notes: [
          { id: 'n1', midiNote: 60, time: 0, duration: 0.667, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n2', midiNote: 62, time: 0.75, duration: 0.667, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n3', midiNote: 60, time: 1.5, duration: 0.667, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n4', midiNote: 62, time: 2.25, duration: 0.667, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n5', midiNote: 62, time: 3, duration: 0.667, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n6', midiNote: 60, time: 3.75, duration: 0.667, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n7', midiNote: 62, time: 4.5, duration: 0.667, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n8', midiNote: 60, time: 5.25, duration: 1.5, hand: 'right', finger: 1, velocity: 80 },
        ],
      },
    },
    {
      id: 'module-01-lesson-03',
      title: 'C D E',
      description: 'Add the middle finger on E',
      order: 3,
      passingScore: 65,
      song: {
        id: 'ex-01-03',
        title: 'Three Note Song',
        bpm: 84,
        timeSignature: [4, 4],
        keySignature: 'C',
        difficulty: 1,
        duration: 12,
        countInBeats: 4,
        notes: [
          { id: 'n1', midiNote: 60, time: 0, duration: 0.5, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n2', midiNote: 62, time: 0.714, duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n3', midiNote: 64, time: 1.429, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
          { id: 'n4', midiNote: 62, time: 2.143, duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n5', midiNote: 60, time: 2.857, duration: 1, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n6', midiNote: 64, time: 4.286, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
          { id: 'n7', midiNote: 64, time: 5, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
          { id: 'n8', midiNote: 62, time: 5.714, duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n9', midiNote: 62, time: 6.429, duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n10', midiNote: 60, time: 7.143, duration: 1.5, hand: 'right', finger: 1, velocity: 80 },
        ],
      },
    },
    {
      id: 'module-01-lesson-04',
      title: 'Five Finger Position',
      description: 'Play C D E F G with all five fingers',
      order: 4,
      passingScore: 70,
      song: {
        id: 'ex-01-04',
        title: 'Five Finger Scale',
        bpm: 80,
        timeSignature: [4, 4],
        keySignature: 'C',
        difficulty: 1,
        duration: 14,
        countInBeats: 4,
        notes: [
          { id: 'n1', midiNote: 60, time: 0, duration: 0.667, hand: 'right', finger: 1, velocity: 80 },
          { id: 'n2', midiNote: 62, time: 0.75, duration: 0.667, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n3', midiNote: 64, time: 1.5, duration: 0.667, hand: 'right', finger: 3, velocity: 80 },
          { id: 'n4', midiNote: 65, time: 2.25, duration: 0.667, hand: 'right', finger: 4, velocity: 80 },
          { id: 'n5', midiNote: 67, time: 3, duration: 1, hand: 'right', finger: 5, velocity: 85 },
          { id: 'n6', midiNote: 65, time: 4.5, duration: 0.667, hand: 'right', finger: 4, velocity: 80 },
          { id: 'n7', midiNote: 64, time: 5.25, duration: 0.667, hand: 'right', finger: 3, velocity: 80 },
          { id: 'n8', midiNote: 62, time: 6, duration: 0.667, hand: 'right', finger: 2, velocity: 80 },
          { id: 'n9', midiNote: 60, time: 6.75, duration: 2, hand: 'right', finger: 1, velocity: 85 },
        ],
      },
    },
  ],
}
