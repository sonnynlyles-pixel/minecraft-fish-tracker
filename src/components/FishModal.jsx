import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import FishSprite from './FishSprite'
import { FISHING_TIPS, TROPICAL_TIPS } from '../data/fish'

function formatDateTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const panelStyle = {
  background: 'rgba(0,0,0,0.90)',
  border: '2px solid #555555',
  borderBottom: '2px solid #222222',
  borderRight: '2px solid #222222',
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
  borderRadius: '2px',
}

const innerPanelStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #555555',
  borderBottom: '1px solid #222222',
  borderRight: '1px solid #222222',
  borderRadius: '1px',
}

const darkPanelStyle = {
  background: 'rgba(0,0,0,0.50)',
  border: '1px solid #333333',
  borderRadius: '2px',
  padding: '12px',
}

export default function FishModal({ fish, entry, onClose, onToggle, onSaveNotes, currentProfile }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState(entry?.notes ?? '')
  const caught = !!entry

  // Comments state
  const [comments, setComments] = useState([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [posting, setPosting] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    setNotes(entry?.notes ?? '')
  }, [fish, entry])

  // Fetch comments on mount
  useEffect(() => {
    async function fetchComments() {
      try {
        const q = query(
          collection(db, 'fishComments', fish.id, 'comments'),
          orderBy('timestamp', 'desc')
        )
        const snap = await getDocs(q)
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch {
        setComments([])
      }
      setCommentsLoaded(true)
    }
    fetchComments()
  }, [fish.id])

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleToggle() {
    await onToggle(fish)
    if (caught) onClose()
  }

  async function handleNotesSave() {
    if (!caught) return
    await onSaveNotes(fish.id, notes)
  }

  async function handlePostComment() {
    if (!commentText.trim() || !user) return
    setPosting(true)
    try {
      const newComment = {
        userId: user.uid,
        username: currentProfile?.username || 'Unknown',
        text: commentText.trim().slice(0, 200),
        timestamp: new Date().toISOString(),
      }
      const docRef = await addDoc(collection(db, 'fishComments', fish.id, 'comments'), newComment)
      setComments((prev) => [{ id: docRef.id, ...newComment }, ...prev])
      setCommentText('')
    } catch {
      // silently fail
    }
    setPosting(false)
  }

  async function handleDeleteComment(commentId) {
    setDeletingId(commentId)
    try {
      await deleteDoc(doc(db, 'fishComments', fish.id, 'comments', commentId))
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch {
      // silently fail
    }
    setDeletingId(null)
  }

  // Determine fishing tips
  const fishingTips = fish.category === 'tropical'
    ? TROPICAL_TIPS
    : FISHING_TIPS[fish.id] || null

  const displayedComments = showAllComments ? comments : comments.slice(0, 5)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-md overflow-y-auto" style={{ ...panelStyle, maxHeight: '90vh' }}>
        {/* Header */}
        <div
          className="flex items-center gap-4 p-5"
          style={{ borderBottom: '2px solid #333333' }}
        >
          <FishSprite fish={fish} size={56} locked={!caught} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className="font-ui font-semibold text-base"
                style={{ color: '#FFFFFF', textShadow: '1px 1px #000' }}
              >
                {fish.name}
              </h2>
              {fish.isNamed && (
                <span
                  className="text-xs px-1.5 py-0.5 font-ui"
                  style={{
                    background: 'rgba(255,170,0,0.2)',
                    color: '#FFAA00',
                    border: '1px solid rgba(255,170,0,0.4)',
                    borderRadius: '1px',
                    textShadow: '1px 1px #000',
                  }}
                >
                  Named
                </span>
              )}
            </div>
            {fish.category === 'tropical' && (
              <p className="font-ui text-xs mt-0.5" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
                {fish.sizeName} · {fish.patternName}
              </p>
            )}
            {caught && entry.caughtAt && (
              <p className="font-ui text-xs mt-1" style={{ color: '#55FF55', textShadow: '1px 1px #000' }}>
                Caught {formatDateTime(entry.caughtAt)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none"
            style={{ color: '#AAAAAA', background: 'none', border: 'none', cursor: 'pointer', textShadow: '1px 1px #000' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Color swatches for tropical */}
          {fish.category === 'tropical' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Body color', value: fish.bodyColorName, hex: fish.bodyColorHex },
                { label: 'Pattern color', value: fish.patternColorName, hex: fish.patternColorHex },
                { label: 'Size', value: fish.sizeName, hex: null },
                { label: 'Pattern', value: fish.patternName, hex: null },
              ].map(({ label, value, hex }) => (
                <div key={label} className="flex items-center gap-2 p-2.5" style={innerPanelStyle}>
                  {hex && (
                    <span
                      className="w-6 h-6 shrink-0"
                      style={{
                        backgroundColor: hex,
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                  <div>
                    <p className="font-ui text-xs leading-tight" style={{ color: '#AAAAAA' }}>{label}</p>
                    <p className="font-ui text-sm font-medium" style={{ color: '#FFFFFF', textShadow: '1px 1px #000' }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How to find — locations */}
          {fish.locations && fish.locations.length > 0 && (
            <div>
              <p className="font-ui text-xs mb-1.5" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
                How to find
              </p>
              <div className="flex flex-wrap gap-1.5">
                {fish.locations.map((loc, i) => (
                  <span
                    key={i}
                    className="text-xs font-ui px-2.5 py-0.5"
                    style={{
                      background: 'rgba(85,255,85,0.1)',
                      color: '#55FF55',
                      border: '1px solid #55FF55',
                      borderRadius: '1px',
                      textShadow: '1px 1px #000',
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="font-ui text-xs mb-1.5 block" style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}>
              Notes {!caught && <span style={{ color: '#AAAAAA' }}>(catch first to add notes)</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesSave}
              disabled={!caught}
              placeholder="Where did you catch it? Which biome?"
              rows={3}
              className="w-full font-ui text-sm resize-none focus:outline-none transition-colors"
              style={{
                background: '#1a1a1a',
                border: '2px solid #555555',
                borderBottom: '2px solid #222222',
                borderRight: '2px solid #222222',
                borderRadius: '1px',
                padding: '12px',
                color: '#FFFFFF',
                opacity: caught ? 1 : 0.4,
              }}
            />
          </div>

          {/* Fishing Tips */}
          {fishingTips && (
            <div style={darkPanelStyle}>
              <p className="font-minecraft mb-3" style={{ fontSize: '8px', color: '#55FF55', textShadow: '1px 1px #000' }}>
                Fishing Tips
              </p>
              <ul className="space-y-1.5 mb-3">
                {fishingTips.tips.map((tip, i) => (
                  <li key={i} className="font-ui text-xs flex gap-2" style={{ color: '#FFFFFF' }}>
                    <span>🎣</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-ui text-xs font-semibold" style={{ color: '#55FF55', minWidth: '72px' }}>Best time:</span>
                  <span className="font-ui text-xs" style={{ color: '#FFFFFF' }}>{fishingTips.bestTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-ui text-xs font-semibold" style={{ color: '#55FF55', minWidth: '72px' }}>Weather:</span>
                  <span className="font-ui text-xs" style={{ color: '#FFFFFF' }}>{fishingTips.weather}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-ui text-xs font-semibold" style={{ color: '#55FF55', minWidth: '72px' }}>Biomes:</span>
                  <div className="flex flex-wrap gap-1">
                    {fishingTips.biomes.map((biome) => (
                      <span
                        key={biome}
                        className="font-ui text-xs px-1.5 py-0.5"
                        style={{
                          background: 'rgba(85,255,85,0.08)',
                          border: '1px solid #555555',
                          color: '#AAAAAA',
                          borderRadius: '1px',
                        }}
                      >
                        {biome}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Community Notes (comments) — only for caught fish */}
          {caught && (
            <div style={darkPanelStyle}>
              <p className="font-minecraft mb-3" style={{ fontSize: '8px', color: '#55FF55', textShadow: '1px 1px #000' }}>
                Community Notes
              </p>

              {/* Post a comment */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value.slice(0, 200))}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  placeholder="Share a tip or note…"
                  className="flex-1 font-ui text-xs focus:outline-none"
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #555555',
                    borderRadius: '1px',
                    padding: '6px 8px',
                    color: '#FFFFFF',
                  }}
                />
                <button
                  onClick={handlePostComment}
                  disabled={posting || !commentText.trim()}
                  className="mc-btn mc-btn-green"
                  style={{ fontSize: '7px', padding: '6px 10px', opacity: posting || !commentText.trim() ? 0.5 : 1 }}
                >
                  Post
                </button>
              </div>
              <div className="text-right mb-2">
                <span className="font-ui text-xs" style={{ color: '#555555' }}>
                  {commentText.length}/200
                </span>
              </div>

              {/* Comments list */}
              {!commentsLoaded ? (
                <p className="font-ui text-xs" style={{ color: '#AAAAAA' }}>Loading…</p>
              ) : comments.length === 0 ? (
                <p className="font-ui text-xs" style={{ color: '#555555' }}>No community notes yet. Be the first!</p>
              ) : (
                <div className="space-y-2">
                  {displayedComments.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-2 group"
                      style={{
                        borderTop: '1px solid rgba(85,85,85,0.3)',
                        paddingTop: '8px',
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-ui text-xs font-semibold" style={{ color: '#55FF55' }}>
                            {c.username}
                          </span>
                          <span className="font-ui text-xs" style={{ color: '#555555' }}>
                            {timeAgo(c.timestamp)}
                          </span>
                        </div>
                        <p className="font-ui text-xs mt-0.5" style={{ color: '#FFFFFF' }}>{c.text}</p>
                      </div>
                      {user && c.userId === user.uid && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          disabled={deletingId === c.id}
                          className="shrink-0 text-xs"
                          style={{ color: '#555555', background: 'none', border: 'none', cursor: 'pointer', opacity: deletingId === c.id ? 0.5 : 1 }}
                          title="Delete comment"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {comments.length > 5 && (
                    <button
                      onClick={() => setShowAllComments((v) => !v)}
                      className="font-ui text-xs mt-1"
                      style={{ color: '#55FF55', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showAllComments ? 'Show less' : `Show ${comments.length - 5} more`}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            className={`w-full py-3 font-minecraft ${caught ? 'mc-btn mc-btn-red' : 'mc-btn mc-btn-green'}`}
            style={{ fontSize: '8px', width: '100%' }}
          >
            {caught ? '✕  Mark as Not Caught' : '✓  Mark as Caught'}
          </button>
        </div>
      </div>
    </div>
  )
}
