// ── Scoring timing windows (seconds) ──
export const PERFECT_WINDOW = 0.050
export const GREAT_WINDOW = 0.100
export const GOOD_WINDOW = 0.180

// ── Points per timing grade ──
export const PERFECT_POINTS = 100
export const GREAT_POINTS = 75
export const GOOD_POINTS = 50
export const MISS_POINTS = 0

// ── Combo multiplier ──
export const COMBO_MULTIPLIER_STEP = 10   // every N combo
export const COMBO_MULTIPLIER_INC = 0.1   // increment per step
export const COMBO_MULTIPLIER_MAX = 2.0

// ── Grade thresholds (accuracy %) ──
export const GRADE_S = 95
export const GRADE_A = 85
export const GRADE_B = 70
export const GRADE_C = 50

// ── Falling notes renderer ──
export const PIXELS_PER_SECOND = 400
export const VISIBLE_WINDOW_SECONDS = 3

// ── Piano range ──
export const DEFAULT_LOW_NOTE = 48   // C3
export const DEFAULT_HIGH_NOTE = 84  // C6
export const MIDDLE_C = 60

// ── Audio ──
export const SAMPLE_BASE_URL = '/samples/'

// ── Computer keyboard → MIDI mapping ──
// Bottom row: Z-/ → C3 to E4 (white keys)
// Middle row: A-; → C4 to E5 (white keys)
// Black keys via number/top rows
export const KEYBOARD_MAP: Record<string, number> = {
  // Bottom row — C3 to E4
  KeyZ: 48,  // C3
  KeyX: 50,  // D3
  KeyC: 52,  // E3
  KeyV: 53,  // F3
  KeyB: 55,  // G3
  KeyN: 57,  // A3
  KeyM: 59,  // B3
  Comma: 60, // C4
  Period: 62, // D4
  Slash: 64, // E4

  // Bottom row sharps (top letter row)
  KeyS: 49,  // C#3
  KeyD: 51,  // D#3
  KeyG: 54,  // F#3
  KeyH: 56,  // G#3
  KeyJ: 58,  // A#3

  // Middle row — C4 to E5
  KeyQ: 60,  // C4
  KeyW: 62,  // D4
  KeyE: 64,  // E4
  KeyR: 65,  // F4
  KeyT: 67,  // G4
  KeyY: 69,  // A4
  KeyU: 71,  // B4
  KeyI: 72,  // C5
  KeyO: 74,  // D5
  KeyP: 76,  // E5

  // Middle row sharps (number row)
  Digit2: 61,  // C#4
  Digit3: 63,  // D#4
  Digit5: 66,  // F#4
  Digit6: 68,  // G#4
  Digit7: 70,  // A#4
}
