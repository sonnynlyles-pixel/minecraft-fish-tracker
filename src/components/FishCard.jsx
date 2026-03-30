import { useState } from 'react'
import FishSprite from './FishSprite'
import { useHaptic } from '../hooks/useHaptic'

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function FishCard({ fish, entry, onToggle, onOpenModal }) {
  const caught = !!entry
  const [justCaught, setJustCaught] = useState(false)
  const [checkAnim, setCheckAnim] = useState(false)
  const { trigger } = useHaptic()

  async function handleCheck(e) {
    e.stopPropagation()
    trigger('light')
    if (!caught) {
      // About to catch — trigger animation
      setJustCaught(true)
      setCheckAnim(true)
      setTimeout(() => setCheckAnim(false), 400)
      setTimeout(() => setJustCaught(false), 1000)
    }
    await onToggle(fish)
  }

  return (
    <div
      className={`relative flex items-center gap-3 p-3 cursor-pointer select-none transition-all duration-150
        ${justCaught ? 'animate-card-bounce animate-green-glow' : ''}`}
      style={{
        background: 'rgba(0,0,0,0.80)',
        border: caught ? '2px solid #55FF55' : '2px solid #444444',
        borderLeft: caught ? '3px solid #55FF55' : '3px solid #444444',
        borderBottom: caught ? '2px solid #222222' : '2px solid #222222',
        borderRight: caught ? '2px solid #222222' : '2px solid #222222',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
        opacity: caught ? 1 : 0.7,
        borderRadius: '2px',
      }}
      onMouseEnter={(e) => { if (!caught) e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { if (!caught) e.currentTarget.style.opacity = '0.7' }}
      onClick={() => onOpenModal(fish)}
    >
      {/* Sprite */}
      <div className="shrink-0">
        <FishSprite fish={fish} size={44} locked={!caught} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="font-ui font-medium text-sm truncate"
            style={{
              color: caught ? '#FFFFFF' : '#AAAAAA',
              textShadow: '1px 1px #000',
            }}
          >
            {fish.name}
          </span>
          {fish.isNamed && (
            <span
              className="shrink-0 text-xs px-1 py-0.5 leading-none font-minecraft"
              style={{
                fontSize: '6px',
                background: 'rgba(255,170,0,0.2)',
                color: '#FFAA00',
                border: '1px solid rgba(255,170,0,0.4)',
                borderRadius: '2px',
                textShadow: '1px 1px #000',
              }}
            >
              Named
            </span>
          )}
        </div>
        {fish.category === 'tropical' && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-3 h-3 shrink-0"
              style={{
                backgroundColor: fish.bodyColorHex,
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '1px',
              }}
              title={`Body: ${fish.bodyColorName}`}
            />
            <span
              className="w-3 h-3 shrink-0"
              style={{
                backgroundColor: fish.patternColorHex,
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '1px',
              }}
              title={`Pattern: ${fish.patternColorName}`}
            />
            <span className="font-ui text-mc-muted text-xs truncate" style={{ textShadow: '1px 1px #000' }}>
              {fish.sizeName} · {fish.patternName}
            </span>
          </div>
        )}
        {caught && entry.caughtAt && (
          <p className="font-ui text-xs mt-0.5" style={{ color: '#55FF55', textShadow: '1px 1px #000' }}>
            ✓ {formatDate(entry.caughtAt)}
            {entry.notes && ' · 📝'}
          </p>
        )}
      </div>

      {/* Checkbox — Minecraft style */}
      <button
        className={`shrink-0 w-6 h-6 flex items-center justify-center transition-all ${checkAnim ? 'animate-check-pop' : ''}`}
        style={{
          background: caught ? '#55FF55' : 'transparent',
          border: caught ? '2px solid #2D7A2D' : '2px solid #555555',
          borderRadius: '1px',
        }}
        onClick={handleCheck}
        aria-label={caught ? 'Unmark as caught' : 'Mark as caught'}
      >
        {caught && (
          <span style={{ color: '#0a0a0a', fontSize: '10px', fontWeight: 'bold', lineHeight: 1 }}>✓</span>
        )}
      </button>
    </div>
  )
}
