import { useState } from 'react'

// SVG fish shapes for each pattern (small/large)
const FISH_PATHS = {
  // Small patterns
  Kob:       { body: 'M4 12 C4 7 8 4 14 4 C20 4 24 7 24 12 C24 17 20 20 14 20 C8 20 4 17 4 12Z', tail: 'M24 12 L30 7 L30 17Z', fin: 'M10 6 L16 4 L16 8Z' },
  Sunstreak: { body: 'M3 12 C3 6 8 3 15 3 C22 3 27 6 27 12 C27 18 22 21 15 21 C8 21 3 18 3 12Z', tail: 'M27 12 L33 6 L33 18Z', fin: 'M8 5 L17 3 L17 8Z' },
  Snooper:   { body: 'M5 12 C5 7 9 5 14 5 C19 5 23 7 23 12 C23 17 19 19 14 19 C9 19 5 17 5 12Z', tail: 'M23 12 L29 8 L29 16Z', fin: 'M11 6 L16 5 L15 9Z' },
  Dasher:    { body: 'M2 12 C2 8 6 5 14 5 C22 5 27 8 27 12 C27 16 23 19 14 19 C6 19 2 16 2 12Z', tail: 'M27 12 L34 7 L34 17Z', fin: 'M7 6 L16 5 L16 9Z' },
  Brinely:   { body: 'M4 12 C4 7 8 4 14 4 C20 4 24 7 24 12 C24 17 20 20 14 20 C8 20 4 17 4 12Z', tail: 'M24 9 L30 5 L30 12 L30 19 L24 15Z', fin: 'M10 5 L16 4 L15 9Z' },
  Spotty:    { body: 'M5 12 C5 7 9 4 14 4 C19 4 23 7 23 12 C23 17 19 20 14 20 C9 20 5 17 5 12Z', tail: 'M23 12 L29 7 L29 17Z', fin: 'M10 5 L15 4 L15 8Z' },
  // Large patterns
  Flopper:   { body: 'M2 13 C2 6 7 2 16 2 C25 2 29 6 29 13 C29 20 25 23 16 23 C7 23 2 20 2 13Z', tail: 'M29 13 L36 6 L36 20Z', fin: 'M7 4 L18 2 L17 8Z' },
  Stripey:   { body: 'M2 12 C2 5 7 2 16 2 C25 2 30 5 30 12 C30 19 25 22 16 22 C7 22 2 19 2 12Z', tail: 'M30 12 L37 5 L37 19Z', fin: 'M7 4 L18 2 L17 8Z' },
  Glitter:   { body: 'M3 13 C3 7 8 3 16 3 C24 3 28 7 28 13 C28 19 24 22 16 22 C8 22 3 19 3 13Z', tail: 'M28 10 L35 4 L35 13 L35 22 L28 16Z', fin: 'M8 5 L17 3 L17 9Z' },
  Blockfish: { body: 'M2 8 L28 8 L28 18 L2 18Z M2 8 L2 18 M28 8 L28 18', tail: 'M28 10 L35 7 L35 19 L28 16Z', fin: 'M7 4 L18 8 L7 8Z' },
  Betty:     { body: 'M3 13 C3 7 8 3 16 3 C24 3 29 7 29 13 C29 19 24 23 16 23 C8 23 3 19 3 13Z', tail: 'M29 13 L36 7 L36 19Z', fin: 'M5 8 L18 3 L17 10Z' },
  Clayfish:  { body: 'M2 13 C2 7 7 3 15 3 C23 3 28 7 28 13 C28 19 23 23 15 23 C7 23 2 19 2 13Z', tail: 'M28 13 L35 7 L35 19Z', fin: 'M7 5 L17 3 L16 9Z' },
}

// Pattern overlay shapes
const PATTERN_OVERLAYS = {
  Kob:       null,
  Sunstreak: <path d="M12 5 L20 19" strokeWidth="3" stroke="currentColor" fill="none" />,
  Snooper:   <circle cx="12" cy="12" r="3" fill="currentColor" />,
  Dasher:    <path d="M8 12 L22 12 M8 9 L22 9 M8 15 L22 15" strokeWidth="2" stroke="currentColor" fill="none" />,
  Brinely:   <path d="M10 5 L10 19 M15 5 L15 19 M20 5 L20 19" strokeWidth="2" stroke="currentColor" fill="none" />,
  Spotty:    <><circle cx="10" cy="10" r="2" fill="currentColor" /><circle cx="17" cy="14" r="2" fill="currentColor" /><circle cx="12" cy="16" r="1.5" fill="currentColor" /></>,
  Flopper:   null,
  Stripey:   <path d="M8 5 L8 21 M14 3 L14 23 M20 5 L20 21" strokeWidth="2.5" stroke="currentColor" fill="none" />,
  Glitter:   <><circle cx="9" cy="9" r="1.5" fill="currentColor" /><circle cx="16" cy="7" r="1.5" fill="currentColor" /><circle cx="22" cy="11" r="1.5" fill="currentColor" /><circle cx="12" cy="16" r="1.5" fill="currentColor" /><circle cx="19" cy="17" r="1.5" fill="currentColor" /></>,
  Blockfish: <path d="M2 13 L28 13" strokeWidth="3" stroke="currentColor" fill="none" />,
  Betty:     <path d="M8 7 C12 5 20 5 24 7" strokeWidth="2.5" stroke="currentColor" fill="none" />,
  Clayfish:  <><circle cx="10" cy="12" r="3" fill="currentColor" /><circle cx="18" cy="12" r="3" fill="currentColor" /></>,
}

export default function FishSprite({ fish, size = 48, locked = false }) {
  const [imgError, setImgError] = useState(false)
  const isCommon = fish.category === 'common'

  if (isCommon && !imgError) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <img
          src={fish.wikiImage}
          alt={fish.name}
          className={`object-contain ${locked ? 'opacity-20 saturate-0' : ''}`}
          style={{ width: size, height: size, imageRendering: 'pixelated' }}
          onError={() => setImgError(true)}
          crossOrigin="anonymous"
        />
      </div>
    )
  }

  // CSS fish for tropical variants
  const paths = FISH_PATHS[fish.patternName] || FISH_PATHS.Kob
  const overlay = PATTERN_OVERLAYS[fish.patternName]
  const bodyColor = locked ? '#374151' : fish.bodyColorHex
  const patternColor = locked ? '#4B5563' : fish.patternColorHex

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg
        viewBox="0 0 40 26"
        width={size}
        height={Math.round(size * 0.65)}
        style={{ filter: locked ? 'brightness(0.3)' : undefined }}
      >
        {/* Body */}
        <path d={paths.body} fill={bodyColor} />
        {/* Tail */}
        <path d={paths.tail} fill={bodyColor} />
        {/* Top fin */}
        <path d={paths.fin} fill={bodyColor} opacity="0.8" />
        {/* Pattern overlay */}
        {overlay && (
          <g style={{ color: patternColor }} opacity="0.85">
            {overlay}
          </g>
        )}
        {/* Eye */}
        {!locked && <circle cx="8" cy="12" r="1.5" fill="#1D1D21" />}
      </svg>
    </div>
  )
}
