import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider)
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
