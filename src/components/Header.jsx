import { TOTAL_FISH } from '../data/fish'

export default function Header({ user, progress, onSignOut }) {
  const caught = Object.keys(progress).length
  const pct = Math.round((caught / TOTAL_FISH) * 100)

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(0,0,0,0.85)',
        borderBottom: '3px solid #555555',
      }}
    >
      <div className="px-4 pt-safe">
        <div className="flex items-center justify-between py-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎣</span>
            <span
              className="font-minecraft"
              style={{
                fontSize: '9px',
                color: '#55FF55',
                textShadow: '2px 2px #2D7A2D',
              }}
            >
              Fish Tracker
            </span>
          </div>

          {/* Sign out — Minecraft button style */}
          <button
            onClick={onSignOut}
            className="mc-btn"
            style={{ fontSize: '7px', padding: '6px 10px' }}
          >
            Sign Out
          </button>
        </div>

        {/* Minecraft XP bar */}
        <div className="pb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span
              className="font-minecraft"
              style={{ fontSize: '7px', color: '#AAAAAA', textShadow: '1px 1px #000' }}
            >
              {caught} fish caught
            </span>
            <span
              className="font-minecraft"
              style={{ fontSize: '7px', color: '#55FF55', textShadow: '1px 1px #2D7A2D' }}
            >
              {pct}%
            </span>
          </div>
          {/* XP bar container */}
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#2a2a2a',
              border: '1px solid #555555',
              borderRadius: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background: '#55FF55',
                transition: 'width 0.5s ease',
                borderRadius: 0,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
