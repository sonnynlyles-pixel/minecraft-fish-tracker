import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithCustomToken,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

const APP_URL = import.meta.env.VITE_APP_DOMAIN
  ? `https://${import.meta.env.VITE_APP_DOMAIN}`
  : window.location.origin

// Magic link goes to /auth.html (opens in Safari), NOT back to the PWA
const ACTION_CODE_SETTINGS = {
  url: `${APP_URL}/auth.html`,
  handleCodeInApp: true,
}

export function useAuth() {
  const [user, setUser] = useState(undefined)
  const [emailSent, setEmailSent] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  async function sendMagicLink(email) {
    setAuthError(null)
    setLoading(true)
    try {
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS)
      window.localStorage.setItem('emailForSignIn', email)
      setEmailSent(true)
    } catch (err) {
      console.error('Send magic link error:', err)
      setAuthError('Failed to send email. Please check the address and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function signInWithCode(code) {
    setCodeError(null)
    setLoading(true)
    try {
      const resp = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Invalid code')
      await signInWithCustomToken(auth, data.customToken)
    } catch (err) {
      console.error('Code sign-in error:', err)
      setCodeError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function signOutUser() {
    try {
      await signOut(auth)
      setEmailSent(false)
    } catch (err) {
      console.error('Sign-out error:', err)
    }
  }

  return {
    user,
    emailSent,
    authError,
    codeError,
    loading,
    sendMagicLink,
    signInWithCode,
    signOutUser,
  }
}
