import { useState, useEffect, useMemo } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getTropicalFish, COMMON_FISH, TOTAL_FISH } from '../data/fish'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PublicProfileScreen({ targetUser, onClose }) {
  const [progress, setProgress] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(true)

  const tropicalFish = useMemo(() => getTropicalFish(), [])

  useEffect(() => {
    if (!targetUser?.uid) return
    async function fetchProgress() {
      setLoadingProgress(true)
      try {
        const ref = doc(db, 'progress', targetUser.uid)
        const snap = await getDoc(ref)
        setProgress(snap.exists() ? (snap.data().catches ?? {}) : {})
      } catch {
        setProgress({})
      }
      setLoadingProgress(false)
    }
    fetchProgress()
  }, [targetUser?.uid])

  const stats = useMemo(() => {
    if (!progress) return null
    const totalCaught = Object.keys(progress).length
    const pct = Math.round((totalCaught / TOTAL_FISH) * 100)
    const commonCaught = COMMON_FISH.filter((f) => progress[f.id]).length
    const namedCaught = tropicalFish.filter((f) => f.isNamed && progress[f.id]).length
    const allTropicalCaught = tropicalFish.filter((f) => progress[f.id]).length
    return { totalCaught, pct, commonCaught, namedCaught, allTropicalCaught }
  }, [progress, tropicalFish])

  const emailPrefix = targetUser?.email?.split('@')[0] ?? ''

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-mc-card border border-mc-border rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎣</span>
            <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>
              {targetUser?.username ?? 'Player'}
            </span>
          </div>
          <button onClick={onClose} className="text-mc-muted hover:text-mc-text text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-mc-border bg-mc-surface flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-ui font-semibold text-mc-text text-base">
                {targetUser?.username ?? 'Unknown Player'}
              </p>
              <p className="font-ui text-mc-muted text-sm">{emailPrefix}</p>
            </div>
          </div>

          {/* Member since */}
          <p className="font-ui text-mc-muted text-xs">
            Member since {formatDate(targetUser?.joinedAt)}
          </p>

          {/* Stats */}
          {loadingProgress ? (
            <div className="flex items-center justify-center py-6">
              <span className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '8px' }}>
                Loading stats…
              </span>
            </div>
          ) : stats ? (
            <div className="space-y-2">
              <h3 className="font-minecraft text-mc-muted" style={{ fontSize: '8px' }}>
                Progress
              </h3>
              <div className="bg-mc-surface border border-mc-border rounded-lg divide-y divide-mc-border">
                <BreakdownRow
                  label="Total caught"
                  caught={stats.totalCaught}
                  total={TOTAL_FISH}
                />
                <BreakdownRow
                  label="Common fish"
                  caught={stats.commonCaught}
                  total={3}
                />
                <BreakdownRow
                  label="Named tropical"
                  caught={stats.namedCaught}
                  total={22}
                />
                <BreakdownRow
                  label="All tropical"
                  caught={stats.allTropicalCaught}
                  total={3072}
                />
              </div>
            </div>
          ) : null}
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
        <div className="w-20 bg-mc-card rounded-full h-1.5">
          <div className="bg-mc-green h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-ui text-mc-text text-sm w-16 text-right">
          {caught}/{total}
        </span>
      </div>
    </div>
  )
}
