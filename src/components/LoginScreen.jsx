import { useState } from 'react'

export default function LoginScreen({ onSendLink, onSignInWithCode, emailSent, authError, codeError, loading }) {
  const [email, setEmail]     = useState('')
  const [code, setCode]       = useState('')
  const [showCode, setShowCode] = useState(false)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email) return
    await onSendLink(email)
  }

  async function handleCodeSubmit(e) {
    e.preventDefault()
    if (!code) return
    await onSignInWithCode(code)
  }

  return (
    <div className="min-h-screen bg-mc-bg flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl">🎣</div>
          <h1 className="font-minecraft text-mc-green text-center leading-relaxed" style={{ fontSize: '14px' }}>
            Minecraft<br />Fish Tracker
          </h1>
          <p className="font-ui text-mc-muted text-sm text-center">
            Track all 3,075 fish across every Minecraft world.
          </p>
        </div>

        {/* Stats */}
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { label: 'Common Fish',    count: 3,       color: 'text-mc-gold'  },
            { label: 'Named Tropical', count: 22,      color: 'text-mc-green' },
            { label: 'All Variants',   count: '3,072', color: 'text-mc-blue'  },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-mc-card border border-mc-border rounded-lg p-3 text-center">
              <div className={`font-minecraft ${color}`} style={{ fontSize: '11px' }}>{count}</div>
              <div className="font-ui text-mc-muted text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Email sent confirmation ── */}
        {emailSent && !showCode ? (
          <div className="w-full bg-mc-card border border-mc-green/40 rounded-xl p-5 text-center space-y-4">
            <div className="text-3xl">📧</div>
            <p className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>Check your email!</p>
            <p className="font-ui text-mc-muted text-sm">
              Tap the link in the email. Safari will open and show you a <strong className="text-mc-text">6-letter code</strong>.
              Come back here and tap "Have a code?" to enter it.
            </p>
            <button
              onClick={() => setShowCode(true)}
              className="w-full bg-mc-green text-mc-bg font-minecraft py-3 rounded-lg active:scale-95 transition-transform"
              style={{ fontSize: '9px' }}
            >
              Have a code?
            </button>
            <button
              onClick={() => window.location.reload()}
              className="font-ui text-mc-muted text-xs underline"
            >
              Start over
            </button>
          </div>

        ) : showCode ? (
          /* ── Code entry ── */
          <form onSubmit={handleCodeSubmit} className="w-full space-y-3">
            <div>
              <label className="font-ui text-mc-muted text-xs mb-1.5 block">
                Enter the 6-letter code from Safari
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="ABC123"
                maxLength={6}
                autoFocus
                className="w-full bg-mc-card border border-mc-border rounded-lg px-4 py-4 font-minecraft text-mc-green text-center text-2xl tracking-widest placeholder:text-mc-muted/30 focus:outline-none focus:border-mc-green"
              />
            </div>
            {codeError && <p className="font-ui text-red-400 text-xs">{codeError}</p>}
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-mc-green hover:bg-green-400 disabled:opacity-50 text-mc-bg font-minecraft py-4 rounded-lg transition-all active:scale-95 shadow-mc"
              style={{ fontSize: '10px' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setShowCode(false)}
              className="w-full font-ui text-mc-muted text-xs underline"
            >
              Back
            </button>
          </form>

        ) : (
          /* ── Email form ── */
          <form onSubmit={handleEmailSubmit} className="w-full space-y-3">
            <div>
              <label className="font-ui text-mc-muted text-xs mb-1.5 block">
                Enter your email to sign in
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-mc-card border border-mc-border rounded-lg px-4 py-3 font-ui text-sm text-mc-text placeholder:text-mc-muted/50 focus:outline-none focus:border-mc-green"
              />
            </div>
            {authError && <p className="font-ui text-red-400 text-xs">{authError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mc-green hover:bg-green-400 disabled:opacity-50 text-mc-bg font-minecraft py-4 px-6 rounded-lg transition-all active:scale-95 shadow-mc"
              style={{ fontSize: '10px' }}
            >
              {loading ? 'Sending…' : 'Send Sign-in Link'}
            </button>
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="w-full font-ui text-mc-muted text-xs underline"
            >
              Already have a code?
            </button>
          </form>
        )}

        <p className="font-ui text-mc-muted text-xs text-center">
          Your progress syncs across all devices.
        </p>
      </div>
    </div>
  )
}
