import { TOTAL_FISH } from '../data/fish'

export default function Header({ user, progress, onSignOut, onResetClick, onStatsClick, onProfileClick, onLeaderboardClick }) {
  const caught = Object.keys(progress).length
  const pct = Math.round((caught / TOTAL_FISH) * 100)

  return (
    <header className="sticky top-0 z-40 bg-mc-bg/95 backdrop-blur border-b border-mc-border">
      <div className="px-4 pt-safe">
        <div className="flex items-center justify-between py-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎣</span>
            <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>
              Fish Tracker
            </span>
          </div>

          {/* User + actions */}
          <div className="flex items-center gap-2">
            {/* Leaderboard button */}
            <button
              onClick={onLeaderboardClick}
              className="font-ui text-mc-muted hover:text-mc-gold text-xs px-2 py-1 rounded border border-mc-border hover:border-mc-gold transition-colors"
              aria-label="Leaderboard"
              title="Leaderboard"
            >
              🏆
            </button>

            {/* Stats button */}
            <button
              onClick={onStatsClick}
              className="font-ui text-mc-muted hover:text-mc-blue text-xs px-2 py-1 rounded border border-mc-border hover:border-mc-blue transition-colors"
              aria-label="Stats"
              title="Stats"
            >
              📊
            </button>

            <button
              onClick={onResetClick}
              className="font-ui text-mc-muted hover:text-red-400 text-xs px-2 py-1 rounded border border-mc-border hover:border-red-400 transition-colors"
            >
              Reset
            </button>

            {/* Avatar — opens profile */}
            {user?.photoURL ? (
              <button
                onClick={onProfileClick}
                className="rounded-full border-2 border-mc-border hover:border-mc-green transition-colors"
                aria-label="Profile"
              >
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full block"
                />
              </button>
            ) : (
              <button
                onClick={onProfileClick}
                className="font-ui text-mc-muted hover:text-mc-text text-xs px-2 py-1 rounded border border-mc-border transition-colors"
                aria-label="Profile"
              >
                👤
              </button>
            )}

            <button
              onClick={onSignOut}
              className="font-ui text-mc-muted hover:text-mc-text text-xs px-2 py-1 rounded border border-mc-border transition-colors"
            >
              Out
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="font-ui text-mc-muted text-xs">{caught} / {TOTAL_FISH} caught</span>
            <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>{pct}%</span>
          </div>
          <div className="w-full bg-mc-surface rounded-full h-2.5 border border-mc-border">
            <div
              className="bg-mc-green h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
