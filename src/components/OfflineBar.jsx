import { useState, useEffect, useRef } from 'react'

export default function OfflineBar({ isOnline }) {
  // Track whether we've gone offline at least once, to show back-online message
  const [showBackOnline, setShowBackOnline] = useState(false)
  const backOnlineTimer = useRef(null)
  const wasOffline = useRef(false)

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true
      setShowBackOnline(false)
      if (backOnlineTimer.current) {
        clearTimeout(backOnlineTimer.current)
        backOnlineTimer.current = null
      }
    } else if (wasOffline.current) {
      setShowBackOnline(true)
      backOnlineTimer.current = setTimeout(() => {
        setShowBackOnline(false)
      }, 3000)
    }
    return () => {
      if (backOnlineTimer.current) clearTimeout(backOnlineTimer.current)
    }
  }, [isOnline])

  // Not offline and not showing back-online — render nothing
  if (isOnline && !showBackOnline) return null

  if (showBackOnline) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'rgba(21,128,61,0.92)',
          borderBottom: '1px solid #16a34a',
          textAlign: 'center',
          padding: '8px 16px',
          animation: 'slideDownFade 0.3s ease-out forwards',
        }}
      >
        <span className="font-ui text-xs" style={{ color: '#bbf7d0' }}>
          ✓ Back online!
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(127,29,29,0.90)',
        borderBottom: '1px solid #ef4444',
        textAlign: 'center',
        padding: '8px 16px',
        animation: 'slideDown 0.3s ease-out forwards',
      }}
    >
      <span className="font-ui text-xs" style={{ color: '#fecaca' }}>
        ⚠️ No internet connection — changes will sync when reconnected
      </span>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes slideDownFade {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  )
}
