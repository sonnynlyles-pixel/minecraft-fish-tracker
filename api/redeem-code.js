import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function initAdmin() {
  if (getApps().length) return
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  initializeApp({ credential: cert(serviceAccount) })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Missing code' })

  try {
    initAdmin()
    const db = getFirestore()
    const ref = db.collection('pendingAuth').doc(code.toUpperCase())
    const snap = await ref.get()

    if (!snap.exists) return res.status(404).json({ error: 'Code not found or already used' })

    const data = snap.data()
    if (new Date() > data.expiresAt.toDate()) {
      await ref.delete()
      return res.status(410).json({ error: 'Code expired — request a new sign-in link' })
    }

    await ref.delete() // single use
    res.json({ customToken: data.customToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
