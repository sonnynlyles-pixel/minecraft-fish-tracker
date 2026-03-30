import { useState, useMemo, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import { useHaptic } from './hooks/useHaptic'
import { useUserProfile } from './hooks/useUserProfile'
import { COMMON_FISH, getTropicalFish, TOTAL_FISH } from './data/fish'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import CategorySection from './components/CategorySection'
import FishModal from './components/FishModal'
import ResetModal from './components/ResetModal'
import UpdateBanner from './components/UpdateBanner'
import StatsScreen from './components/StatsScreen'
import ProfileScreen from './components/ProfileScreen'
import FriendsScreen from './components/FriendsScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import CelebrationOverlay from './components/CelebrationOverlay'

// Milestone thresholds (percentage of total fish)
const MILESTONES = [25, 50, 75, 100]

export default function App() {
  const { user, authError, loading, signIn, signUp, signOutUser } = useAuth()
  const { progress, loading: progressLoading, catchFish, uncatchFish, updateNotes, resetAll } = useProgress(user?.uid)
  const { trigger } = useHaptic()
  const { profile, setUsername, usernameError } = useUserProfile(user ?? null)

  const [modalFish, setModalFish] = useState(null)
  const [showReset, setShowReset] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showFriends, setShowFriends] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [celebration, setCelebration] = useState(null)

  // Track which milestones have already been triggered this session
  const seenMilestones = useRef(new Set())

  const tropicalFish = useMemo(() => getTropicalFish(), [])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-mc-bg flex items-center justify-center">
        <div className="font-minecraft text-mc-green animate-pulse" style={{ fontSize: '9px' }}>Loading…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginScreen
        onSignIn={signIn}
        onSignUp={signUp}
        authError={authError}
        loading={loading}
      />
    )
  }

  function checkMilestone(newProgress) {
    const caughtCount = Object.keys(newProgress).length
    const pct = (caughtCount / TOTAL_FISH) * 100
    for (const m of MILESTONES) {
      if (pct >= m && !seenMilestones.current.has(m)) {
        seenMilestones.current.add(m)
        return {
          type: 'milestone',
          message: m === 100 ? 'COMPLETE!' : `${m}% Milestone!`,
          sub: m === 100 ? 'You caught all the fish!' : `${caughtCount} fish caught`,
        }
      }
    }
    return null
  }

  async function handleToggle(fish) {
    if (progress[fish.id]) {
      await uncatchFish(fish.id)
    } else {
      trigger('medium')
      await catchFish(fish.id)

      // Build updated progress snapshot for milestone check
      const newProgress = { ...progress, [fish.id]: { caughtAt: new Date().toISOString() } }

      // Priority: milestone > named > first catch
      const milestone = checkMilestone(newProgress)
      if (milestone) {
        setCelebration(milestone)
      } else if (fish.isNamed) {
        setCelebration({ type: 'named', name: fish.name })
      } else {
        setCelebration({ type: 'small' })
      }
    }
  }

  async function handleReset() {
    await resetAll()
    setShowReset(false)
    seenMilestones.current.clear()
  }

  return (
    <div className="min-h-screen bg-mc-bg text-mc-text">
      <Header
        user={user}
        progress={progress}
        onSignOut={signOutUser}
        onResetClick={() => setShowReset(true)}
        onStatsClick={() => setShowStats(true)}
        onProfileClick={() => setShowProfile(true)}
        onLeaderboardClick={() => setShowLeaderboard(true)}
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

      {showStats && (
        <StatsScreen
          progress={progress}
          onClose={() => setShowStats(false)}
        />
      )}

      {showProfile && (
        <ProfileScreen
          user={user}
          progress={progress}
          onSignOut={signOutUser}
          onClose={() => setShowProfile(false)}
          profile={profile}
          setUsername={setUsername}
          usernameError={usernameError}
          onFriendsClick={() => { setShowProfile(false); setShowFriends(true) }}
        />
      )}

      {showFriends && (
        <FriendsScreen
          onClose={() => setShowFriends(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardScreen
          currentUserId={user.uid}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {celebration && (
        <CelebrationOverlay
          celebration={celebration}
          onDismiss={() => setCelebration(null)}
        />
      )}

      <UpdateBanner />
    </div>
  )
}
