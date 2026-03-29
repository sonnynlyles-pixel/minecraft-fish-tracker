import { useState, useEffect } from 'react'
import FishSprite from './FishSprite'

function formatDateTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export default function FishModal({ fish, entry, onClose, onToggle, onSaveNotes }) {
  const [notes, setNotes] = useState(entry?.notes ?? '')
  const caught = !!entry

  useEffect(() => {
    setNotes(entry?.notes ?? '')
  }, [fish, entry])

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleToggle() {
    await onToggle(fish)
    if (caught) onClose()
  }

  async function handleNotesSave() {
    if (!caught) return
    await onSaveNotes(fish.id, notes)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-mc-card border border-mc-border rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-mc-border">
          <FishSprite fish={fish} size={56} locked={!caught} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-ui font-semibold text-mc-text text-base">{fish.name}</h2>
              {fish.isNamed && (
                <span className="text-xs bg-mc-gold/20 text-mc-gold border border-mc-gold/30 rounded px-1.5 py-0.5 font-ui">
                  Named
                </span>
              )}
            </div>
            {fish.category === 'tropical' && (
              <p className="font-ui text-mc-muted text-xs mt-0.5">
                {fish.sizeName} · {fish.patternName} · {fish.bodyColorName} / {fish.patternColorName}
              </p>
            )}
            {caught && entry.caughtAt && (
              <p className="font-ui text-mc-green text-xs mt-1">
                Caught {formatDateTime(entry.caughtAt)}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-mc-muted hover:text-mc-text text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Color swatches for tropical */}
          {fish.category === 'tropical' && (
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded border border-white/20"
                  style={{ backgroundColor: fish.bodyColorHex }}
                />
                <span className="font-ui text-mc-muted text-xs">Body: {fish.bodyColorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded border border-white/20"
                  style={{ backgroundColor: fish.patternColorHex }}
                />
                <span className="font-ui text-mc-muted text-xs">Pattern: {fish.patternColorName}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="font-ui text-mc-muted text-xs mb-1.5 block">
              Notes {!caught && <span className="text-mc-muted">(catch first to add notes)</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesSave}
              disabled={!caught}
              placeholder="Where did you catch it? Which biome?"
              rows={3}
              className="w-full bg-mc-surface border border-mc-border rounded-lg p-3 font-ui text-sm text-mc-text placeholder:text-mc-muted/50 resize-none focus:outline-none focus:border-mc-green disabled:opacity-40 transition-colors"
            />
          </div>

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            className={`w-full py-3 rounded-lg font-minecraft transition-all active:scale-95
              ${caught
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                : 'bg-mc-green text-mc-bg hover:bg-green-400 shadow-mc'
              }`}
            style={{ fontSize: '9px' }}
          >
            {caught ? '✕  Mark as Not Caught' : '✓  Mark as Caught'}
          </button>
        </div>
      </div>
    </div>
  )
}
