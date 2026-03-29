# pjano

Learn piano by doing — Guitar Hero meets real pedagogy.

A web app that teaches piano through falling notes gameplay combined with proper music education. Unlike apps that are purely gamified (Synthesia) or purely academic, pjano delivers both: engaging gameplay AND a real learning path with hand positioning, sight reading, and progressive curriculum.

## Features

- **Dual view** — Falling notes (Guitar Hero-style) + staff notation side by side
- **Multiple inputs** — MIDI keyboard, on-screen piano, or computer keyboard
- **Sampled piano** — Salamander Grand Piano for realistic sound
- **Progressive hand guide** — Animated overlay for beginners, fading as skills develop
- **Structured curriculum** — Notes → scales → chords → songs with skill gates
- **Practice mode** — Slow down, loop sections, wait mode, speed ramp
- **Gamification** — XP, levels, streaks, achievements (Duolingo-style)
- **Timing + accuracy scoring** — Perfect / Great / Good / Miss with visual feedback

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Rendering:** PixiJS 8 (WebGL falling notes at 60fps)
- **Audio:** Tone.js + Salamander Grand Piano samples
- **Input:** Web MIDI API (via WEBMIDI.js) + on-screen + QWERTY keyboard
- **State:** Zustand
- **Storage:** Dexie.js (local IndexedDB) + Supabase (auth & cloud sync)
- **Hosting:** Cloudflare Pages

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome, Edge, or Firefox.

### Connect a MIDI keyboard

Plug in any USB MIDI keyboard — it's auto-detected via the Web MIDI API. No drivers needed on Chrome/Edge/Firefox.

> **Note:** Safari does not support the Web MIDI API.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript strict check |
| `npm run lint` | ESLint |

## Browser Support

| Browser | MIDI | Audio | Status |
|---------|------|-------|--------|
| Chrome | Yes | Yes | **Fully supported** |
| Edge | Yes | Yes | **Fully supported** |
| Firefox | Yes | Yes | **Fully supported** |
| Safari | No | Yes | Audio only, no MIDI |

## License

MIT
