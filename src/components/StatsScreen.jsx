import { useMemo } from 'react'
import { COMMON_FISH, getTropicalFish, TOTAL_FISH } from '../data/fish'

function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export default function StatsScreen({ progress, onClose }) {
  const tropicalFish = useMemo(() => getTropicalFish(), [])

  const allEntries = Object.entries(progress) // [id, entry]

  const totalCaught = allEntries.length
  const pct = Math.round((totalCaught / TOTAL_FISH) * 100)

  const commonCaught = COMMON_FISH.filter((f) => progress[f.id]).length

  const namedTropical = tropicalFish.filter((f) => f.isNamed)
  const namedCaught = namedTropical.filter((f) => progress[f.id]).length

  const allTropicalCaught = tropicalFish.filter((f) => progress[f.id]).length

  // Last named fish caught
  const namedEntries = namedTropical
    .filter((f) => progress[f.id])
    .map((f) => ({ fish: f, entry: progress[f.id] }))
    .sort((a, b) => new Date(b.entry.caughtAt) - new Date(a.entry.caughtAt))
  const rarestCatch = namedEntries[0] || null

  // Recent catches — last 5 by date
  const recentCatches = allEntries
    .map(([id, entry]) => {
      const common = COMMON_FISH.find((f) => f.id === id)
      if (common) return { name: common.name, entry }
      const trop = tropicalFish.find((f) => f.id === id)
      if (trop) return { name: trop.name, entry }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.entry.caughtAt) - new Date(a.entry.caughtAt))
    .slice(0, 5)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-mc-card border border-mc-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>Statistics</span>
          </div>
          <button onClick={onClose} className="text-mc-muted hover:text-mc-text text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Big percentage */}
          <div className="text-center py-4">
            <div className="font-minecraft text-mc-green" style={{ fontSize: '36px' }}>{pct}%</div>
            <div className="font-ui text-mc-muted text-sm mt-1">
              {totalCaught.toLocaleString()} / {TOTAL_FISH.toLocaleString()} fish caught
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            <h3 className="font-minecraft text-mc-muted" style={{ fontSize: '8px' }}>Breakdown</h3>
            <div className="bg-mc-surface border border-mc-border rounded-lg divide-y divide-mc-border">
              <BreakdownRow label="Common fish" caught={commonCaught} total={COMMON_FISH.length} />
              <BreakdownRow label="Named tropical" caught={namedCaught} total={22} />
              <BreakdownRow label="All tropical" caught={allTropicalCaught} total={3072} />
            </div>
          </div>

          {/* Rarest catch */}
          {rarestCatch && (
            <div className="space-y-2">
              <h3 className="font-minecraft text-mc-muted" style={{ fontSize: '8px' }}>Rarest catch</h3>
              <div className="bg-mc-surface border border-mc-gold/30 rounded-lg p-3 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-ui text-mc-gold font-semibold text-sm">{rarestCatch.fish.name}</p>
                  <p className="font-ui text-mc-muted text-xs">{formatDateTime(rarestCatch.entry.caughtAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent catches */}
          {recentCatches.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-minecraft text-mc-muted" style={{ fontSize: '8px' }}>Recent catches</h3>
              <div className="bg-mc-surface border border-mc-border rounded-lg divide-y divide-mc-border">
                {recentCatches.map(({ name, entry }, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <span className="font-ui text-mc-text text-sm truncate max-w-[60%]">{name}</span>
                    <span className="font-ui text-mc-muted text-xs">{formatDateTime(entry.caughtAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalCaught === 0 && (
            <p className="text-center font-ui text-mc-muted text-sm py-4">No fish caught yet. Get fishing!</p>
          )}
        </div>
      </div>
    </div>
  )
}

function BreakdownRow({ label, caught, total }) {
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="font-ui text-mc-muted text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-24 bg-mc-card rounded-full h-1.5">
          <div className="bg-mc-green h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-ui text-mc-text text-sm w-16 text-right">
          {caught}/{total}
        </span>
      </div>
    </div>
  )
}
