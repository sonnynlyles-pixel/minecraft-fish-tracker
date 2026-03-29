import FishSprite from './FishSprite'

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function FishCard({ fish, entry, onToggle, onOpenModal }) {
  const caught = !!entry

  return (
    <div
      className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer select-none
        ${caught
          ? 'bg-mc-card border-mc-green/40 shadow-sm'
          : 'bg-mc-card border-mc-border opacity-70 hover:opacity-100'
        }`}
      onClick={() => onOpenModal(fish)}
    >
      {/* Sprite */}
      <div className="shrink-0">
        <FishSprite fish={fish} size={44} locked={!caught} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-ui font-medium text-sm truncate ${caught ? 'text-mc-text' : 'text-mc-muted'}`}>
            {fish.name}
          </span>
          {fish.isNamed && (
            <span className="shrink-0 text-xs bg-mc-gold/20 text-mc-gold border border-mc-gold/30 rounded px-1 py-0.5 leading-none font-ui">
              Named
            </span>
          )}
        </div>
        {fish.category === 'tropical' && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-3 h-3 rounded-sm border border-white/10 shrink-0"
              style={{ backgroundColor: fish.bodyColorHex }}
              title={`Body: ${fish.bodyColorName}`}
            />
            <span
              className="w-3 h-3 rounded-sm border border-white/10 shrink-0"
              style={{ backgroundColor: fish.patternColorHex }}
              title={`Pattern: ${fish.patternColorName}`}
            />
            <span className="font-ui text-mc-muted text-xs truncate">
              {fish.sizeName} · {fish.patternName}
            </span>
          </div>
        )}
        {caught && entry.caughtAt && (
          <p className="font-ui text-mc-green text-xs mt-0.5">
            ✓ {formatDate(entry.caughtAt)}
            {entry.notes && ' · 📝'}
          </p>
        )}
      </div>

      {/* Checkbox */}
      <button
        className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all
          ${caught ? 'bg-mc-green border-mc-green' : 'border-mc-border hover:border-mc-green'}`}
        onClick={(e) => { e.stopPropagation(); onToggle(fish) }}
        aria-label={caught ? 'Unmark as caught' : 'Mark as caught'}
      >
        {caught && <span className="text-mc-bg text-xs font-bold">✓</span>}
      </button>
    </div>
  )
}
