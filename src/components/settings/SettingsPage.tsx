import { useSettingsStore } from '@/store/settingsStore'

export function SettingsPage() {
  const settings = useSettingsStore()

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Audio */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-sm">Audio</h3>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Master Volume</label>
          <input
            type="range" min="0" max="1" step="0.05"
            value={settings.masterVolume}
            onChange={e => settings.updateSetting('masterVolume', parseFloat(e.target.value))}
            className="w-32 accent-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Latency Offset (ms)</label>
          <input
            type="number"
            value={settings.latencyOffset}
            onChange={e => settings.updateSetting('latencyOffset', parseInt(e.target.value) || 0)}
            className="w-20 bg-input text-foreground border border-border rounded px-2 py-1 text-sm"
          />
        </div>
      </section>

      {/* Display */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-sm">Display</h3>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Hand Guide</label>
          <select
            value={settings.handGuideLevel}
            onChange={e => settings.updateSetting('handGuideLevel', e.target.value as 'full' | 'fingers' | 'off' | 'auto')}
            className="bg-input text-foreground border border-border rounded px-2 py-1 text-sm"
          >
            <option value="auto">Auto</option>
            <option value="full">Full Overlay</option>
            <option value="fingers">Finger Numbers</option>
            <option value="off">Off</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Show Finger Numbers</label>
          <input
            type="checkbox"
            checked={settings.showFingerNumbers}
            onChange={e => settings.updateSetting('showFingerNumbers', e.target.checked)}
            className="accent-primary"
          />
        </div>
      </section>

      {/* Gameplay */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-sm">Gameplay</h3>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Default Speed</label>
          <select
            value={settings.defaultSpeed}
            onChange={e => settings.updateSetting('defaultSpeed', parseFloat(e.target.value))}
            className="bg-input text-foreground border border-border rounded px-2 py-1 text-sm"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Daily Goal (minutes)</label>
          <input
            type="number" min="5" max="120" step="5"
            value={settings.dailyGoalMinutes}
            onChange={e => settings.updateSetting('dailyGoalMinutes', parseInt(e.target.value) || 15)}
            className="w-20 bg-input text-foreground border border-border rounded px-2 py-1 text-sm"
          />
        </div>
      </section>
    </div>
  )
}
