import { useState, useMemo } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import { COMMON_FISH, getTropicalFish } from './data/fish'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import CategorySection from './components/CategorySection'
import FishModal from './components/FishModal'
import ResetModal from './components/ResetModal'
import UpdateBanner from './components/UpdateBanner'

export default function App() {
  const { user, emailSent, authError, codeError, loading, sendMagicLink, signInWithCode, signOutUser } = useAuth()
  const { progress, loading: progressLoading, catchFish, uncatchFish, updateNotes, resetAll } = useProgress(user?.uid)

  const [modalFish, setModalFish] = useState(null)
  const [showReset, setShowReset] = useState(false)

  const tropicalFish = useMemo(() => getTropicalFish(), [])

  // Loading
  if (user === undefined || signingIn) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '9px' }}>Loading…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginScreen
        onSendLink={sendMagicLink}
        onSignInWithCode={signInWithCode}
        emailSent={emailSent}
        authError={authError}
        codeError={codeError}
        loading={loading}
      />
    )
  }

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

  return (
    <div className="min-h-screen bg-mc-bg text-mc-text">
      <Header
        user={user}
        progress={progress}
        onSignOut={signOutUser}
        onResetClick={() => setShowReset(true)}
      />

      <main className="px-4 py-4 pb-safe max-w-2xl mx-auto">
        {progressLoading ? (
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

      {modalFish && (
        <FishModal
          fish={modalFish}
          entry={progress[modalFish.id]}
          onClose={() => setModalFish(null)}
          onToggle={handleToggle}
          onSaveNotes={updateNotes}
        />
      )}

      {showReset && (
        <ResetModal
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}

      <UpdateBanner />
    </div>
  )
}
