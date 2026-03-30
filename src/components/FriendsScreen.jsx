import { useState, useEffect, useRef } from 'react'
import { collection, query, where, orderBy, startAt, endAt, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import PublicProfileScreen from './PublicProfileScreen'

export default function FriendsScreen({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!searchTerm.trim()) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const term = searchTerm.trim()
        const q = query(
          collection(db, 'users'),
          orderBy('username'),
          startAt(term),
          endAt(term + '\uf8ff')
        )
        const snap = await getDocs(q)
        const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
        setResults(users)
      } catch {
        setResults([])
      }
      setSearching(false)
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchTerm])

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-mc-card border border-mc-border rounded-xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>
                Players
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-mc-muted hover:text-mc-text text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Search input */}
          <div className="px-5 py-3 border-b border-mc-border flex-shrink-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username…"
              className="w-full bg-mc-surface border border-mc-border rounded-lg px-3 py-2 font-ui text-mc-text text-sm placeholder:text-mc-muted focus:outline-none focus:border-mc-green/60 transition-colors"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {!searchTerm.trim() ? (
              <div className="flex items-center justify-center py-10">
                <p className="font-ui text-mc-muted text-sm text-center px-4">
                  Search for a player by username
                </p>
              </div>
            ) : searching ? (
              <div className="flex items-center justify-center py-10">
                <span
                  className="font-minecraft text-mc-green animate-pulse"
                  style={{ fontSize: '8px' }}
                >
                  Searching…
                </span>
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
                    <div className="min-w-0">
                      <p className="font-ui text-mc-text text-sm font-medium truncate">
                        {u.username}
                      </p>
                      <p className="font-ui text-mc-muted text-xs truncate">
                        {u.email?.split('@')[0]}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
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
