import { useState, useMemo } from 'react'
import FishCard from './FishCard'
import FilterBar, { DEFAULT_FILTERS } from './FilterBar'

const PAGE_SIZE = 50

const SORT_OPTIONS = [
  { value: 'default',  label: 'Default' },
  { value: 'name',     label: 'Name A–Z' },
  { value: 'recent',   label: 'Recently caught' },
  { value: 'uncaught', label: 'Uncaught first' },
]

export default function CategorySection({ title, icon, fish, progress, onToggle, onOpenModal, showFilters }) {
  const [open, setOpen] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    const s = filters.search.toLowerCase()
    return fish.filter((f) => {
      if (s && !f.name.toLowerCase().includes(s)
           && !f.bodyColorName?.toLowerCase().includes(s)
           && !f.patternColorName?.toLowerCase().includes(s)
           && !f.patternName?.toLowerCase().includes(s)) return false
      if (filters.size !== '' && f.size !== undefined && String(f.size) !== filters.size) return false
      if (filters.pattern !== '' && f.pattern !== undefined && String(f.pattern) !== filters.pattern) return false
      if (filters.bodyColor !== '' && f.bodyColor !== undefined && String(f.bodyColor) !== filters.bodyColor) return false
      if (filters.patternColor !== '' && f.patternColor !== undefined && String(f.patternColor) !== filters.patternColor) return false
      if (filters.status === 'caught' && !progress[f.id]) return false
      if (filters.status === 'uncaught' && progress[f.id]) return false
      if (filters.status === 'named' && !f.isNamed) return false
      return true
    })
  }, [fish, filters, progress])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'name') {
      arr.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'recent') {
      arr.sort((a, b) => {
        const aDate = progress[a.id]?.caughtAt || null
        const bDate = progress[b.id]?.caughtAt || null
        if (aDate && bDate) return new Date(bDate) - new Date(aDate)
        if (aDate) return -1
        if (bDate) return 1
        return 0
      })
    } else if (sort === 'uncaught') {
      arr.sort((a, b) => {
        const aCaught = !!progress[a.id]
        const bCaught = !!progress[b.id]
        if (!aCaught && bCaught) return -1
        if (aCaught && !bCaught) return 1
        return 0
      })
    }
    return arr
  }, [filtered, sort, progress])

  const paginated = sorted.slice(0, page * PAGE_SIZE)
  const caught = fish.filter((f) => progress[f.id]).length
  const pct = Math.round((caught / fish.length) * 100)

  function handleFiltersChange(newFilters) {
    setFilters(newFilters)
    setPage(1)
  }

  function handleSortChange(val) {
    setSort(val)
    setPage(1)
  }

  return (
    <section className="mb-6">
      {/* Section header */}
      <button
        className="w-full flex items-center justify-between p-4 bg-mc-card border border-mc-border rounded-xl mb-2 hover:border-mc-green/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div className="text-left">
            <h2 className="font-minecraft text-mc-text" style={{ fontSize: '9px' }}>{title}</h2>
            <p className="font-ui text-mc-muted text-xs mt-0.5">
              {caught} / {fish.length} caught · {pct}%
            </p>
          </div>
        </div>
        {/* Mini progress + chevron */}
        <div className="flex items-center gap-3">
          <div className="w-20 bg-mc-surface rounded-full h-1.5 border border-mc-border">
            <div className="bg-mc-green h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className={`text-mc-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>

      {open && (
        <div>
          {showFilters && (
            <FilterBar
              filters={filters}
              onChange={handleFiltersChange}
              totalVisible={filtered.length}
              totalFish={fish.length}
            />
          )}

          {/* Sort controls */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-ui text-mc-muted text-xs shrink-0">Sort:</span>
            <div className="flex gap-1 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`font-ui text-xs px-2.5 py-1 rounded border transition-colors
                    ${sort === opt.value
                      ? 'bg-mc-green/20 border-mc-green/50 text-mc-green'
                      : 'bg-mc-surface border-mc-border text-mc-muted hover:text-mc-text hover:border-mc-muted'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 font-ui text-mc-muted text-sm">
              No fish match your filters.
            </div>
          ) : (
            <div className="space-y-2">
              {paginated.map((f) => (
                <FishCard
                  key={f.id}
                  fish={f}
                  entry={progress[f.id]}
                  onToggle={onToggle}
                  onOpenModal={onOpenModal}
                />
              ))}
              {paginated.length < sorted.length && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full py-3 font-ui text-mc-blue text-sm hover:text-blue-300 border border-mc-border rounded-lg hover:border-mc-blue transition-colors"
                >
                  Load more ({sorted.length - paginated.length} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
