import { useState, useEffect, useCallback } from 'react'
import {
  onSnapshot,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useFriends(currentUser, currentProfile) {
  const [friends, setFriends] = useState([])
  const [pendingReceived, setPendingReceived] = useState([])
  const [pendingSent, setPendingSent] = useState([])
  const [loading, setLoading] = useState(true)

  const uid = currentUser?.uid

  useEffect(() => {
    if (!uid) {
      setFriends([])
      setPendingReceived([])
      setPendingSent([])
      setLoading(false)
      return
    }

    setLoading(true)
    let loadedCount = 0
    const total = 3

    function maybeSetLoaded() {
      loadedCount++
      if (loadedCount >= total) setLoading(false)
    }

    // 1. Friends subcollection
    const friendsUnsub = onSnapshot(
      collection(db, 'users', uid, 'friends'),
      (snap) => {
        setFriends(snap.docs.map((d) => ({ ...d.data() })))
        maybeSetLoaded()
      },
      () => {
        setFriends([])
        maybeSetLoaded()
      }
    )

    // 2. Pending received requests
    const receivedUnsub = onSnapshot(
      query(
        collection(db, 'friendRequests'),
        where('toUid', '==', uid),
        where('status', '==', 'pending')
      ),
      (snap) => {
        setPendingReceived(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        maybeSetLoaded()
      },
      () => {
        setPendingReceived([])
        maybeSetLoaded()
      }
    )

    // 3. Pending sent requests
    const sentUnsub = onSnapshot(
      query(
        collection(db, 'friendRequests'),
        where('fromUid', '==', uid),
        where('status', '==', 'pending')
      ),
      (snap) => {
        setPendingSent(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        maybeSetLoaded()
      },
      () => {
        setPendingSent([])
        maybeSetLoaded()
      }
    )

    return () => {
      friendsUnsub()
      receivedUnsub()
      sentUnsub()
    }
  }, [uid])

  const sendFriendRequest = useCallback(
    async (targetUser) => {
      if (!uid || !currentProfile?.username) return { error: 'Not logged in or no username set.' }

      // Check not already friends
      if (friends.some((f) => f.uid === targetUser.uid)) {
        return { error: 'Already friends.' }
      }

      // Check no pending request either direction
      if (pendingSent.some((r) => r.toUid === targetUser.uid)) {
        return { error: 'Request already sent.' }
      }
      if (pendingReceived.some((r) => r.fromUid === targetUser.uid)) {
        return { error: 'They already sent you a request. Accept it instead.' }
      }

      try {
        const requestId = `${uid}_${targetUser.uid}`
        await setDoc(doc(db, 'friendRequests', requestId), {
          fromUid: uid,
          fromUsername: currentProfile.username,
          toUid: targetUser.uid,
          toUsername: targetUser.username,
          status: 'pending',
          createdAt: new Date().toISOString(),
        })
        return { success: true }
      } catch (err) {
        return { error: 'Failed to send request.' }
      }
    },
    [uid, currentProfile, friends, pendingSent, pendingReceived]
  )

  const acceptRequest = useCallback(
    async (request) => {
      if (!uid || !currentProfile?.username) return
      try {
        // Update request status
        await updateDoc(doc(db, 'friendRequests', request.id), { status: 'accepted' })

        const now = new Date().toISOString()

        // Add to both users' friends subcollections
        await setDoc(doc(db, 'users', uid, 'friends', request.fromUid), {
          uid: request.fromUid,
          username: request.fromUsername,
          addedAt: now,
        })
        await setDoc(doc(db, 'users', request.fromUid, 'friends', uid), {
          uid,
          username: currentProfile.username,
          addedAt: now,
        })
      } catch (err) {
        console.error('acceptRequest error:', err)
      }
    },
    [uid, currentProfile]
  )

  const declineRequest = useCallback(async (request) => {
    try {
      await updateDoc(doc(db, 'friendRequests', request.id), { status: 'declined' })
    } catch (err) {
      console.error('declineRequest error:', err)
    }
  }, [])

  const removeFriend = useCallback(
    async (friendUid) => {
      if (!uid) return
      try {
        await deleteDoc(doc(db, 'users', uid, 'friends', friendUid))
        await deleteDoc(doc(db, 'users', friendUid, 'friends', uid))
      } catch (err) {
        console.error('removeFriend error:', err)
      }
    },
    [uid]
  )

  return {
    friends,
    pendingReceived,
    pendingSent,
    loading,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
  }
}
