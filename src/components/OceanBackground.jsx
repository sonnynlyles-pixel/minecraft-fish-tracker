export default function OceanBackground() {
  // Fish: { id, color, top, duration, delay, rtl, size }
  const fish = [
    { id: 1, color: '#F9801D', top: '15%', duration: 22,  delay: 0,   rtl: false, size: 28 },
    { id: 2, color: '#3AB3DA', top: '30%', duration: 18,  delay: 4,   rtl: true,  size: 22 },
    { id: 3, color: '#FED83D', top: '45%', duration: 26,  delay: 8,   rtl: false, size: 24 },
    { id: 4, color: '#F38BAA', top: '55%', duration: 20,  delay: 2,   rtl: true,  size: 20 },
    { id: 5, color: '#80C71F', top: '65%', duration: 30,  delay: 12,  rtl: false, size: 26 },
    { id: 6, color: '#F9801D', top: '75%', duration: 17,  delay: 6,   rtl: true,  size: 32 },
    { id: 7, color: '#3AB3DA', top: '38%', duration: 24,  delay: 15,  rtl: false, size: 20 },
    { id: 8, color: '#FED83D', top: '70%', duration: 21,  delay: 9,   rtl: true,  size: 24 },
  ]

  // Bubbles: { id, left, duration, delay, size }
  const bubbles = [
    { id: 1,  left: '8%',  duration: 12, delay: 0,   size: 5 },
    { id: 2,  left: '18%', duration: 16, delay: 3,   size: 4 },
    { id: 3,  left: '27%', duration: 10, delay: 7,   size: 6 },
    { id: 4,  left: '38%', duration: 14, delay: 1,   size: 4 },
    { id: 5,  left: '48%', duration: 18, delay: 5,   size: 7 },
    { id: 6,  left: '58%', duration: 11, delay: 9,   size: 5 },
    { id: 7,  left: '67%', duration: 15, delay: 2,   size: 4 },
    { id: 8,  left: '76%', duration: 13, delay: 6,   size: 6 },
    { id: 9,  left: '85%', duration: 17, delay: 4,   size: 5 },
    { id: 10, left: '93%', duration: 12, delay: 8,   size: 4 },
  ]

  // Seaweed: { id, left, height, delay }
  const seaweed = [
    { id: 1, left: '5%',  height: 60, delay: 0   },
    { id: 2, left: '20%', height: 80, delay: 0.8 },
    { id: 3, left: '45%', height: 55, delay: 0.3 },
    { id: 4, left: '70%', height: 70, delay: 1.1 },
    { id: 5, left: '88%', height: 65, delay: 0.5 },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Sky gradient — top 40% */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, #0a1628 0%, #1a3a5c 100%)',
        }}
      />

      {/* Ocean water — bottom 60% */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, #0d4f6e 0%, #0a2a3a 100%)',
        }}
      />

      {/* Wave layer 1 (slower) */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(40% - 18px)',
          left: 0,
          width: '200%',
          height: '36px',
          animation: 'waveSlide1 8s linear infinite',
        }}
      >
        <svg
          viewBox="0 0 1440 36"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,18 C120,36 240,0 360,18 C480,36 600,0 720,18 C840,36 960,0 1080,18 C1200,36 1320,0 1440,18 L1440,36 L0,36 Z"
            fill="#0d4f6e"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* Wave layer 2 (faster, slightly lighter) */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(40% - 12px)',
          left: 0,
          width: '200%',
          height: '28px',
          animation: 'waveSlide2 5s linear infinite',
        }}
      >
        <svg
          viewBox="0 0 1440 28"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,14 C90,28 180,0 270,14 C360,28 450,0 540,14 C630,28 720,0 810,14 C900,28 990,0 1080,14 C1170,28 1260,0 1350,14 C1395,21 1420,7 1440,14 L1440,28 L0,28 Z"
            fill="#155f82"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Animated fish */}
      {fish.map((f) => (
        <svg
          key={f.id}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 20"
          style={{
            position: 'absolute',
            top: f.top,
            left: 0,
            width: `${f.size}px`,
            height: `${f.size * 0.5}px`,
            animation: `${f.rtl ? 'fishSwimRTL' : 'fishSwimLTR'} ${f.duration}s linear ${f.delay}s infinite`,
          }}
        >
          {/* Body */}
          <ellipse cx="22" cy="10" rx="14" ry="7" fill={f.color} />
          {/* Tail */}
          <polygon points="8,10 0,2 0,18" fill={f.color} />
          {/* Eye */}
          <circle cx="30" cy="8" r="2" fill="#fff" />
          <circle cx="31" cy="8" r="1" fill="#111" />
        </svg>
      ))}

      {/* Rising bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            bottom: '0',
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: '50%',
            background: 'rgba(180, 220, 255, 0.25)',
            border: '1px solid rgba(200, 235, 255, 0.3)',
            animation: `bubbleRise ${b.duration}s ease-in ${b.delay}s infinite`,
          }}
        />
      ))}

      {/* Seaweed */}
      {seaweed.map((s) => (
        <svg
          key={s.id}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 80"
          style={{
            position: 'absolute',
            bottom: 0,
            left: s.left,
            width: '20px',
            height: `${s.height}px`,
            transformOrigin: 'bottom center',
            animation: `seaweedSway 3s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <path
            d="M10,80 C10,70 4,62 10,52 C16,42 4,34 10,24 C16,14 8,8 10,0"
            stroke="#1a4a2a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10,65 C6,58 2,54 4,50"
            stroke="#1a4a2a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10,45 C14,38 18,36 16,30"
            stroke="#1a4a2a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ))}
    </div>
  )
}
