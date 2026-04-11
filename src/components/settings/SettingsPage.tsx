import { useSettingsStore, type KeyboardSize } from '@/store/settingsStore'
import { motion } from 'framer-motion'
import { Settings, Volume2, Monitor, Play, Piano } from 'lucide-react'

export function SettingsPage() {
  const settings = useSettingsStore()

  const handleKeyboardSizeChange = (val: string) => {
    const size = val === 'auto' ? 'auto' : parseInt(val, 10) as KeyboardSize
    settings.updateSetting('keyboardSize', size)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-2xl mx-auto space-y-8"
    >
      <header className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
          <Settings size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-black">Réglages</h2>
          <p className="text-muted-foreground font-medium">Personnalise ton expérience d'apprentissage.</p>
        </div>
      </header>

      {/* Audio */}
      <section className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xl">
        <h3 className="font-black text-lg flex items-center gap-2 text-accent">
          <Volume2 size={20} /> Audio
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-muted-foreground">Volume Principal</label>
            <input
              type="range" min="0" max="1" step="0.05"
              value={settings.masterVolume}
              onChange={e => settings.updateSetting('masterVolume', parseFloat(e.target.value))}
              className="w-48 accent-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-muted-foreground">Latence (ms)</label>
            <input
              type="number"
              value={settings.latencyOffset}
              onChange={e => settings.updateSetting('latencyOffset', parseInt(e.target.value) || 0)}
              className="w-24 bg-background text-foreground border border-border rounded-xl px-3 py-2 text-sm font-black focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </section>

      {/* Display & Hardware */}
      <section className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xl">
        <h3 className="font-black text-lg flex items-center gap-2 text-primary">
          <Monitor size={20} /> Affichage & Clavier
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                <Piano size={16} /> Taille du Clavier (Alignement 1:1)
              </label>
              <select
                value={settings.keyboardSize}
                onChange={e => handleKeyboardSizeChange(e.target.value)}
                className="bg-background text-foreground border border-border rounded-xl px-3 py-2 text-sm font-black focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="auto">Auto (Dynamique)</option>
                <option value="25">25 Touches</option>
                <option value="37">37 Touches</option>
                <option value="49">49 Touches</option>
                <option value="61">61 Touches</option>
                <option value="88">88 Touches</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground font-medium opacity-70">
              Définit la taille physique de ton clavier pour que les notes à l'écran s'alignent parfaitement avec tes touches (effet Guitar Hero).
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <label className="text-sm font-bold text-muted-foreground">Guide des Mains</label>
            <select
              value={settings.handGuideLevel}
              onChange={e => settings.updateSetting('handGuideLevel', e.target.value as any)}
              className="bg-background text-foreground border border-border rounded-xl px-3 py-2 text-sm font-black focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="auto">Auto</option>
              <option value="full">Complet</option>
              <option value="fingers">Numéros de doigts</option>
              <option value="off">Désactivé</option>
            </select>
          </div>
        </div>
      </section>

      {/* Gameplay */}
      <section className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-xl">
        <h3 className="font-black text-lg flex items-center gap-2 text-perfect">
          <Play size={20} /> Jouabilité
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-muted-foreground">Vitesse par défaut</label>
            <select
              value={settings.defaultSpeed}
              onChange={e => settings.updateSetting('defaultSpeed', parseFloat(e.target.value))}
              className="bg-background text-foreground border border-border rounded-xl px-3 py-2 text-sm font-black focus:ring-2 focus:ring-perfect outline-none"
            >
              <option value="0.5">0.5x (Très lent)</option>
              <option value="0.75">0.75x (Lent)</option>
              <option value="1">1x (Normal)</option>
              <option value="1.25">1.25x (Rapide)</option>
              <option value="1.5">1.5x (Expert)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-muted-foreground">Objectif Quotidien (min)</label>
            <input
              type="number" min="5" max="120" step="5"
              value={settings.dailyGoalMinutes}
              onChange={e => settings.updateSetting('dailyGoalMinutes', parseInt(e.target.value) || 15)}
              className="w-24 bg-background text-foreground border border-border rounded-xl px-3 py-2 text-sm font-black focus:ring-2 focus:ring-perfect outline-none"
            />
          </div>
        </div>
      </section>
    </motion.div>
  )
}
