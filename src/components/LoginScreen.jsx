import { useState } from 'react'
import OceanBackground from './OceanBackground'

export default function LoginScreen({ onSignIn, onSignUp, authError, loading }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'signin') {
      await onSignIn(email, password)
    } else {
      await onSignUp(email, password)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ position: 'relative' }}>
      <OceanBackground />
      <div className="flex flex-col items-center gap-8 max-w-sm w-full" style={{ position: 'relative', zIndex: 1 }}>
        <div className="w-full flex flex-col items-center gap-8 bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10">

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

        {/* Tab toggle */}
        <div className="w-full flex bg-mc-surface border border-mc-border rounded-lg p-1 gap-1">
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-md font-minecraft transition-all text-center
                ${mode === m
                  ? 'bg-mc-green text-mc-bg'
                  : 'text-mc-muted hover:text-mc-text'
                }`}
              style={{ fontSize: '8px' }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div>
            <label className="font-ui text-mc-muted text-xs mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-mc-card border border-mc-border rounded-lg px-4 py-3 font-ui text-sm text-mc-text placeholder:text-mc-muted/50 focus:outline-none focus:border-mc-green"
            />
          </div>
          <div>
            <label className="font-ui text-mc-muted text-xs mb-1.5 block">
              Password {mode === 'signup' && <span className="text-mc-muted">(min 6 characters)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-mc-card border border-mc-border rounded-lg px-4 py-3 font-ui text-sm text-mc-text placeholder:text-mc-muted/50 focus:outline-none focus:border-mc-green"
            />
          </div>

          {authError && (
            <p className="font-ui text-red-400 text-xs">{authError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mc-green hover:bg-green-400 disabled:opacity-50 text-mc-bg font-minecraft py-4 px-6 rounded-lg transition-all active:scale-95 shadow-mc"
            style={{ fontSize: '10px' }}
          >
            {loading
              ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <p className="font-ui text-mc-muted text-xs text-center">
          Your progress syncs across all devices.
        </p>
        </div>
      </div>
    </div>
  )
}
