import { useEffect, useRef } from 'react'

// Minecraft dye color RGB values
const DYE_RGB = [
  [249, 255, 254], // 0  White
  [249, 128,  29], // 1  Orange
  [199,  78, 189], // 2  Magenta
  [ 58, 179, 218], // 3  Light Blue
  [254, 216,  61], // 4  Yellow
  [128, 199,  31], // 5  Lime
  [243, 139, 170], // 6  Pink
  [ 71,  79,  82], // 7  Gray
  [157, 157, 151], // 8  Light Gray
  [ 22, 156, 156], // 9  Cyan
  [137,  50, 184], // 10 Purple
  [ 60,  68, 170], // 11 Blue
  [131,  84,  50], // 12 Brown
  [ 94, 124,  22], // 13 Green
  [176,  46,  38], // 14 Red
  [ 29,  29,  33], // 15 Black
]

const imgCache = {}

function loadImage(src) {
  if (imgCache[src]) return imgCache[src]
  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
  imgCache[src] = promise
  return promise
}

// Colorize a grayscale-ish image by multiplying each pixel by a dye color
function colorizeImage(img, dyeRgb) {
  const off = document.createElement('canvas')
  off.width = img.width
  off.height = img.height
  const ctx = off.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, img.width, img.height)
  const [dr, dg, db] = dyeRgb
  for (let i = 0; i < data.data.length; i += 4) {
    if (data.data[i + 3] < 10) continue
    data.data[i]     = Math.round(data.data[i]     * dr / 255)
    data.data[i + 1] = Math.round(data.data[i + 1] * dg / 255)
    data.data[i + 2] = Math.round(data.data[i + 2] * db / 255)
  }
  ctx.putImageData(data, 0, 0)
  return off
}

// ── Common fish ───────────────────────────────────────────────────────────
function CommonFishSprite({ fish, size, locked }) {
  return (
    <img
      src={fish.sprite}
      alt={fish.name}
      width={size}
      height={size}
      style={{
        imageRendering: 'pixelated',
        width: size,
        height: size,
        objectFit: 'contain',
        filter: locked ? 'brightness(0) opacity(0.25)' : 'none',
      }}
    />
  )
}

// ── Tropical fish — item sprite colorized with body color ─────────────────
function TropicalFishSprite({ fish, size, locked }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const bodyDye = locked ? [40, 40, 40] : DYE_RGB[fish.bodyColor]

    loadImage('/sprites/tropical_fish.png').then((img) => {
      const colored = colorizeImage(img, bodyDye)

      ctx.imageSmoothingEnabled = false
      const scale = Math.floor(canvas.width / img.width)
      const drawW = img.width  * scale
      const drawH = img.height * scale
      const offX  = Math.floor((canvas.width  - drawW) / 2)
      const offY  = Math.floor((canvas.height - drawH) / 2)

      ctx.drawImage(colored, offX, offY, drawW, drawH)

      if (locked) {
        ctx.globalCompositeOperation = 'source-atop'
        ctx.fillStyle = 'rgba(0,0,0,0.65)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-over'
      }
    }).catch(() => {
      ctx.fillStyle = locked ? '#374151' : fish.bodyColorHex
      ctx.fillRect(4, 4, canvas.width - 8, canvas.height - 8)
    })
  }, [fish, size, locked])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function FishSprite({ fish, size = 48, locked = false }) {
  if (fish.category === 'common') {
    return <CommonFishSprite fish={fish} size={size} locked={locked} />
  }
  return <TropicalFishSprite fish={fish} size={size} locked={locked} />
}
