import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

// Detect iOS PWA standalone mode (popup doesn't work there)
function isIOSStandalone() {
  return (
    typeof window !== 'undefined' &&
    window.navigator.standalone === true
  )
}

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Handle redirect result on app load (iOS PWA flow)
    getRedirectResult(auth).catch((err) => {
      console.error('Redirect result error:', err)
    })

    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  async function signInWithGoogle() {
    try {
      if (isIOSStandalone()) {
        // iOS PWA: use redirect (popup is blocked)
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (err) {
      console.error('Sign-in error:', err)
    }
  }

  async function signOutUser() {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Sign-out error:', err)
    }
  }

  return { user, signInWithGoogle, signOutUser }
}
