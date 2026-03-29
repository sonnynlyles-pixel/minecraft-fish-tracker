import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

// progress shape: { [fishId]: { caughtAt: ISO string, notes: string } }

export function useProgress(userId) {
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setProgress({})
      setLoading(false)
      return
    }
    setLoading(true)
    const ref = doc(db, 'progress', userId)
    const unsub = onSnapshot(ref, (snap) => {
      setProgress(snap.exists() ? (snap.data().catches ?? {}) : {})
      setLoading(false)
    })
    return unsub
  }, [userId])

  const save = useCallback(async (newProgress) => {
    if (!userId) return
    const ref = doc(db, 'progress', userId)
    await setDoc(ref, { catches: newProgress }, { merge: false })
  }, [userId])

  const catchFish = useCallback(async (fishId, notes = '') => {
    const updated = {
      ...progress,
      [fishId]: { caughtAt: new Date().toISOString(), notes },
    }
    setProgress(updated)
    await save(updated)
  }, [progress, save])

  const uncatchFish = useCallback(async (fishId) => {
    const updated = { ...progress }
    delete updated[fishId]
    setProgress(updated)
    await save(updated)
  }, [progress, save])

  const updateNotes = useCallback(async (fishId, notes) => {
    if (!progress[fishId]) return
    const updated = {
      ...progress,
      [fishId]: { ...progress[fishId], notes },
    }
    setProgress(updated)
    await save(updated)
  }, [progress, save])

  const resetAll = useCallback(async () => {
    setProgress({})
    if (!userId) return
    const ref = doc(db, 'progress', userId)
    await deleteDoc(ref)
  }, [userId])

  return { progress, loading, catchFish, uncatchFish, updateNotes, resetAll }
}
