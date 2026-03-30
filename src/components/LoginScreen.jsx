import { useState } from 'react'

export default function LoginScreen({ onSendLink, emailSent, authError, signingIn }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    await onSendLink(email)
  }

  if (signingIn) {
    return (
      <div className="min-h-screen bg-mc-bg flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🎣</div>
        <p className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '9px' }}>
          Signing you in…
        </p>
      </div>
    )
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
            { label: 'Common Fish',    count: 3,      color: 'text-mc-gold'  },
            { label: 'Named Tropical', count: 22,     color: 'text-mc-green' },
            { label: 'All Variants',   count: '3,072', color: 'text-mc-blue'  },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-mc-card border border-mc-border rounded-lg p-3 text-center">
              <div className={`font-minecraft ${color}`} style={{ fontSize: '11px' }}>{count}</div>
              <div className="font-ui text-mc-muted text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="w-full space-y-3">
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
            {authError && (
              <p className="font-ui text-red-400 text-xs">{authError}</p>
            )}
            <button
              type="submit"
              disabled={submitted && !authError}
              className="w-full bg-mc-green hover:bg-green-400 disabled:opacity-50 text-mc-bg font-minecraft py-4 px-6 rounded-lg transition-all duration-150 active:scale-95 shadow-mc"
              style={{ fontSize: '10px' }}
            >
              Send Sign-in Link
            </button>
          </form>
        ) : (
          <div className="w-full bg-mc-card border border-mc-green/40 rounded-xl p-5 text-center space-y-3">
            <div className="text-3xl">📧</div>
            <p className="font-minecraft text-mc-green" style={{ fontSize: '9px' }}>Check your email!</p>
            <p className="font-ui text-mc-muted text-sm">
              We sent a sign-in link to <span className="text-mc-text">{email}</span>.
              Tap the link in the email to sign in — it works on any device.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail('') }}
              className="font-ui text-mc-blue text-xs underline"
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="font-ui text-mc-muted text-xs text-center">
          Your progress syncs across all devices.
        </p>
      </div>
    </div>
  )
}
