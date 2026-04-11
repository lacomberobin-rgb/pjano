import { useCallback, useEffect, useRef, useState } from 'react'
import { testSong } from '@/data/test-song'
import { parseMidiFile } from '@/lib/midi-parser'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import type { Song } from '@/types/song'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Upload, Play, Trash2, Clock, Star, Search, FileMusic } from 'lucide-react'

interface LibraryPageProps {
  onPlaySong: (song: Song) => void
}

const BUILT_IN_SONGS: Song[] = [testSong]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function LibraryPage({ onPlaySong }: LibraryPageProps) {
  const [dragOver, setDragOver] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load imported songs from IndexedDB
  const importedSongsData = useLiveQuery(() => db.importedSongs.toArray()) || []
  const [importedSongs, setImportedSongs] = useState<Song[]>([])

  useEffect(() => {
    if (importedSongsData) {
      const songs: Song[] = importedSongsData.map(d => JSON.parse(d.songData))
      setImportedSongs(songs)
    }
  }, [importedSongsData])

  const handleImport = useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer()
      const song = parseMidiFile(buffer, file.name.replace(/\.midi?$/i, ''))
      
      // Save to IndexedDB
      await db.importedSongs.add({
        title: song.title,
        difficulty: song.difficulty,
        bpm: song.bpm,
        duration: song.duration,
        songData: JSON.stringify(song),
        importedAt: new Date(),
        playCount: 0
      })
    } catch (err) {
      console.error('Failed to parse MIDI file:', err)
    }
  }, [])

  const handleDelete = useCallback(async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation()
    const found = importedSongsData.find(d => JSON.parse(d.songData).id === songId)
    if (found?.id) {
      await db.importedSongs.delete(found.id)
    }
  }, [importedSongsData])

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
  const filteredSongs = allSongs.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.composer?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const difficultyLabel = (d: number) => ['', 'Débutant', 'Facile', 'Intermédiaire', 'Difficile', 'Expert'][d] ?? ''
  const difficultyColor = (d: number) => ['', 'text-perfect', 'text-perfect', 'text-great', 'text-good', 'text-miss'][d] ?? ''

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 max-w-4xl mx-auto space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h2 variants={item} className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Music className="text-primary" size={32} />
            Bibliothèque
          </motion.h2>
          <motion.p variants={item} className="text-muted-foreground font-medium">
            Tes morceaux favoris et tes imports personnels.
          </motion.p>
        </div>

        <motion.div variants={item} className="relative group flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Rechercher un morceau..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </motion.div>
      </header>

      {/* MIDI import zone */}
      <motion.div
        variants={item}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative overflow-hidden border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all group',
          dragOver 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-border bg-card/50 hover:border-primary/40 hover:bg-primary/5',
        )}
      >
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
            <Upload size={32} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">Importer un fichier MIDI</p>
            <p className="text-sm text-muted-foreground font-medium">
              Glisse-dépose ton fichier ou clique pour parcourir
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mid,.midi"
          className="hidden"
          onChange={handleFileSelect}
        />
        {/* Decorative background element */}
        <div className="absolute -bottom-12 -right-12 opacity-5 group-hover:opacity-10 transition-opacity">
          <FileMusic size={160} />
        </div>
      </motion.div>

      {/* Song list */}
      <div className="space-y-4">
        <h3 className="text-xl font-black flex items-center gap-2 px-2">
          <FileMusic size={20} className="text-accent" />
          Mes Morceaux
        </h3>
        
        <AnimatePresence mode="popLayout">
          {filteredSongs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-muted-foreground"
            >
              <p className="font-medium italic">Aucun morceau trouvé...</p>
            </motion.div>
          ) : (
            filteredSongs.map((song, idx) => {
              const isImported = importedSongs.some(s => s.id === song.id)
              return (
                <motion.div
                  layout
                  key={song.id}
                  variants={item}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileHover={{ x: 10 }}
                  className="group relative flex items-center gap-5 p-5 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all shadow-xl cursor-pointer"
                  onClick={() => onPlaySong(song)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner group-hover:from-primary group-hover:to-accent group-hover:text-white transition-all">
                    {song.title.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-lg truncate tracking-tight">{song.title}</p>
                      {isImported && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/20">
                          Importé
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      {song.composer && (
                        <p className="flex items-center gap-1"><Star size={12} /> {song.composer}</p>
                      )}
                      <p className="flex items-center gap-1"><Clock size={12} /> {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className={cn('text-xs font-black uppercase tracking-widest', difficultyColor(song.difficulty))}>
                      {difficultyLabel(song.difficulty)}
                    </p>
                    <p className="text-xs font-black text-muted-foreground tabular-nums">{song.bpm} BPM</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <Play size={18} fill="currentColor" />
                    </motion.div>
                    
                    {isImported && (
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDelete(e, song.id)}
                        className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
