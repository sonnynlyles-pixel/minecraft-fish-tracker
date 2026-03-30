import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { TOTAL_FISH } from '../data/fish'
import FriendDetailScreen from './FriendDetailScreen'

const SUB_TABS = [
  { id: 'friends', label: 'Friends' },
  { id: 'requests', label: 'Requests' },
  { id: 'find', label: 'Find' },
]

export default function FriendsScreen({
  onClose,
  currentUserId,
  inline = false,
  friends,
  pendingReceived,
  pendingSent,
  friendsLoading,
  sendFriendRequest,
  acceptRequest,
  declineRequest,
  removeFriend,
  currentProfile,
}) {
  const [subTab, setSubTab] = useState('friends')
  const [selectedFriend, setSelectedFriend] = useState(null)

  // Find sub-tab state
  const [searchTerm, setSearchTerm] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [actionStatus, setActionStatus] = useState({}) // uid -> 'sending' | 'sent' | 'error'

  // Fetch all users once on mount
  useEffect(() => {
    async function fetchAllUsers() {
      setUsersLoading(true)
      try {
        const snap = await getDocs(collection(db, 'users'))
        const validUsers = snap.docs
          .filter((d) => {
            const data = d.data()
            if (!data.username || data.username === '') return false
            if (d.id === currentUserId) return false
            return true
          })
          .map((d) => ({ uid: d.id, ...d.data() }))

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
      setUsersLoading(false)
    }
    fetchAllUsers()
  }, [currentUserId])

  const searchResults = searchTerm.trim()
    ? allUsers.filter((u) => {
        const term = searchTerm.toLowerCase()
        return (
          u.username.toLowerCase().includes(term) ||
          (u.usernameLower && u.usernameLower.includes(term))
        )
      })
    : []

  function getFriendStatus(targetUid) {
    if ((friends ?? []).some((f) => f.uid === targetUid)) return 'friends'
    if ((pendingSent ?? []).some((r) => r.toUid === targetUid)) return 'sent'
    if ((pendingReceived ?? []).some((r) => r.fromUid === targetUid)) return 'received'
    return 'none'
  }

  async function handleSendRequest(targetUser) {
    setActionStatus((s) => ({ ...s, [targetUser.uid]: 'sending' }))
    const result = await sendFriendRequest(targetUser)
    if (result?.error) {
      setActionStatus((s) => ({ ...s, [targetUser.uid]: 'error:' + result.error }))
      setTimeout(() => setActionStatus((s) => {
        const copy = { ...s }
        delete copy[targetUser.uid]
        return copy
      }), 3000)
    } else {
      setActionStatus((s) => ({ ...s, [targetUser.uid]: 'sent' }))
    }
  }

  async function handleAcceptFromFind(request) {
    await acceptRequest(request)
  }

  // If viewing friend detail
  if (selectedFriend) {
    return (
      <FriendDetailScreen
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
    )
  }

  const pendingReceivedCount = (pendingReceived ?? []).length

  const content = (
    <div
      className={`bg-mc-card border border-mc-border rounded-xl w-full ${
        inline ? 'h-full' : 'max-w-sm shadow-2xl'
      } overflow-hidden flex flex-col ${inline ? '' : 'max-h-[85vh]'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>
            Social
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

      {/* Sub-tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-mc-border flex-shrink-0">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`relative px-3 py-1.5 rounded-full font-ui text-xs transition-colors ${
              subTab === t.id
                ? 'bg-mc-green text-mc-bg font-semibold'
                : 'bg-mc-surface text-mc-muted border border-mc-border hover:text-mc-text'
            }`}
          >
            {t.label}
            {t.id === 'requests' && pendingReceivedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 leading-none font-ui font-bold">
                {pendingReceivedCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1">
        {subTab === 'friends' && (
          <FriendsTab
            friends={friends ?? []}
            loading={friendsLoading}
            onViewFriend={setSelectedFriend}
            onRemoveFriend={removeFriend}
          />
        )}
        {subTab === 'requests' && (
          <RequestsTab
            pendingReceived={pendingReceived ?? []}
            pendingSent={pendingSent ?? []}
            loading={friendsLoading}
            onAccept={acceptRequest}
            onDecline={declineRequest}
            onCancel={declineRequest}
          />
        )}
        {subTab === 'find' && (
          <FindTab
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            results={searchResults}
            loading={usersLoading}
            getFriendStatus={getFriendStatus}
            actionStatus={actionStatus}
            onSendRequest={handleSendRequest}
            onAcceptFromFind={handleAcceptFromFind}
            pendingReceived={pendingReceived ?? []}
            onViewFriend={setSelectedFriend}
            friends={friends ?? []}
          />
        )}
      </div>
    </div>
  )

  if (inline) {
    return (
      <div className="w-full h-full max-w-2xl mx-auto px-4 py-4">
        {content}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {content}
    </div>
  )
}

// ── Friends sub-tab ────────────────────────────────────────────────────────────

function FriendsTab({ friends, loading, onViewFriend, onRemoveFriend }) {
  const [removing, setRemoving] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-14">
        <span className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '8px' }}>
          Loading…
        </span>
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-3">
        <span className="text-3xl">👥</span>
        <p className="font-ui text-mc-muted text-sm">
          No friends yet. Search for players to add!
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-mc-border">
      {friends.map((friend) => (
        <FriendCard
          key={friend.uid}
          friend={friend}
          onView={() => onViewFriend(friend)}
          onRemove={() => {
            setRemoving(friend.uid)
            onRemoveFriend(friend.uid).finally(() => setRemoving(null))
          }}
          isRemoving={removing === friend.uid}
        />
      ))}
    </div>
  )
}

function FriendCard({ friend, onView, onRemove, isRemoving }) {
  const [caughtCount, setCaughtCount] = useState(null)

  useEffect(() => {
    async function fetchCount() {
      try {
        const snap = await getDoc(doc(db, 'progress', friend.uid))
        const catches = snap.exists() ? (snap.data().catches ?? {}) : {}
        setCaughtCount(Object.keys(catches).length)
      } catch {
        setCaughtCount(0)
      }
    }
    fetchCount()
  }, [friend.uid])

  const pct = caughtCount != null ? Math.round((caughtCount / TOTAL_FISH) * 100) : 0

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-mc-surface transition-colors">
      <button onClick={onView} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="w-9 h-9 rounded-full border border-mc-border bg-mc-bg flex items-center justify-center text-base flex-shrink-0">
          👤
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-ui text-mc-text text-sm font-medium truncate">{friend.username}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 max-w-24 bg-mc-surface rounded-full h-1 border border-mc-border">
              <div className="bg-mc-green h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-ui text-mc-muted text-xs flex-shrink-0">
              {caughtCount != null ? `🐟 ${caughtCount}` : '…'}
            </span>
          </div>
        </div>
      </button>
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors text-xs disabled:opacity-50"
        title="Remove friend"
      >
        ✕
      </button>
    </div>
  )
}

// ── Requests sub-tab ───────────────────────────────────────────────────────────

function RequestsTab({ pendingReceived, pendingSent, loading, onAccept, onDecline, onCancel }) {
  const [processing, setProcessing] = useState({})

  if (loading) {
    return (
      <div className="flex items-center justify-center py-14">
        <span className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '8px' }}>
          Loading…
        </span>
      </div>
    )
  }

  const hasAny = pendingReceived.length > 0 || pendingSent.length > 0

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-3">
        <span className="text-3xl">📬</span>
        <p className="font-ui text-mc-muted text-sm">No pending requests</p>
      </div>
    )
  }

  async function handleAction(id, action) {
    setProcessing((s) => ({ ...s, [id]: true }))
    try {
      await action()
    } finally {
      setProcessing((s) => ({ ...s, [id]: false }))
    }
  }

  return (
    <div className="p-4 space-y-5">
      {/* Received */}
      {pendingReceived.length > 0 && (
        <div>
          <p className="font-minecraft text-mc-muted mb-3" style={{ fontSize: '7px' }}>
            RECEIVED ({pendingReceived.length})
          </p>
          <div className="space-y-2">
            {pendingReceived.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-3 p-3 bg-mc-surface border border-mc-border rounded-lg"
              >
                <div className="w-8 h-8 rounded-full border border-mc-border bg-mc-bg flex items-center justify-center text-sm flex-shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-mc-text text-sm font-medium truncate">
                    {req.fromUsername}
                  </p>
                  <p className="font-ui text-mc-muted text-xs">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAction(req.id + '_accept', () => onAccept(req))}
                    disabled={processing[req.id + '_accept']}
                    className="px-3 py-1.5 bg-mc-green text-mc-bg font-ui text-xs font-semibold rounded-lg hover:bg-mc-green/80 transition-colors disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.id + '_decline', () => onDecline(req))}
                    disabled={processing[req.id + '_decline']}
                    className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 font-ui text-xs rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent */}
      {pendingSent.length > 0 && (
        <div>
          <p className="font-minecraft text-mc-muted mb-3" style={{ fontSize: '7px' }}>
            SENT ({pendingSent.length})
          </p>
          <div className="space-y-2">
            {pendingSent.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-3 p-3 bg-mc-surface border border-mc-border rounded-lg"
              >
                <div className="w-8 h-8 rounded-full border border-mc-border bg-mc-bg flex items-center justify-center text-sm flex-shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-mc-text text-sm font-medium truncate">
                    {req.toUsername}
                  </p>
                  <p className="font-ui text-mc-muted text-xs">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleAction(req.id + '_cancel', () => onCancel(req))}
                  disabled={processing[req.id + '_cancel']}
                  className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 font-ui text-xs rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Find sub-tab ───────────────────────────────────────────────────────────────

function FindTab({
  searchTerm,
  onSearchChange,
  results,
  loading,
  getFriendStatus,
  actionStatus,
  onSendRequest,
  onAcceptFromFind,
  pendingReceived,
  onViewFriend,
  friends,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="px-4 py-3 border-b border-mc-border flex-shrink-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username…"
          className="w-full bg-mc-surface border border-mc-border rounded-lg px-3 py-2 font-ui text-mc-text text-sm placeholder:text-mc-muted focus:outline-none focus:border-mc-green/60 transition-colors"
        />
      </div>

      {/* Results */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '8px' }}>
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
            {results.map((u) => {
              const status = getFriendStatus(u.uid)
              const localStatus = actionStatus[u.uid]
              const isSending = localStatus === 'sending'
              const isError = localStatus?.startsWith('error:')
              const errorMsg = isError ? localStatus.replace('error:', '') : null

              // Find the received request for this user if any
              const receivedReq = pendingReceived.find((r) => r.fromUid === u.uid)

              // Find the friend object if already friends
              const friendObj = friends.find((f) => f.uid === u.uid)

              return (
                <div
                  key={u.uid}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-mc-surface transition-colors"
                >
                  <button
                    onClick={() => {
                      if (status === 'friends' && friendObj) {
                        onViewFriend(friendObj)
                      }
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    disabled={status !== 'friends'}
                  >
                    <div className="w-9 h-9 rounded-full border border-mc-border bg-mc-bg flex items-center justify-center text-base flex-shrink-0">
                      👤
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-ui text-mc-text text-sm font-medium truncate">
                        {u.username}
                      </p>
                      {u.caughtCount > 0 && (
                        <p className="font-ui text-mc-muted text-xs">🐟 {u.caughtCount}</p>
                      )}
                      {isError && (
                        <p className="font-ui text-red-400 text-xs mt-0.5">{errorMsg}</p>
                      )}
                    </div>
                  </button>

                  {/* Action button */}
                  {status === 'friends' ? (
                    <span className="font-ui text-mc-green text-xs px-3 py-1.5 border border-mc-green/40 rounded-lg flex-shrink-0">
                      Friends ✓
                    </span>
                  ) : status === 'sent' ? (
                    <span className="font-ui text-mc-muted text-xs px-3 py-1.5 border border-mc-border rounded-lg flex-shrink-0">
                      Requested
                    </span>
                  ) : status === 'received' && receivedReq ? (
                    <button
                      onClick={() => onAcceptFromFind(receivedReq)}
                      className="font-ui text-mc-bg text-xs px-3 py-1.5 bg-mc-green rounded-lg font-semibold hover:bg-mc-green/80 transition-colors flex-shrink-0"
                    >
                      Accept
                    </button>
                  ) : (
                    <button
                      onClick={() => onSendRequest(u)}
                      disabled={isSending}
                      className="font-ui text-mc-text text-xs px-3 py-1.5 bg-mc-surface border border-mc-border rounded-lg hover:border-mc-green/60 hover:text-mc-green transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      {isSending ? '…' : 'Add Friend'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
