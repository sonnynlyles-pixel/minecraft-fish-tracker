import { useMemo } from 'react'
import { getTropicalFish, TOTAL_FISH } from '../data/fish'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function ProfileScreen({ user, progress, onSignOut, onClose }) {
  const tropicalFish = useMemo(() => getTropicalFish(), [])

  const totalCaught = Object.keys(progress).length
  const pct = Math.round((totalCaught / TOTAL_FISH) * 100)

  const namedCaught = tropicalFish.filter((f) => f.isNamed && progress[f.id]).length

  const allDates = Object.values(progress)
    .map((e) => e.caughtAt)
    .filter(Boolean)
    .sort()
  const firstCatch = allDates[0] || null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-mc-card border border-mc-border rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border">
          <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>Profile</span>
          <button onClick={onClose} className="text-mc-muted hover:text-mc-text text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar + email */}
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-14 h-14 rounded-full border-2 border-mc-green" />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-mc-border bg-mc-surface flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              {user?.displayName && (
                <p className="font-ui font-semibold text-mc-text text-base">{user.displayName}</p>
              )}
              <p className="font-ui text-mc-muted text-sm break-all">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-mc-surface border border-mc-border rounded-lg divide-y divide-mc-border">
            <StatRow label="Fish caught" value={`${totalCaught.toLocaleString()} (${pct}%)`} />
            <StatRow label="Named tropical" value={String(namedCaught)} />
            <StatRow label="First catch" value={formatDate(firstCatch)} />
          </div>

          {/* Sign out */}
          <button
            onClick={() => { onSignOut(); onClose() }}
            className="w-full py-3 rounded-lg font-minecraft text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-colors"
            style={{ fontSize: '9px' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="font-ui text-mc-muted text-sm">{label}</span>
      <span className="font-ui text-mc-text text-sm font-medium">{value}</span>
    </div>
  )
}
