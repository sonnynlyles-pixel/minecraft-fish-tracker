import { COLORS, PATTERNS, SIZES } from '../data/fish'

export const DEFAULT_FILTERS = {
  search: '',
  size: '',
  pattern: '',
  bodyColor: '',
  patternColor: '',
  status: '',
}

const inputStyle = {
  width: '100%',
  background: '#1a1a1a',
  border: '2px solid #555555',
  borderBottom: '2px solid #222222',
  borderRight: '2px solid #222222',
  borderRadius: '1px',
  color: '#FFFFFF',
  fontSize: '13px',
  fontFamily: 'Inter, system-ui, sans-serif',
  outline: 'none',
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex-1 min-w-0">
      <label
        className="font-ui text-xs block mb-1"
        style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer"
        style={{ ...inputStyle, padding: '8px' }}
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
    <div
      className="p-4 mb-4 space-y-3"
      style={{
        background: 'rgba(0,0,0,0.80)',
        border: '2px solid #555555',
        borderBottom: '2px solid #222222',
        borderRight: '2px solid #222222',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
        borderRadius: '2px',
      }}
    >
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#AAAAAA' }}>🔍</span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search fish by name, color, pattern…"
          style={{
            ...inputStyle,
            paddingLeft: '32px',
            paddingRight: '12px',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
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
        <span className="font-ui text-xs" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
          Showing {totalVisible.toLocaleString()} of {totalFish.toLocaleString()}
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="font-ui text-xs underline"
            style={{ color: '#55FFFF', background: 'none', border: 'none', cursor: 'pointer', textShadow: '1px 1px #000' }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
