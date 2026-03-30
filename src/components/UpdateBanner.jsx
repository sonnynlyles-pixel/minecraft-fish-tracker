import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every 60 seconds
      if (r) setInterval(() => r.update(), 60 * 1000)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-mc-card border border-mc-green rounded-xl p-4 shadow-mc flex items-center justify-between gap-3">
      <p className="font-ui text-mc-text text-sm">
        🎣 New update available!
      </p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="shrink-0 bg-mc-green text-mc-bg font-minecraft px-3 py-2 rounded-lg text-xs active:scale-95 transition-transform"
      >
        Update
      </button>
    </div>
  )
}
