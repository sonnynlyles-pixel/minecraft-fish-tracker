import { useState, useEffect, useMemo } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { COMMON_FISH, getTropicalFish, TOTAL_FISH } from '../data/fish'
import FishSprite from './FishSprite'

const PAGE_SIZE = 50

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ReadOnlyFishCard({ fish, entry }) {
  const caught = !!entry
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-150
        ${caught ? 'bg-mc-card border-mc-green/40' : 'bg-mc-card border-mc-border opacity-60'}`}
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
            />
            <span
              className="w-3 h-3 rounded-sm border border-white/10 shrink-0"
              style={{ backgroundColor: fish.patternColorHex }}
            />
            <span className="font-ui text-mc-muted text-xs truncate">
              {fish.sizeName} · {fish.patternName}
            </span>
          </div>
        )}
        {caught && entry.caughtAt && (
          <p className="font-ui text-mc-green text-xs mt-0.5">
            ✓ {formatDate(entry.caughtAt)}
          </p>
        )}
      </div>

      {/* Status indicator */}
      <div
        className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center
          ${caught ? 'bg-mc-green border-mc-green' : 'border-mc-border'}`}
      >
        {caught && <span className="text-mc-bg text-xs font-bold">✓</span>}
      </div>
    </div>
  )
}

export default function FriendDetailScreen({ friend, onClose }) {
  const [progress, setProgress] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const tropicalFish = useMemo(() => getTropicalFish(), [])
  const allFish = useMemo(() => [
    ...COMMON_FISH,
    ...tropicalFish,
  ], [tropicalFish])

  useEffect(() => {
    if (!friend?.uid) return
    async function fetchProgress() {
      setLoadingProgress(true)
      try {
        const ref = doc(db, 'progress', friend.uid)
        const snap = await getDoc(ref)
        setProgress(snap.exists() ? (snap.data().catches ?? {}) : {})
      } catch {
        setProgress({})
      }
      setLoadingProgress(false)
    }
    fetchProgress()
  }, [friend?.uid])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, statusFilter, categoryFilter])

  const filteredFish = useMemo(() => {
    if (!progress) return []
    return allFish.filter((fish) => {
      // Category filter
      if (categoryFilter === 'common' && fish.category !== 'common') return false
      if (categoryFilter === 'tropical' && fish.category !== 'tropical') return false

      // Status filter
      const caught = !!progress[fish.id]
      if (statusFilter === 'caught' && !caught) return false
      if (statusFilter === 'uncaught' && caught) return false

      // Search filter
      if (search.trim()) {
        const term = search.toLowerCase()
        if (!fish.name.toLowerCase().includes(term)) return false
      }

      return true
    })
  }, [allFish, progress, search, statusFilter, categoryFilter])

  const visibleFish = filteredFish.slice(0, visibleCount)
  const totalCaught = progress ? Object.keys(progress).length : 0
  const pct = Math.round((totalCaught / TOTAL_FISH) * 100)

  return (
    <div className="fixed inset-0 bg-mc-bg flex flex-col" style={{ zIndex: 60 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-mc-border bg-mc-card flex-shrink-0">
        <button
          onClick={onClose}
          className="text-mc-muted hover:text-mc-text transition-colors p-1 -ml-1"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <span className="font-minecraft text-mc-green block truncate" style={{ fontSize: '9px' }}>
            {friend?.username}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 max-w-32 bg-mc-surface rounded-full h-1.5 border border-mc-border">
              <div className="bg-mc-green h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-ui text-mc-muted text-xs">
              {totalCaught.toLocaleString()} / {TOTAL_FISH.toLocaleString()} ({pct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-3 border-b border-mc-border bg-mc-card flex-shrink-0 space-y-2">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fish by name…"
          className="w-full bg-mc-surface border border-mc-border rounded-lg px-3 py-2 font-ui text-sm text-mc-text placeholder:text-mc-muted focus:outline-none focus:border-mc-green/60 transition-colors"
        />
        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {/* Status */}
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'caught', label: 'Caught' },
              { id: 'uncaught', label: 'Not Caught' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2.5 py-1 rounded-full font-ui text-xs transition-colors ${
                  statusFilter === s.id
                    ? 'bg-mc-green text-mc-bg font-semibold'
                    : 'bg-mc-surface text-mc-muted border border-mc-border'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Category */}
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'common', label: 'Common' },
              { id: 'tropical', label: 'Tropical' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-2.5 py-1 rounded-full font-ui text-xs transition-colors ${
                  categoryFilter === c.id
                    ? 'bg-mc-green text-mc-bg font-semibold'
                    : 'bg-mc-surface text-mc-muted border border-mc-border'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fish list */}
      <div className="flex-1 overflow-y-auto">
        {loadingProgress ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '8px' }}>
              Loading progress…
            </span>
          </div>
        ) : (
          <div className="p-4 space-y-2 max-w-2xl mx-auto">
            {filteredFish.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="font-ui text-mc-muted text-sm text-center">No fish match your filters</p>
              </div>
            ) : (
              <>
                <p className="font-ui text-mc-muted text-xs mb-2">
                  Showing {Math.min(visibleCount, filteredFish.length).toLocaleString()} of {filteredFish.length.toLocaleString()} fish
                </p>
                {visibleFish.map((fish) => (
                  <ReadOnlyFishCard
                    key={fish.id}
                    fish={fish}
                    entry={progress?.[fish.id]}
                  />
                ))}
                {visibleCount < filteredFish.length && (
                  <button
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="w-full py-3 font-ui text-mc-green text-sm border border-mc-green/40 rounded-lg hover:bg-mc-green/10 transition-colors mt-2"
                  >
                    Load more ({filteredFish.length - visibleCount} remaining)
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
