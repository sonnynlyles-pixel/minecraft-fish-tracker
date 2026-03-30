import { useState, useEffect, useCallback } from 'react'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useUserProfile(user) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usernameError, setUsernameError] = useState(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function initProfile() {
      setLoading(true)
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setProfile(snap.data())
      } else {
        const newProfile = {
          email: user.email,
          username: null,
          joinedAt: new Date().toISOString(),
        }
        await setDoc(ref, newProfile)
        setProfile(newProfile)
      }
      setLoading(false)
    }

    initProfile()
  }, [user])

  const setUsername = useCallback(
    async (username) => {
      setUsernameError(null)

      // Validate format
      if (!username || username.length < 3 || username.length > 20) {
        setUsernameError('Username must be 3–20 characters.')
        return false
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameError('Only letters, numbers, and underscores allowed.')
        return false
      }

      // Check uniqueness
      try {
        const q = query(
          collection(db, 'users'),
          where('username', '==', username)
        )
        const snap = await getDocs(q)
        const takenByOther = snap.docs.some((d) => d.id !== user.uid)
        if (takenByOther) {
          setUsernameError('That username is already taken.')
          return false
        }

        const ref = doc(db, 'users', user.uid)
        const updated = { ...profile, username }
        await setDoc(ref, updated, { merge: true })
        setProfile(updated)
        return true
      } catch (err) {
        setUsernameError('Failed to save username. Please try again.')
        return false
      }
    },
    [user, profile]
  )

  return { profile, loading, setUsername, usernameError }
}
