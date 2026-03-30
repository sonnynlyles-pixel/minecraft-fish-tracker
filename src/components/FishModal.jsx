import { useState, useEffect } from 'react'
import FishSprite from './FishSprite'

function formatDateTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

const panelStyle = {
  background: 'rgba(0,0,0,0.90)',
  border: '2px solid #555555',
  borderBottom: '2px solid #222222',
  borderRight: '2px solid #222222',
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
  borderRadius: '2px',
}

const innerPanelStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #555555',
  borderBottom: '1px solid #222222',
  borderRight: '1px solid #222222',
  borderRadius: '1px',
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-md" style={panelStyle}>
        {/* Header */}
        <div
          className="flex items-center gap-4 p-5"
          style={{ borderBottom: '2px solid #333333' }}
        >
          <FishSprite fish={fish} size={56} locked={!caught} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className="font-ui font-semibold text-base"
                style={{ color: '#FFFFFF', textShadow: '1px 1px #000' }}
              >
                {fish.name}
              </h2>
              {fish.isNamed && (
                <span
                  className="text-xs px-1.5 py-0.5 font-ui"
                  style={{
                    background: 'rgba(255,170,0,0.2)',
                    color: '#FFAA00',
                    border: '1px solid rgba(255,170,0,0.4)',
                    borderRadius: '1px',
                    textShadow: '1px 1px #000',
                  }}
                >
                  Named
                </span>
              )}
            </div>
            {fish.category === 'tropical' && (
              <p className="font-ui text-xs mt-0.5" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
                {fish.sizeName} · {fish.patternName}
              </p>
            )}
            {caught && entry.caughtAt && (
              <p className="font-ui text-xs mt-1" style={{ color: '#55FF55', textShadow: '1px 1px #000' }}>
                Caught {formatDateTime(entry.caughtAt)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none"
            style={{ color: '#AAAAAA', background: 'none', border: 'none', cursor: 'pointer', textShadow: '1px 1px #000' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Color swatches for tropical */}
          {fish.category === 'tropical' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Body color', value: fish.bodyColorName, hex: fish.bodyColorHex },
                { label: 'Pattern color', value: fish.patternColorName, hex: fish.patternColorHex },
                { label: 'Size', value: fish.sizeName, hex: null },
                { label: 'Pattern', value: fish.patternName, hex: null },
              ].map(({ label, value, hex }) => (
                <div key={label} className="flex items-center gap-2 p-2.5" style={innerPanelStyle}>
                  {hex && (
                    <span
                      className="w-6 h-6 shrink-0"
                      style={{
                        backgroundColor: hex,
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                  <div>
                    <p className="font-ui text-xs leading-tight" style={{ color: '#AAAAAA' }}>{label}</p>
                    <p className="font-ui text-sm font-medium" style={{ color: '#FFFFFF', textShadow: '1px 1px #000' }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How to find — locations */}
          {fish.locations && fish.locations.length > 0 && (
            <div>
              <p className="font-ui text-xs mb-1.5" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
                How to find
              </p>
              <div className="flex flex-wrap gap-1.5">
                {fish.locations.map((loc, i) => (
                  <span
                    key={i}
                    className="text-xs font-ui px-2.5 py-0.5"
                    style={{
                      background: 'rgba(85,255,85,0.1)',
                      color: '#55FF55',
                      border: '1px solid #55FF55',
                      borderRadius: '1px',
                      textShadow: '1px 1px #000',
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="font-ui text-xs mb-1.5 block" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
              Notes {!caught && <span style={{ color: '#AAAAAA' }}>(catch first to add notes)</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesSave}
              disabled={!caught}
              placeholder="Where did you catch it? Which biome?"
              rows={3}
              className="w-full font-ui text-sm resize-none focus:outline-none transition-colors"
              style={{
                background: '#1a1a1a',
                border: '2px solid #555555',
                borderBottom: '2px solid #222222',
                borderRight: '2px solid #222222',
                borderRadius: '1px',
                padding: '12px',
                color: '#FFFFFF',
                opacity: caught ? 1 : 0.4,
              }}
            />
          </div>

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            className={`w-full py-3 font-minecraft ${caught ? 'mc-btn mc-btn-red' : 'mc-btn mc-btn-green'}`}
            style={{ fontSize: '8px', width: '100%' }}
          >
            {caught ? '✕  Mark as Not Caught' : '✓  Mark as Caught'}
          </button>
        </div>
      </div>
    </div>
  )
}
