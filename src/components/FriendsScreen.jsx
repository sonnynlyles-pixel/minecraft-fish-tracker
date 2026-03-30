import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import PublicProfileScreen from './PublicProfileScreen'

export default function FriendsScreen({ onClose, currentUserId, inline = false }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch all users once on mount
  useEffect(() => {
    async function fetchAllUsers() {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, 'users'))

        // Filter out docs with no username and skip current user
        const validUsers = snap.docs
          .filter((d) => {
            const data = d.data()
            const username = data.username
            if (!username || username === '') return false
            if (d.id === currentUserId) return false
            return true
          })
          .map((d) => ({ uid: d.id, ...d.data() }))

        // Fetch caught counts in parallel
        const withCounts = await Promise.all(
          validUsers.map(async (u) => {
            try {
              const progressSnap = await getDoc(doc(db, 'progress', u.uid))
              const catches = progressSnap.exists()
                ? (progressSnap.data().catches ?? {})
                : {}
              return { ...u, caughtCount: Object.keys(catches).length }
            } catch {
              return { ...u, caughtCount: 0 }
            }
          })
        )

        setAllUsers(withCounts)
      } catch {
        setAllUsers([])
      }
      setLoading(false)
    }
    fetchAllUsers()
  }, [currentUserId])

  // Filter client-side using includes for partial matches
  const results = searchTerm.trim()
    ? allUsers.filter((u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const content = (
    <div className={`bg-mc-card border border-mc-border rounded-xl w-full ${inline ? 'h-full' : 'max-w-sm shadow-2xl'} overflow-hidden flex flex-col ${inline ? '' : 'max-h-[85vh]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>
            Players
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

      {/* Search input */}
      <div className="px-5 py-3 border-b border-mc-border flex-shrink-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username…"
          className="w-full bg-mc-surface border border-mc-border rounded-lg px-3 py-2 font-ui text-mc-text text-sm placeholder:text-mc-muted focus:outline-none focus:border-mc-green/60 transition-colors"
          autoFocus={!inline}
        />
      </div>

      {/* Results */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span
              className="font-minecraft text-mc-green animate-pulse"
              style={{ fontSize: '8px' }}
            >
              Loading players…
            </span>
          </div>
        ) : !searchTerm.trim() ? (
          <div className="flex items-center justify-center py-10">
            <p className="font-ui text-mc-muted text-sm text-center px-4">
              Search for a player by username
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="font-ui text-mc-muted text-sm">No players found</p>
          </div>
        ) : (
          <div className="divide-y divide-mc-border">
            {results.map((u) => (
              <button
                key={u.uid}
                onClick={() => setSelectedUser(u)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-mc-surface transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full border border-mc-border bg-mc-bg flex items-center justify-center text-base flex-shrink-0">
                  👤
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-ui text-mc-text text-sm font-medium truncate">
                    {u.username}
                  </p>
                  <p className="font-ui text-mc-muted text-xs truncate">
                    {u.email?.split('@')[0]}
                  </p>
                </div>
                {u.caughtCount > 0 && (
                  <span className="font-ui text-mc-muted text-xs flex-shrink-0">
                    🐟 {u.caughtCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (inline) {
    return (
      <>
        <div className="w-full h-full max-w-2xl mx-auto px-4 py-4">
          {content}
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
        {content}
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
