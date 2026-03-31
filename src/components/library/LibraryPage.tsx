import { useCallback, useRef, useState } from 'react'
import { testSong } from '@/data/test-song'
import { parseMidiFile } from '@/lib/midi-parser'
import type { Song } from '@/types/song'
import { cn } from '@/lib/utils'

interface LibraryPageProps {
  onPlaySong: (song: Song) => void
}

const BUILT_IN_SONGS: Song[] = [testSong]

export function LibraryPage({ onPlaySong }: LibraryPageProps) {
  const [importedSongs, setImportedSongs] = useState<Song[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer()
      const song = parseMidiFile(buffer, file.name.replace(/\.midi?$/i, ''))
      setImportedSongs(prev => [...prev, song])
    } catch (err) {
      console.error('Failed to parse MIDI file:', err)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && /\.midi?$/i.test(file.name)) {
      handleImport(file)
    }
  }, [handleImport])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImport(file)
  }, [handleImport])

  const allSongs = [...BUILT_IN_SONGS, ...importedSongs]

  const difficultyLabel = (d: number) => ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'][d] ?? ''
  const difficultyColor = (d: number) => ['', 'text-perfect', 'text-great', 'text-good', 'text-miss', 'text-miss'][d] ?? ''

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Library</h2>

      {/* MIDI import zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
        )}
      >
        <p className="text-sm text-muted-foreground">
          Drop a MIDI file here or click to import
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mid,.midi"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Song list */}
      <div className="space-y-3">
        {allSongs.map(song => (
          <button
            key={song.id}
            onClick={() => onPlaySong(song)}
            className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              {song.title.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{song.title}</p>
              {song.composer && (
                <p className="text-xs text-muted-foreground">{song.composer}</p>
              )}
            </div>
            <div className="text-right">
              <p className={cn('text-xs font-medium', difficultyColor(song.difficulty))}>
                {difficultyLabel(song.difficulty)}
              </p>
              <p className="text-xs text-muted-foreground">{song.bpm} BPM</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
