# pjano

> Learn piano by doing — Guitar Hero meets real pedagogy.

A web app that teaches piano through falling notes gameplay combined with proper music education. Unlike Synthesia (pure gamification, no pedagogy) or traditional apps (structured but boring), pjano delivers both: engaging gameplay AND a real learning path with hand positioning, sight reading, and progressive curriculum.

**Target audience:** Complete beginners to early intermediate pianists on desktop browsers.
**Platform:** Chrome, Edge, Firefox (desktop only). No Safari (no Web MIDI API support).

## Design Philosophy

1. **Learn by doing** — Every concept is immediately practiced, never just explained
2. **Fun AND effective** — Never sacrifice pedagogy for gamification or vice versa
3. **Progressive scaffolding** — Visual aids (hand overlay, finger numbers) fade as skills develop
4. **Dual representation** — Falling notes for engagement, staff notation for real music literacy
5. **Playful & gamified** — Duolingo-style engagement: XP, streaks, achievements, levels, celebrations

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | ~5.9 | Type safety (strict mode) |
| Vite | 7 | Build tool + dev server |
| Tailwind CSS | 4 | Styling (with `@tailwindcss/vite` plugin) |
| shadcn/ui | latest | UI component primitives |
| Zustand | 5 | State management (multiple stores) |
| Dexie.js | 4 | Local IndexedDB storage (source of truth) |
| Supabase | 2 | Auth + cloud sync |
| PixiJS | 8 | WebGL falling notes rendering (60fps) |
| WEBMIDI.js | 3 | MIDI keyboard input |
| Tone.js | 15 | Sampled piano audio playback |
| midi-file | 1 | MIDI file parsing |
| framer-motion | 12 | Page transitions + animations |
| react-router-dom | 7 | Client-side routing |
| Lucide React | latest | Icons |
| class-variance-authority | 0.7 | Component variants |
| clsx + tailwind-merge | latest | Class name utilities |
| sonner | 2 | Toast notifications |

---

## Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run type-check   # TypeScript strict check (tsc --noEmit)
npm run lint         # ESLint
```

---

## Project Structure

```
pjano/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── components.json                      # shadcn/ui config
├── .env.local                           # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── CLAUDE.md
│
├── public/
│   ├── favicon.svg
│   └── samples/                         # Salamander Grand Piano samples
│       ├── manifest.json                # Maps note names → sample file URLs
│       └── *.ogg                        # Piano samples (OGG Vorbis)
│
├── supabase/
│   └── schema.sql                       # Full Supabase schema + RLS policies
│
└── src/
    ├── main.tsx                          # App entry point
    ├── App.tsx                           # Router + providers
    │
    ├── types/
    │   ├── music.ts                     # Note, Pitch, Duration, TimeSignature, KeySignature
    │   ├── song.ts                      # Song, SongNote, SongSection, SongMetadata
    │   ├── input.ts                     # PianoInputEvent, InputSource
    │   ├── scoring.ts                   # NoteResult, TimingGrade, SessionScore
    │   ├── curriculum.ts                # Lesson, Module, SkillGate, LessonStep
    │   ├── gamification.ts              # Achievement, XPEvent, PlayerLevel, Streak
    │   └── user.ts                      # UserProfile, UserProgress, UserSettings
    │
    ├── lib/
    │   ├── supabase.ts                  # Supabase client singleton
    │   ├── db.ts                        # Dexie database schema + types
    │   ├── sync.ts                      # Dexie ↔ Supabase sync engine
    │   ├── utils.ts                     # cn(), clamp(), lerp()
    │   ├── constants.ts                 # Timing windows, XP values, colors, key mappings
    │   ├── music-theory.ts              # MIDI ↔ note name, intervals, scales, chords
    │   ├── midi-parser.ts               # MIDI file → Song format converter
    │   ├── scoring-engine.ts            # Note matching + timing grading
    │   ├── xp-engine.ts                 # XP calculation, level thresholds, streak logic
    │   └── audio-engine.ts              # Tone.js sampler + low-latency playback (singleton)
    │
    ├── engine/
    │   ├── GameEngine.ts                # Core rAF game loop, orchestrates everything
    │   ├── NoteScheduler.ts             # Determines active/upcoming/past notes
    │   ├── InputMatcher.ts              # Matches input to scheduled notes, grades timing
    │   └── PracticeEngine.ts            # Wait mode, looping, speed ramp
    │
    ├── input/
    │   ├── InputManager.ts              # Unified input abstraction (singleton)
    │   ├── MidiInputAdapter.ts          # WEBMIDI.js v3 adapter
    │   ├── ScreenKeyboardAdapter.ts     # Mouse/touch on-screen keyboard
    │   └── ComputerKeyboardAdapter.ts   # QWERTY keyboard mapping
    │
    ├── renderer/
    │   ├── FallingNotesRenderer.ts      # PixiJS Application — WebGL canvas
    │   ├── NoteSprite.ts                # Individual note (color, glow, finger number)
    │   ├── LaneLines.ts                 # Key lane guidelines
    │   ├── HitZone.ts                   # The "now" line with timing flash
    │   └── particles/
    │       ├── PerfectBurst.ts          # Particle effect for perfect hits
    │       └── ComboFlame.ts            # Streak fire effect
    │
    ├── store/
    │   ├── gameStore.ts                 # Active game session (score, combo, timing, playback)
    │   ├── appStore.ts                  # Global UI (modals, MIDI status, audio status)
    │   ├── settingsStore.ts             # User preferences (persisted to Dexie)
    │   └── curriculumStore.ts           # Lesson progress, unlocked modules, skills
    │
    ├── hooks/
    │   ├── useAuth.ts                   # Supabase auth (login, signup, session)
    │   ├── useInput.ts                  # Subscribe to InputManager events
    │   ├── useAudioEngine.ts            # Init/control Tone.js sampler
    │   ├── useGameEngine.ts             # Start/stop/pause game, bind to store
    │   ├── useScoring.ts                # Live scoring subscription
    │   ├── useCurriculum.ts             # Load/advance lessons, check skill gates
    │   ├── usePixiApp.ts                # PixiJS Application lifecycle
    │   ├── useHandPosition.ts           # Hand overlay state based on level
    │   ├── useMidiDevices.ts            # List/select MIDI devices
    │   ├── useSettings.ts               # Read/write settings via Dexie
    │   ├── useSongLoader.ts             # Load from curriculum or MIDI file
    │   └── useGamification.ts           # XP, streaks, achievements, level-ups
    │
    ├── components/
    │   ├── ui/                          # shadcn/ui primitives (Button, Card, Dialog, etc.)
    │   ├── layout/
    │   │   ├── AppShell.tsx             # Sidebar + content area
    │   │   ├── Sidebar.tsx              # Nav: Dashboard, Learn, Practice, Library, Settings
    │   │   └── TopBar.tsx               # Streak counter, XP bar, user avatar
    │   ├── auth/
    │   │   ├── AuthPage.tsx             # Login/signup
    │   │   └── AuthGuard.tsx            # Redirect if not logged in
    │   ├── dashboard/
    │   │   ├── DashboardPage.tsx        # Streak, recent activity, next lesson CTA
    │   │   ├── StreakCalendar.tsx        # GitHub-style practice heatmap
    │   │   ├── StatsOverview.tsx        # Total time, lessons, accuracy
    │   │   └── NextLessonCard.tsx       # CTA for next curriculum lesson
    │   ├── curriculum/
    │   │   ├── CurriculumPage.tsx       # Module list with progress bars
    │   │   ├── ModuleCard.tsx           # Module: title, progress, lock state
    │   │   ├── LessonView.tsx           # Lesson intro + step sequence
    │   │   └── SkillGateModal.tsx       # "Pass this test to unlock next module"
    │   ├── game/
    │   │   ├── GamePage.tsx             # Full game view, orchestrates all game components
    │   │   ├── FallingNotesCanvas.tsx   # React wrapper for PixiJS renderer
    │   │   ├── StaffNotation.tsx        # SVG staff notation display
    │   │   ├── PianoKeyboard.tsx        # On-screen playable piano
    │   │   ├── ScoreDisplay.tsx         # Live score, combo, accuracy %
    │   │   ├── TimingFeedback.tsx       # "Perfect!" / "Great!" / "Good!" / "Miss" popups
    │   │   ├── HandOverlay.tsx          # Animated hand position guide (SVG)
    │   │   ├── PracticeControls.tsx     # Speed slider, loop, wait mode toggle
    │   │   ├── SongProgress.tsx         # Progress bar through song
    │   │   └── GameOverScreen.tsx       # Results: score, accuracy, XP, stars
    │   ├── library/
    │   │   ├── LibraryPage.tsx          # Browse/search songs
    │   │   ├── SongCard.tsx             # Thumbnail + difficulty + best score
    │   │   ├── MidiImportDialog.tsx     # Drag-and-drop MIDI import
    │   │   └── SongPreview.tsx          # Preview before playing
    │   ├── settings/
    │   │   ├── SettingsPage.tsx         # All settings
    │   │   ├── MidiSettings.tsx         # Device selection + test
    │   │   ├── AudioSettings.tsx        # Volume, latency calibration
    │   │   └── DisplaySettings.tsx      # Visuals, hand guide toggle
    │   ├── gamification/
    │   │   ├── XPBar.tsx                # Animated XP progress in TopBar
    │   │   ├── LevelUpModal.tsx         # Celebration + confetti
    │   │   ├── AchievementToast.tsx     # Achievement unlock notification
    │   │   └── AchievementsPage.tsx     # Full achievements gallery
    │   ├── onboarding/
    │   │   ├── OnboardingFlow.tsx       # First-run wizard
    │   │   ├── MidiSetupStep.tsx        # Connect MIDI or choose on-screen
    │   │   ├── AudioCalibrationStep.tsx # Latency calibration
    │   │   └── SkillAssessmentStep.tsx  # Quick placement test
    │   └── ErrorBoundary.tsx
    │
    ├── data/
    │   ├── curriculum/
    │   │   ├── index.ts                 # Curriculum registry
    │   │   ├── module-01-first-notes.ts
    │   │   ├── module-02-reading-treble.ts
    │   │   ├── module-03-right-hand-scales.ts
    │   │   ├── module-04-reading-bass.ts
    │   │   ├── module-05-left-hand.ts
    │   │   ├── module-06-both-hands.ts
    │   │   ├── module-07-chords.ts
    │   │   ├── module-08-songs-beginner.ts
    │   │   ├── module-09-eighth-notes.ts
    │   │   └── module-10-sharps-flats.ts
    │   └── achievements.ts              # 30+ achievement definitions
    │
    └── styles/
        └── globals.css                  # Tailwind directives + custom properties
```

---

## Architecture

### Component Hierarchy

```
App
├── AuthGuard
│   ├── OnboardingFlow (if first run)
│   └── AppShell
│       ├── Sidebar
│       ├── TopBar (XPBar, StreakCounter, Avatar)
│       └── <Routes>
│           ├── /dashboard   → DashboardPage
│           ├── /learn       → CurriculumPage
│           ├── /learn/:mod  → ModuleCard (expanded)
│           ├── /learn/:mod/:lesson → LessonView
│           ├── /play/:songId → GamePage
│           │   ├── FallingNotesCanvas (PixiJS)
│           │   ├── StaffNotation (SVG)
│           │   ├── PianoKeyboard (React+CSS)
│           │   ├── HandOverlay (SVG, absolute)
│           │   ├── ScoreDisplay
│           │   ├── TimingFeedback
│           │   ├── PracticeControls
│           │   └── SongProgress
│           ├── /library     → LibraryPage
│           ├── /achievements → AchievementsPage
│           └── /settings    → SettingsPage
```

### State Management (4 Zustand stores)

| Store | Responsibility | Update Frequency |
|-------|---------------|------------------|
| `gameStore` | Active game session: score, combo, currentTime, playbackSpeed, noteResults | Every frame (throttled to 30fps for React) |
| `appStore` | Global UI: modals, MIDI connection status, audio load status | On events |
| `settingsStore` | User preferences (persisted to Dexie): volumes, display, input prefs | On user action |
| `curriculumStore` | Lesson progress, module unlocks, skill levels | On lesson complete |

### Data Flow During Gameplay

```
Input (MIDI/Screen/Keyboard)
  │
  ▼
InputManager (singleton, synchronous emit)
  │
  ├──► AudioEngine (plays sound IMMEDIATELY — zero-logic path)
  │
  └──► GameEngine.InputMatcher
         │
         ▼
       NoteResult { grade, timingOffset, points }
         │
         ▼
       gameStore.recordNoteResult()
         │
         ├──► ScoreDisplay (React, 30fps)
         ├──► TimingFeedback (React)
         ├──► FallingNotesRenderer (PixiJS, 60fps — reads results directly)
         └──► PianoKeyboard (React, key highlights)
```

**Critical rule:** Audio plays on input, not on game engine tick. The game engine only decides scoring.

### Game Layout

```
┌──────────────────────────────────────────────────────┐
│ GamePage                                              │
│ ┌──────────────────┬────────────────┬───────────────┐ │
│ │ FallingNotes     │ StaffNotation  │ ScoreDisplay  │ │
│ │ (PixiJS WebGL)   │ (SVG)          │ (React)       │ │
│ │                  │                │               │ │
│ │  Notes fall ↓    │ Current measure│  Score: 9450  │ │
│ │  ████            │ ♩ ♩ ♪ ♩        │  Combo: 23x   │ │
│ │  ──── hit zone ──│ cursor ▼       │  Accuracy: 94%│ │
│ ├──────────────────┴────────────────┴───────────────┤ │
│ │ PianoKeyboard (React + CSS)                        │ │
│ │ ┌─┬█┬─┬█┬─┬─┬█┬─┬█┬─┬█┬─┬─┬█┬─┬█┬─┐             │ │
│ │ └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘             │ │
│ └────────────────────────────────────────────────────┘ │
│ HandOverlay (absolute positioned, CSS animated)        │
│ PracticeControls                                       │
└──────────────────────────────────────────────────────┘
```

---

## Core Systems

### 1. Input System

**InputManager** is a singleton class (NOT React context) for minimal latency. All three input adapters feed into it:

- **MidiInputAdapter** — WEBMIDI.js v3, auto-detects devices, emits `noteon`/`noteoff`
- **ScreenKeyboardAdapter** — Mouse/touch on the PianoKeyboard component
- **ComputerKeyboardAdapter** — QWERTY mapping (Z-/ for C3-E4, A-; for C4-E5, number row for black keys). Uses `event.code` for layout independence.

Every input normalizes to `PianoInputEvent { type, note (MIDI 0-127), velocity (0-127), timestamp (performance.now()), source }`.

### 2. Audio Engine

Singleton wrapping Tone.js Sampler with Salamander Grand Piano samples.

- **Critical:** Set `Tone.context.lookAhead = 0` for interactive use (default 0.1s adds 100ms latency)
- AudioContext must be resumed on first user gesture (onboarding handles this)
- Sample format: OGG Vorbis (smaller than WAV, hardware-decoded on all target browsers)
- Latency calibration during onboarding: metronome tap-along measures average offset → stored as `latencyOffset`

### 3. Falling Notes Renderer (PixiJS)

**Runs entirely outside React.** Has its own `requestAnimationFrame` loop at 60fps. The React wrapper (`FallingNotesCanvas.tsx`) only manages lifecycle (create/destroy/resize).

- Notes are sprites with color (white=upcoming, green=perfect, yellow=great, orange=good, red=miss)
- Object pooling for sprites to avoid GC pauses
- Hit zone line with glow effect on hits
- Particle effects: PerfectBurst (sparkles), ComboFlame (streak fire)
- `pixelsPerSecond` = 400 (configurable), `visibleWindowSeconds` = 3

### 4. Game Engine

`GameEngine.ts` runs the rAF loop and coordinates:
1. Advance `currentTime` by `dt * playbackSpeed`
2. PracticeEngine applies constraints (wait mode freeze, loop wrap)
3. Check missed notes (past miss window)
4. Update PixiJS renderer (directly, no React)
5. Update Zustand store (throttled to 30fps for React components)

### 5. Scoring

**Timing windows** (symmetrical around expected note time):
| Grade | Window | Points |
|-------|--------|--------|
| Perfect | ±50ms | 100 |
| Great | ±100ms | 75 |
| Good | ±180ms | 50 |
| Miss | beyond | 0 |

**Combo:** Increments on any non-miss. Resets on miss. Multiplier: `1 + floor(combo / 10) * 0.1` (max 2x).

**Session grades:** S (≥95%), A (≥85%), B (≥70%), C (≥50%), D (<50%).

### 6. Practice Engine

- **Wait mode:** Song freezes until the correct note is pressed (no fail state). Best for learning.
- **Loop mode:** Set loop markers (start/end). Song wraps and resets matched notes on loop.
- **Speed ramp:** 0.25x to 2.0x playback speed.
- **Metronome:** Optional click track synced to song BPM.

---

## Curriculum System

### Module Progression

| # | Module | Skills | Hand |
|---|--------|--------|------|
| 1 | First Notes | Middle C, D, E, F, G | Right |
| 2 | Reading Treble Clef | Staff notation C4-G4, quarter/half/whole notes | Right |
| 3 | Right Hand Scales | C major scale, F and G positions | Right |
| 4 | Reading Bass Clef | Staff notation C3-G3, left hand C position | Left |
| 5 | Left Hand | Mirror exercises, bass clef | Left |
| 6 | Both Hands Together | Parallel motion, then contrary | Both |
| 7 | Chords | C, F, G major triads, accompaniment patterns | Both |
| 8 | Beginner Songs | Simple classical/folk melodies | Both |
| 9 | Eighth Notes & Rhythm | Faster subdivisions, dotted rhythms | Both |
| 10 | Sharps & Flats | Accidentals, key signatures beyond C major | Both |

### Lesson Format

Each lesson has steps: `instruction` (text/image) → `demonstration` (auto-play) → `exercise` (wait mode, slow) → `challenge` (full speed, scored). Lessons require a `passingScore` to complete. Modules have `prerequisites` (other modules) and an optional `SkillGate` test to unlock the next module.

### Lesson Data

Curriculum is **static TypeScript** (not database content). Songs within lessons are defined inline with `SongNote[]` arrays including `hand` and `finger` annotations. This keeps iteration fast and avoids CMS overhead.

### Song Data Format

```typescript
interface Song {
  id: string
  title: string
  composer?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  bpm: number
  timeSignature: [number, number]    // [beats, beatUnit]
  keySignature: string
  duration: number                   // total seconds
  countInBeats: number
  notes: SongNote[]
  sections?: SongSection[]
  metadata?: { source: 'curriculum' | 'midi-import'; midiFileName?: string }
}

interface SongNote {
  id: string
  midiNote: number                   // 0-127
  time: number                       // seconds from song start
  duration: number                   // seconds
  hand: 'left' | 'right' | 'either'
  finger?: number                    // 1-5
  velocity: number                   // 0-127
}
```

Internal format uses absolute seconds (not MIDI ticks). MIDI files are parsed and converted on import.

---

## Hand Position System (Progressive)

The hand guide adapts based on curriculum progress:

| Level | When | What |
|-------|------|------|
| Full overlay | Modules 1-2 (skill < 30) | Animated 2D SVG hand over keyboard. Fingers glow to indicate which to press next. Hand slides for position changes. |
| Finger numbers | Modules 3-5 (skill 30-60) | Numbers (1-5) displayed on falling notes and on target keys. No hand graphic. |
| No guide | Modules 6+ (skill > 60) | Clean view. Fingering available on hover in practice mode. |

User can override in settings (`handGuideLevel: 'full' | 'fingers' | 'off' | 'auto'`).

---

## Gamification

### XP & Levels

- XP earned from: lesson completion (up to ~100), song play, perfect streaks, daily practice, achievements, skill gates (1.5x multiplier)
- Level thresholds: L1=0, L2=100, L3=300, L4=600, L5=1000, L6=1500, ... (formula: `500 * level * 1.2`)
- Level-up triggers celebration modal with confetti animation

### Streaks

- Track consecutive practice days
- Streak counter in TopBar (fire icon)
- Practice heatmap (GitHub-style calendar) on dashboard
- Streak preserved if practiced at least once that day

### Achievements (30+)

Categories: `practice`, `skill`, `curriculum`, `special`. Rarities: `common`, `rare`, `epic`, `legendary`.

Examples: "First Note!" (play first note), "Week Warrior" (7-day streak), "Flawless" (100% accuracy), "On Fire" (50-note combo), "Completionist" (finish all modules).

Each achievement awards bonus XP.

---

## Data Model

### Dexie Tables (local IndexedDB)

| Table | Primary Key | Indexes |
|-------|-------------|---------|
| `userProfiles` | `userId` | — |
| `lessonProgress` | `++id` | `lessonId, moduleId, [moduleId+lessonId], lastPlayedAt` |
| `songScores` | `++id` | `songId, playedAt, score` |
| `xpHistory` | `++id` | `source, timestamp` |
| `unlockedAchievements` | `++id` | `achievementId, unlockedAt` |
| `importedSongs` | `++id` | `title, importedAt, lastPlayedAt` |
| `practiceSessions` | `++id` | `date` |
| `settings` | `key` | — |
| `_syncMap` | `++id` | `[tableName+localId], [tableName+remoteId]` |
| `_syncQueue` | `++id` | `tableName, createdAt` |

### Supabase Tables

Mirror of Dexie tables with `user_id` foreign key to `auth.users(id)`. RLS policies: each user accesses only their own data. All tables use `uuid` primary keys in Supabase, mapped to local integer IDs via `_syncMap`.

### Sync Strategy

Same pattern as MeetingMind:
- Dexie hooks on `creating`/`updating`/`deleting` trigger async Supabase operations
- `_syncQueue` for failed operations, retried on `online` event
- `pullFromSupabase()` on login to hydrate local DB
- `disableSync()` during pull to avoid echo loops
- camelCase ↔ snake_case conversion at the boundary

---

## Key Architectural Decisions

1. **PixiJS runs outside React** — The falling notes renderer has its own rAF loop and reads shared state directly. React components subscribe to Zustand but are throttled to 30fps. This prevents React reconciliation from blocking 60fps rendering.

2. **InputManager is a singleton class, not React context** — Input events must reach the audio engine with minimal latency. Going through React context/state would add 16ms+ of delay.

3. **Audio triggers on input, not on game engine tick** — Sound plays immediately when a key is pressed, regardless of game state. The game engine only handles scoring.

4. **Dexie is source of truth, Supabase is sync target** — Local-first. App works fully offline. Sync is best-effort with retry queue.

5. **Curriculum is static TypeScript, not CMS content** — Fast iteration, no content pipeline overhead. Songs defined inline with pedagogical annotations.

6. **Internal song format, not MIDI** — MIDI files are parsed and converted. Internal format uses absolute seconds and includes `hand`, `finger`, and `section` annotations that MIDI lacks.

7. **Do NOT `setState` on every MIDI event** — Buffer input and update React on animation frames. Use object pooling for PixiJS sprites. Keep the hot path (input → audio → score) allocation-free.

---

## Coding Standards

### TypeScript
- Strict mode required, no `any` types
- Async/await pattern, proper error handling with try/catch
- Explicit return types on exported functions

### React
- Functional components only
- Custom hooks for all side effects
- Lazy loading with `React.lazy()` + Suspense for route-level pages
- `useMemo` / `useCallback` for expensive operations and stable references
- Never `setState` in hot paths (game loop) — use refs or external stores

### Styling
- Tailwind CSS only, no inline styles
- shadcn/ui for all UI primitives
- Dark mode support via Tailwind `dark:` prefix
- Use `cn()` utility from `lib/utils.ts` for conditional classes

### Performance
- PixiJS renderer must maintain 60fps with 500+ active sprites
- React components in game view throttled to 30fps updates
- Object pooling for note sprites (avoid GC pauses)
- Web Workers for heavy computation (MIDI parsing, score calculation)
- `Tone.context.lookAhead = 0` for interactive audio
- Target <50ms total input-to-sound latency

### State
- Zustand for all shared state (no prop drilling beyond 2 levels)
- Dexie for persistent data
- Never duplicate state between stores

---

## MIDI File Import

The `midi-parser.ts` module converts standard MIDI files to the internal `Song` format:
- Parses tracks, extracts tempo + time signature
- Converts tick-based timing to absolute seconds
- Auto-assigns hands: multi-track → track 0 = right, track 1 = left; single-track → split at middle C (MIDI 60)
- Estimates difficulty from note density, range, BPM, and hand separation
- Stores parsed songs in Dexie `importedSongs` table (JSON-serialized `Song`)

Uses the `midi-file` npm package for raw parsing.

---

## Implementation Phases

### Phase 1: Foundation
Vite scaffold, all dependencies, Tailwind + shadcn/ui setup, audio engine with Salamander samples, on-screen piano keyboard, computer keyboard adapter. **Deliverable:** Playable on-screen piano with sampled sounds.

### Phase 2: MIDI + Falling Notes
MIDI input adapter, PixiJS falling notes renderer, game store, hardcoded test song, notes scroll and light up on input. **Deliverable:** Falling notes at 60fps, responsive to MIDI and on-screen input.

### Phase 3: Game Engine + Scoring
Full game loop, note scheduling, input matching with timing grades, practice controls (wait mode, speed, loop), score display, timing feedback popups, game over screen. **Deliverable:** Complete playable game loop with scoring.

### Phase 4: Staff Notation + Hand Guide
SVG staff notation with cursor, hand overlay (progressive levels), finger numbers on notes and keys, emphasis slider between falling notes and notation. **Deliverable:** Dual view + progressive hand guidance.

### Phase 5: Persistence + Auth
Supabase project, Dexie schema, sync engine, auth pages, settings persistence, game results saved. **Deliverable:** Full auth + cross-session progress persistence.

### Phase 6: Curriculum
Module data (4+ complete modules), curriculum store, lesson views with step sequences, skill gates. **Deliverable:** Playable structured learning path.

### Phase 7: Gamification
XP engine, achievements (30+), streaks, dashboard with heatmap + stats, level-up celebrations. **Deliverable:** Full Duolingo-style engagement layer.

### Phase 8: Library + MIDI Import
MIDI parser, song library UI, drag-and-drop import, pre-bundled songs, song preview. **Deliverable:** Free practice on any song.

### Phase 9: Onboarding + Polish
First-run wizard (MIDI setup, latency calibration, skill assessment), settings pages, framer-motion transitions, visual polish. **Deliverable:** Polished end-to-end experience.

### Phase 10: Testing + Launch
Cross-browser QA (Chrome/Edge/Firefox), MIDI keyboard latency testing, 60fps benchmarks, curriculum playtesting, Vercel deployment, Supabase RLS audit. **Deliverable:** Production-ready app.
