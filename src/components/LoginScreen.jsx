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

  const inputStyle = {
    width: '100%',
    background: '#1a1a1a',
    border: '2px solid #555555',
    borderBottom: '2px solid #222222',
    borderRight: '2px solid #222222',
    borderRadius: '1px',
    padding: '12px 16px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    outline: 'none',
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ position: 'relative' }}>
      <OceanBackground />
      {/* No overlay on login so the ocean is fully visible */}
      <div className="flex flex-col items-center gap-8 max-w-sm w-full" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="w-full flex flex-col items-center gap-8 p-6"
          style={{
            background: 'rgba(0,0,0,0.85)',
            border: '2px solid #555555',
            borderBottom: '2px solid #222222',
            borderRight: '2px solid #222222',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            borderRadius: '2px',
          }}
        >

          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🎣</div>
            <h1
              className="font-minecraft text-center leading-relaxed"
              style={{
                fontSize: '14px',
                color: '#55FF55',
                textShadow: '2px 2px #2D7A2D',
              }}
            >
              Minecraft<br />Fish Tracker
            </h1>
            <p
              className="font-ui text-sm text-center"
              style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}
            >
              Track all 3,075 fish across every Minecraft world.
            </p>
          </div>

          {/* Stats */}
          <div className="w-full grid grid-cols-3 gap-3">
            {[
              { label: 'Common Fish',    count: 3,       color: '#FFAA00' },
              { label: 'Named Tropical', count: 22,      color: '#55FF55' },
              { label: 'All Variants',   count: '3,072', color: '#55FFFF' },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                className="p-3 text-center"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #555555',
                  borderBottom: '1px solid #222222',
                  borderRight: '1px solid #222222',
                  borderRadius: '1px',
                }}
              >
                <div
                  className="font-minecraft"
                  style={{ fontSize: '11px', color, textShadow: '1px 1px #000' }}
                >
                  {count}
                </div>
                <div
                  className="font-ui text-xs mt-1"
                  style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Tab toggle — Minecraft inventory tab style */}
          <div className="w-full flex gap-1">
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 font-minecraft text-center transition-all"
                style={{
                  fontSize: '8px',
                  background: mode === m ? '#2D7A2D' : '#2a2a2a',
                  border: mode === m
                    ? '2px solid #55FF55'
                    : '2px solid #555555',
                  borderBottom: mode === m ? '2px solid #55FF55' : '2px solid #222222',
                  borderRight: mode === m ? '2px solid #55FF55' : '2px solid #222222',
                  color: mode === m ? '#55FF55' : '#AAAAAA',
                  textShadow: '1px 1px #000',
                  borderRadius: '1px',
                  cursor: 'pointer',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div>
              <label
                className="font-ui text-xs mb-1.5 block"
                style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoCapitalize="none"
                autoCorrect="off"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="font-ui text-xs mb-1.5 block"
                style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}
              >
                Password {mode === 'signup' && <span style={{ color: '#AAAAAA' }}>(min 6 characters)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {authError && (
              <p className="font-ui text-xs" style={{ color: '#FF5555', textShadow: '1px 1px #000' }}>
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mc-btn mc-btn-green w-full"
              style={{ fontSize: '10px', padding: '16px', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading
                ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          <p
            className="font-ui text-xs text-center"
            style={{ color: '#AAAAAA', textShadow: '1px 1px #000' }}
          >
            Your progress syncs across all devices.
          </p>
        </div>
      </div>
    </div>
  )
}
