import { useState, useMemo } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import { COMMON_FISH, getTropicalFish } from './data/fish'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import CategorySection from './components/CategorySection'
import FishModal from './components/FishModal'
import ResetModal from './components/ResetModal'

export default function App() {
  const { user, signInWithGoogle, signOutUser } = useAuth()
  const { progress, loading, catchFish, uncatchFish, updateNotes, resetAll } = useProgress(user?.uid)

  const [modalFish, setModalFish] = useState(null)
  const [showReset, setShowReset] = useState(false)

  const tropicalFish = useMemo(() => getTropicalFish(), [])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '9px' }}>Loading…</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onSignIn={signInWithGoogle} />
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleToggle(fish) {
    if (progress[fish.id]) {
      await uncatchFish(fish.id)
    } else {
      await catchFish(fish.id)
    }
  }

  async function handleReset() {
    await resetAll()
    setShowReset(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-mc-bg text-mc-text">
      <Header
        user={user}
        progress={progress}
        onSignOut={signOutUser}
        onResetClick={() => setShowReset(true)}
      />

      <main className="px-4 py-4 pb-safe max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '9px' }}>
              Loading progress…
            </div>
          </div>
        ) : (
          <>
            <CategorySection
              title="Common Fish"
              icon="🐟"
              fish={COMMON_FISH}
              progress={progress}
              onToggle={handleToggle}
              onOpenModal={setModalFish}
              showFilters={false}
            />
            <CategorySection
              title="Tropical Fish"
              icon="🐠"
              fish={tropicalFish}
              progress={progress}
              onToggle={handleToggle}
              onOpenModal={setModalFish}
              showFilters={true}
            />
          </>
        )}
      </main>

      {/* Fish detail modal */}
      {modalFish && (
        <FishModal
          fish={modalFish}
          entry={progress[modalFish.id]}
          onClose={() => setModalFish(null)}
          onToggle={async (f) => {
            await handleToggle(f)
          }}
          onSaveNotes={updateNotes}
        />
      )}

      {/* Reset confirmation */}
      {showReset && (
        <ResetModal
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  )
}
