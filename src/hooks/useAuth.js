import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

const APP_URL = import.meta.env.VITE_APP_DOMAIN
  ? `https://${import.meta.env.VITE_APP_DOMAIN}`
  : window.location.origin

const ACTION_CODE_SETTINGS = {
  url: APP_URL,
  handleCodeInApp: true,
}

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [emailSent, setEmailSent] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    // Handle magic link click (when user taps the link in their email)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn')
      if (email) {
        setSigningIn(true)
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
            // Clean up the URL
            window.history.replaceState({}, document.title, '/')
          })
          .catch((err) => {
            console.error('Magic link sign-in error:', err)
            setAuthError('Sign-in link expired or already used. Please request a new one.')
          })
          .finally(() => setSigningIn(false))
      }
    }

    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  async function sendMagicLink(email) {
    setAuthError(null)
    try {
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS)
      window.localStorage.setItem('emailForSignIn', email)
      setEmailSent(true)
    } catch (err) {
      console.error('Send magic link error:', err)
      setAuthError('Failed to send email. Please check the address and try again.')
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

  return { user, emailSent, authError, signingIn, sendMagicLink, signOutUser }
}
