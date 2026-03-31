import type { Song } from '@/types/song'

/** Simple C major scale exercise for testing */
export const testSong: Song = {
  id: 'test-c-major-scale',
  title: 'C Major Scale',
  composer: 'Traditional',
  difficulty: 1,
  bpm: 90,
  timeSignature: [4, 4],
  keySignature: 'C',
  duration: 16,
  countInBeats: 4,
  notes: [
    // Ascending C major scale — right hand
    { id: 'n01', midiNote: 60, time: 0,    duration: 0.5, hand: 'right', finger: 1, velocity: 80 },
    { id: 'n02', midiNote: 62, time: 0.667, duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
    { id: 'n03', midiNote: 64, time: 1.333, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
    { id: 'n04', midiNote: 65, time: 2,    duration: 0.5, hand: 'right', finger: 1, velocity: 80 },
    { id: 'n05', midiNote: 67, time: 2.667, duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
    { id: 'n06', midiNote: 69, time: 3.333, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
    { id: 'n07', midiNote: 71, time: 4,    duration: 0.5, hand: 'right', finger: 4, velocity: 80 },
    { id: 'n08', midiNote: 72, time: 4.667, duration: 1.0, hand: 'right', finger: 5, velocity: 90 },

    // Descending
    { id: 'n09', midiNote: 71, time: 5.667, duration: 0.5, hand: 'right', finger: 4, velocity: 80 },
    { id: 'n10', midiNote: 69, time: 6.333, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
    { id: 'n11', midiNote: 67, time: 7,    duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
    { id: 'n12', midiNote: 65, time: 7.667, duration: 0.5, hand: 'right', finger: 1, velocity: 80 },
    { id: 'n13', midiNote: 64, time: 8.333, duration: 0.5, hand: 'right', finger: 3, velocity: 80 },
    { id: 'n14', midiNote: 62, time: 9,    duration: 0.5, hand: 'right', finger: 2, velocity: 80 },
    { id: 'n15', midiNote: 60, time: 9.667, duration: 1.5, hand: 'right', finger: 1, velocity: 90 },

    // Simple chord ending
    { id: 'n16', midiNote: 60, time: 12, duration: 2, hand: 'right', finger: 1, velocity: 85 },
    { id: 'n17', midiNote: 64, time: 12, duration: 2, hand: 'right', finger: 3, velocity: 85 },
    { id: 'n18', midiNote: 67, time: 12, duration: 2, hand: 'right', finger: 5, velocity: 85 },
  ],
  sections: [
    { name: 'Ascending', startTime: 0, endTime: 5.667 },
    { name: 'Descending', startTime: 5.667, endTime: 11.167 },
    { name: 'Chord', startTime: 12, endTime: 14 },
  ],
}
