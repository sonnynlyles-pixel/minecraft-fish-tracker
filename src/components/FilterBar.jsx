import { COLORS, PATTERNS, SIZES } from '../data/fish'

export const DEFAULT_FILTERS = {
  search: '',
  size: '',
  pattern: '',
  bodyColor: '',
  patternColor: '',
  status: '',
}

function Select({ label, value, onChange, options, colorDot }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="font-ui text-mc-muted text-xs block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-mc-surface border border-mc-border rounded-lg px-2 py-2 font-ui text-sm text-mc-text focus:outline-none focus:border-mc-blue appearance-none cursor-pointer"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function FilterBar({ filters, onChange, totalVisible, totalFish }) {
  function set(key, val) {
    onChange({ ...filters, [key]: val })
  }

  function clearAll() {
    onChange(DEFAULT_FILTERS)
  }

  const hasFilters = Object.entries(filters).some(([k, v]) => k !== 'status' && v !== '')
    || filters.status !== ''

  // Build pattern options based on size filter
  const patternOptions = PATTERNS.map((p) => ({
    value: String(p.id),
    label: filters.size === '0' ? p.small : filters.size === '1' ? p.large : `${p.small} / ${p.large}`,
  }))

  return (
    <div className="bg-mc-surface border border-mc-border rounded-xl p-4 mb-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mc-muted text-sm">🔍</span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search fish by name, color, pattern…"
          className="w-full bg-mc-card border border-mc-border rounded-lg pl-8 pr-3 py-2.5 font-ui text-sm text-mc-text placeholder:text-mc-muted/50 focus:outline-none focus:border-mc-blue"
        />
      </div>

      {/* Row 1 */}
      <div className="flex gap-2">
        <Select
          label="Size"
          value={filters.size}
          onChange={(v) => set('size', v)}
          options={SIZES.map((s) => ({ value: String(s.id), label: s.name }))}
        />
        <Select
          label="Pattern"
          value={filters.pattern}
          onChange={(v) => set('pattern', v)}
          options={patternOptions}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(v) => set('status', v)}
          options={[
            { value: 'caught', label: 'Caught' },
            { value: 'uncaught', label: 'Not caught' },
            { value: 'named', label: 'Named fish' },
          ]}
        />
      </div>

      {/* Row 2 — colors */}
      <div className="flex gap-2">
        <Select
          label="Body Color"
          value={filters.bodyColor}
          onChange={(v) => set('bodyColor', v)}
          options={COLORS.map((c) => ({ value: String(c.id), label: c.name }))}
        />
        <Select
          label="Pattern Color"
          value={filters.patternColor}
          onChange={(v) => set('patternColor', v)}
          options={COLORS.map((c) => ({ value: String(c.id), label: c.name }))}
        />
      </div>

      {/* Results + clear */}
      <div className="flex items-center justify-between">
        <span className="font-ui text-mc-muted text-xs">
          Showing {totalVisible.toLocaleString()} of {totalFish.toLocaleString()}
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="font-ui text-mc-blue hover:text-blue-300 text-xs underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
