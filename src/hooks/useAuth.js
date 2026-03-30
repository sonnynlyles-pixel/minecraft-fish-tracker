import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined)
  const [authError, setAuthError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  async function signIn(email, password) {
    setAuthError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setAuthError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email, password) {
    setAuthError(null)
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setAuthError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return { user, authError, loading, signIn, signUp, signOutUser }
}

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
