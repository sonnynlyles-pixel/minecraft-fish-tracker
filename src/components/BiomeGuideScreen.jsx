const BIOMES = [
  {
    name: 'Warm Ocean',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
    fish: ['Tropical Fish (all variants)', 'Pufferfish'],
    tip: 'Look for light blue/turquoise water, usually near deserts or beaches in warm climates. F3 screen shows biome name.',
  },
  {
    name: 'Cold Ocean',
    emoji: '🧊',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #e0f2fe 100%)',
    fish: ['Cod', 'Salmon'],
    tip: 'Dark blue water, often near snow biomes. Common in many worlds.',
  },
  {
    name: 'River',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)',
    fish: ['Salmon'],
    tip: 'Thin waterways cutting through land. Easy to find and fish in.',
  },
  {
    name: 'Frozen River',
    emoji: '🏔️',
    gradient: 'linear-gradient(135deg, #7dd3fc 0%, #e0f2fe 100%)',
    fish: ['Salmon'],
    tip: 'Ice-covered rivers in snowy biomes.',
  },
  {
    name: 'Lukewarm Ocean',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #34d399 100%)',
    fish: ['Cod', 'Pufferfish', 'Tropical Fish'],
    tip: 'Medium-temperature oceans between warm and cold.',
  },
  {
    name: 'Lush Caves',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg, #166534 0%, #1a1a2e 100%)',
    fish: ['Tropical Fish'],
    tip: 'Underground caves with azalea trees above ground marking the location.',
  },
]

export default function BiomeGuideScreen({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md my-4 mx-4"
        style={{
          background: 'rgba(0,0,0,0.92)',
          border: '2px solid #555555',
          borderBottom: '2px solid #222222',
          borderRight: '2px solid #222222',
          borderRadius: '2px',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '2px solid #333333' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🗺️</span>
            <span className="font-minecraft" style={{ fontSize: '9px', color: '#55FF55', textShadow: '1px 1px #000' }}>
              Biome Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none"
            style={{ color: '#AAAAAA', background: 'none', border: 'none', cursor: 'pointer', textShadow: '1px 1px #000' }}
          >
            ✕
          </button>
        </div>

        {/* Intro */}
        <div className="px-5 pt-4 pb-2">
          <p className="font-ui text-xs" style={{ color: '#AAAAAA' }}>
            Find fish in the right biome. Press F3 in-game to see your current biome name.
          </p>
        </div>

        {/* Biome cards */}
        <div className="p-4 space-y-3 pb-6">
          {BIOMES.map((biome) => (
            <div
              key={biome.name}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #333333',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              {/* Biome header with gradient */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: biome.gradient, position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                  }}
                />
                <span className="text-2xl relative z-10">{biome.emoji}</span>
                <span
                  className="font-minecraft relative z-10"
                  style={{ fontSize: '8px', color: '#FFFFFF', textShadow: '1px 1px #000' }}
                >
                  {biome.name}
                </span>
              </div>

              {/* Card body */}
              <div className="px-4 py-3 space-y-2">
                {/* Fish list */}
                <div>
                  <p className="font-minecraft mb-1.5" style={{ fontSize: '7px', color: '#55FF55' }}>
                    Fish Found
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {biome.fish.map((f) => (
                      <span
                        key={f}
                        className="font-ui text-xs px-2 py-0.5"
                        style={{
                          background: 'rgba(85,255,85,0.08)',
                          border: '1px solid rgba(85,255,85,0.3)',
                          color: '#FFFFFF',
                          borderRadius: '1px',
                        }}
                      >
                        🐟 {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick tip */}
                <div
                  className="flex gap-2 p-2.5"
                  style={{
                    background: 'rgba(0,0,0,0.30)',
                    border: '1px solid #222222',
                    borderRadius: '1px',
                  }}
                >
                  <span className="shrink-0">💡</span>
                  <p className="font-ui text-xs" style={{ color: '#AAAAAA' }}>{biome.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
