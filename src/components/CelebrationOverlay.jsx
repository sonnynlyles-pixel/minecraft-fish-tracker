import { useEffect, useState } from 'react'

// Small celebration: first catch of a fish
// Medium celebration: named fish caught
// Big celebration: milestone reached

const CONFETTI_COUNT = 30

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function Confetti() {
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    left: `${randomBetween(5, 95)}%`,
    animDelay: `${randomBetween(0, 0.5)}s`,
    color: ['#4ade80', '#fbbf24', '#38bdf8', '#f472b6', '#a78bfa', '#fb923c'][i % 6],
    size: `${randomBetween(6, 12)}px`,
    drift: `${randomBetween(-60, 60)}px`,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall 1.8s ease-in forwards`,
            animationDelay: p.animDelay,
            '--drift': p.drift,
          }}
        />
      ))}
    </div>
  )
}

export default function CelebrationOverlay({ celebration, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!celebration) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, celebration.type === 'small' ? 1500 : 2500)
    return () => clearTimeout(t)
  }, [celebration])

  if (!celebration || !visible) return null

  const isBig = celebration.type === 'milestone'
  const isMedium = celebration.type === 'named'
  const isSmall = celebration.type === 'small'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{ animation: `fadeInOut ${isBig ? 2.5 : 1.8}s ease-in-out forwards` }}
    >
      {(isBig || isMedium) && <Confetti />}

      <div
        className={`relative text-center px-8 py-6 rounded-2xl border shadow-2xl pointer-events-none
          ${isBig ? 'bg-mc-card border-mc-gold' : isMedium ? 'bg-mc-card border-mc-green' : 'bg-mc-card/90 border-mc-border'}`}
        style={{ animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
      >
        {isSmall && (
          <>
            <div style={{ fontSize: '40px', lineHeight: 1 }}>🎉</div>
            <p className="font-ui text-mc-green font-semibold text-sm mt-2">First catch!</p>
          </>
        )}
        {isMedium && (
          <>
            <div style={{ fontSize: '48px', lineHeight: 1 }}>🏆</div>
            <p className="font-minecraft text-mc-gold mt-2" style={{ fontSize: '9px' }}>Named fish!</p>
            <p className="font-ui text-mc-text text-sm mt-1">{celebration.name}</p>
          </>
        )}
        {isBig && (
          <>
            <div style={{ fontSize: '56px', lineHeight: 1 }}>🎊</div>
            <p className="font-minecraft text-mc-gold mt-3" style={{ fontSize: '10px' }}>
              {celebration.message}
            </p>
            <p className="font-ui text-mc-muted text-xs mt-1">{celebration.sub}</p>
          </>
        )}
      </div>
    </div>
  )
}
