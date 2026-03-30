import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initAdmin() {
  if (getApps().length) return
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  initializeApp({ credential: cert(serviceAccount) })
}

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { idToken } = req.body
  if (!idToken) return res.status(400).json({ error: 'Missing idToken' })

  try {
    initAdmin()
    const decoded = await getAuth().verifyIdToken(idToken)
    const customToken = await getAuth().createCustomToken(decoded.uid)

    const code = randomCode()
    const db = getFirestore()
    await db.collection('pendingAuth').doc(code).set({
      customToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    })

    res.json({ code })
  } catch (err) {
    console.error(err)
    res.status(401).json({ error: 'Invalid token' })
  }
}
