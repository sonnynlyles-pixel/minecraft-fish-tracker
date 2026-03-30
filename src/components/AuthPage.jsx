import { useEffect, useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

// This page is opened in a regular Safari tab from the iOS PWA.
// It signs in via popup (works fine in Safari), then closes itself.
export default function AuthPage() {
  const [status, setStatus] = useState('signing-in')

  useEffect(() => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        setStatus('success')
        // Give IndexedDB a moment to persist, then close
        setTimeout(() => window.close(), 1000)
      })
      .catch((err) => {
        console.error(err)
        setStatus('error')
      })
  }, [])

  return (
    <div className="min-h-screen bg-mc-bg flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-5xl">🎣</div>
      {status === 'signing-in' && (
        <p className="font-minecraft text-mc-green text-center animate-pulse" style={{ fontSize: '9px' }}>
          Signing in…
        </p>
      )}
      {status === 'success' && (
        <p className="font-minecraft text-mc-green text-center" style={{ fontSize: '9px' }}>
          Signed in! Go back to the app.
        </p>
      )}
      {status === 'error' && (
        <div className="text-center space-y-3">
          <p className="font-minecraft text-red-400" style={{ fontSize: '9px' }}>Sign-in failed.</p>
          <button
            onClick={() => window.location.reload()}
            className="font-ui text-mc-blue text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
