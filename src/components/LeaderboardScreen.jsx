import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { TOTAL_FISH } from '../data/fish'
import PublicProfileScreen from './PublicProfileScreen'

function rankBadge(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}.`
}

export default function LeaderboardScreen({ currentUserId, onClose, inline = false }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        // Fetch all users
        const usersSnap = await getDocs(collection(db, 'users'))
        const users = usersSnap.docs
          .map((d) => ({ uid: d.id, ...d.data() }))
          .filter((u) => u.username != null && u.username !== '')

        // Fetch progress for each user
        const results = await Promise.all(
          users.map(async (u) => {
            try {
              const progressSnap = await getDoc(doc(db, 'progress', u.uid))
              const catches = progressSnap.exists()
                ? (progressSnap.data().catches ?? {})
                : {}
              return { user: u, totalCaught: Object.keys(catches).length }
            } catch {
              return { user: u, totalCaught: 0 }
            }
          })
        )

        // Sort by total caught descending
        results.sort((a, b) => b.totalCaught - a.totalCaught)
        setEntries(results)
      } catch {
        setEntries([])
      }
      setLoading(false)
    }
    fetchLeaderboard()
  }, [])

  const cardContent = (
    <div className={`bg-mc-card border border-mc-border rounded-xl w-full ${inline ? 'h-full' : 'max-w-sm shadow-2xl'} overflow-hidden flex flex-col ${inline ? '' : 'max-h-[85vh]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="font-minecraft text-mc-gold" style={{ fontSize: '9px' }}>
            Leaderboard
          </span>
        </div>
        {!inline && (
          <button
            onClick={onClose}
            className="text-mc-muted hover:text-mc-text text-xl leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-14">
            <span
              className="font-minecraft text-mc-green animate-pulse"
              style={{ fontSize: '8px' }}
            >
              Loading…
            </span>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex items-center justify-center py-14">
            <p className="font-ui text-mc-muted text-sm">No players yet</p>
          </div>
        ) : (
          <div className="divide-y divide-mc-border">
            {entries.map(({ user, totalCaught }, index) => {
              const rank = index + 1
              const pct = Math.round((totalCaught / TOTAL_FISH) * 100)
              const isCurrentUser = user.uid === currentUserId
              return (
                <button
                  key={user.uid}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-mc-surface transition-colors text-left ${
                    isCurrentUser ? 'border-l-2 border-mc-green' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex-shrink-0 text-center">
                    {rank <= 3 ? (
                      <span className="text-xl leading-none">{rankBadge(rank)}</span>
                    ) : (
                      <span className="font-minecraft text-mc-muted" style={{ fontSize: '8px' }}>
                        {rank}.
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full border border-mc-border bg-mc-bg flex items-center justify-center text-base flex-shrink-0">
                    👤
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className={`font-ui text-sm font-semibold truncate ${isCurrentUser ? 'text-mc-green' : 'text-mc-text'}`}>
                      {user.username}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 bg-mc-surface rounded-full h-1.5 border border-mc-border min-w-0">
                        <div
                          className="bg-mc-green h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-ui text-mc-muted text-xs flex-shrink-0">
                        {totalCaught.toLocaleString()} / {TOTAL_FISH.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  if (inline) {
    return (
      <>
        <div className="w-full h-full max-w-2xl mx-auto px-4 py-4">
          {cardContent}
        </div>
        {selectedUser && (
          <PublicProfileScreen
            targetUser={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {cardContent}
      </div>

      {selectedUser && (
        <PublicProfileScreen
          targetUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  )
}
