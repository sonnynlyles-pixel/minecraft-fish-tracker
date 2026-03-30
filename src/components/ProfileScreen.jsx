import { useMemo, useState } from 'react'
import { getTropicalFish, TOTAL_FISH } from '../data/fish'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function ProfileScreen({
  user,
  progress,
  onSignOut,
  onClose,
  profile,
  setUsername,
  usernameError,
  onFriendsClick,
}) {
  const tropicalFish = useMemo(() => getTropicalFish(), [])

  const totalCaught = Object.keys(progress).length
  const pct = Math.round((totalCaught / TOTAL_FISH) * 100)

  const namedCaught = tropicalFish.filter((f) => f.isNamed && progress[f.id]).length

  const allDates = Object.values(progress)
    .map((e) => e.caughtAt)
    .filter(Boolean)
    .sort()
  const firstCatch = allDates[0] || null

  // Username edit state
  const [editingUsername, setEditingUsername] = useState(false)
  const [draftUsername, setDraftUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  function handleEditClick() {
    setDraftUsername(profile?.username ?? '')
    setEditingUsername(true)
    setSaveSuccess(false)
  }

  async function handleSaveUsername() {
    if (!setUsername) return
    setSaving(true)
    const ok = await setUsername(draftUsername.trim())
    setSaving(false)
    if (ok) {
      setEditingUsername(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
  }

  function handleCancelEdit() {
    setEditingUsername(false)
    setSaveSuccess(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-mc-card border border-mc-border rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-mc-border">
          <span className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>Profile</span>
          <button onClick={onClose} className="text-mc-muted hover:text-mc-text text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar + email */}
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-14 h-14 rounded-full border-2 border-mc-green" />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-mc-border bg-mc-surface flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div className="min-w-0">
              {user?.displayName && (
                <p className="font-ui font-semibold text-mc-text text-base">{user.displayName}</p>
              )}
              <p className="font-ui text-mc-muted text-sm break-all">{user?.email}</p>
            </div>
          </div>

          {/* Username section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-ui text-mc-muted text-xs uppercase tracking-wide">Username</span>
              {!editingUsername && (
                <button
                  onClick={handleEditClick}
                  className="font-ui text-mc-green text-xs hover:underline"
                >
                  {profile?.username ? 'Change' : 'Set username'}
                </button>
              )}
            </div>

            {editingUsername ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  placeholder="e.g. FishMaster_99"
                  maxLength={20}
                  className="w-full bg-mc-surface border border-mc-border rounded-lg px-3 py-2 font-ui text-mc-text text-sm placeholder:text-mc-muted focus:outline-none focus:border-mc-green/60 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveUsername()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  autoFocus
                />
                {usernameError && (
                  <p className="font-ui text-red-400 text-xs">{usernameError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUsername}
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg font-minecraft text-mc-bg bg-mc-green hover:bg-mc-green/90 disabled:opacity-50 transition-colors"
                    style={{ fontSize: '8px' }}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg font-minecraft text-mc-muted border border-mc-border hover:border-mc-text transition-colors"
                    style={{ fontSize: '8px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {profile?.username ? (
                  <span className="font-ui text-mc-text text-sm font-medium">{profile.username}</span>
                ) : (
                  <span className="font-ui text-mc-muted text-sm italic">No username set</span>
                )}
                {saveSuccess && (
                  <span className="font-ui text-mc-green text-xs">Saved!</span>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-mc-surface border border-mc-border rounded-lg divide-y divide-mc-border">
            <StatRow label="Fish caught" value={`${totalCaught.toLocaleString()} (${pct}%)`} />
            <StatRow label="Named tropical" value={String(namedCaught)} />
            <StatRow label="First catch" value={formatDate(firstCatch)} />
          </div>

          {/* Find Players */}
          {onFriendsClick && (
            <button
              onClick={onFriendsClick}
              className="w-full py-3 rounded-lg font-minecraft text-mc-green border border-mc-green/40 bg-mc-green/10 hover:bg-mc-green/20 transition-colors"
              style={{ fontSize: '8px' }}
            >
              👥 Find Players
            </button>
          )}

          {/* Sign out */}
          <button
            onClick={() => { onSignOut(); onClose() }}
            className="w-full py-3 rounded-lg font-minecraft text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-colors"
            style={{ fontSize: '9px' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="font-ui text-mc-muted text-sm">{label}</span>
      <span className="font-ui text-mc-text text-sm font-medium">{value}</span>
    </div>
  )
}
