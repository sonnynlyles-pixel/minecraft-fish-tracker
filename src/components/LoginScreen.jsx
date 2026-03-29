export default function LoginScreen({ onSignIn }) {
  return (
    <div className="min-h-screen bg-mc-bg flex flex-col items-center justify-center p-6">
      {/* Animated water background dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-mc-blue opacity-5"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl">🎣</div>
          <h1 className="font-minecraft text-mc-green text-center leading-relaxed" style={{ fontSize: '14px' }}>
            Minecraft<br />Fish Tracker
          </h1>
          <p className="font-ui text-mc-muted text-sm text-center">
            Track all 3,075 fish across every Minecraft world.
          </p>
        </div>

        {/* Stats preview */}
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { label: 'Common Fish', count: 3, color: 'text-mc-gold' },
            { label: 'Named Tropical', count: 22, color: 'text-mc-green' },
            { label: 'All Variants', count: '3,072', color: 'text-mc-blue' },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-mc-card border border-mc-border rounded-lg p-3 text-center">
              <div className={`font-minecraft ${color}`} style={{ fontSize: '11px' }}>{count}</div>
              <div className="font-ui text-mc-muted text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Sign in button */}
        <button
          onClick={onSignIn}
          className="w-full bg-mc-green hover:bg-green-400 text-mc-bg font-minecraft py-4 px-6 rounded-lg transition-all duration-150 active:scale-95 shadow-mc"
          style={{ fontSize: '10px' }}
        >
          Sign in with Google
        </button>

        <p className="font-ui text-mc-muted text-xs text-center">
          Your progress syncs across all devices.
        </p>
      </div>
    </div>
  )
}
