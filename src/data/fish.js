// ── Minecraft dye colors (index matches in-game dye order) ──────────────────
export const COLORS = [
  { id: 0,  name: 'White',      hex: '#F9FFFE' },
  { id: 1,  name: 'Orange',     hex: '#F9801D' },
  { id: 2,  name: 'Magenta',    hex: '#C74EBD' },
  { id: 3,  name: 'Light Blue', hex: '#3AB3DA' },
  { id: 4,  name: 'Yellow',     hex: '#FED83D' },
  { id: 5,  name: 'Lime',       hex: '#80C71F' },
  { id: 6,  name: 'Pink',       hex: '#F38BAA' },
  { id: 7,  name: 'Gray',       hex: '#474F52' },
  { id: 8,  name: 'Light Gray', hex: '#9D9D97' },
  { id: 9,  name: 'Cyan',       hex: '#169C9C' },
  { id: 10, name: 'Purple',     hex: '#8932B8' },
  { id: 11, name: 'Blue',       hex: '#3C44AA' },
  { id: 12, name: 'Brown',      hex: '#835432' },
  { id: 13, name: 'Green',      hex: '#5E7C16' },
  { id: 14, name: 'Red',        hex: '#B02E26' },
  { id: 15, name: 'Black',      hex: '#1D1D21' },
]

// ── Patterns: index 0-5, name differs by size ────────────────────────────────
export const PATTERNS = [
  { id: 0, small: 'Kob',      large: 'Flopper'   },
  { id: 1, small: 'Sunstreak',large: 'Stripey'   },
  { id: 2, small: 'Snooper',  large: 'Glitter'   },
  { id: 3, small: 'Dasher',   large: 'Blockfish' },
  { id: 4, small: 'Brinely',  large: 'Betty'     },
  { id: 5, small: 'Spotty',   large: 'Clayfish'  },
]

export const SIZES = [
  { id: 0, name: 'Small' },
  { id: 1, name: 'Large' },
]

// ── 22 named tropical fish (exact Minecraft variant data) ─────────────────────
// variantId = size | (pattern << 8) | (bodyColor << 16) | (patternColor << 24)
const NAMED_VARIANTS = [
  { name: 'Tomato Clownfish',      size: 0, pattern: 0, bodyColor: 14, patternColor: 0  },
  { name: 'Anemone',               size: 1, pattern: 4, bodyColor: 1,  patternColor: 14 },
  { name: 'Black Tang',            size: 1, pattern: 0, bodyColor: 7,  patternColor: 7  },
  { name: 'Blue Tang',             size: 1, pattern: 0, bodyColor: 7,  patternColor: 11 },
  { name: 'Butterflyfish',         size: 1, pattern: 3, bodyColor: 0,  patternColor: 7  },
  { name: 'Cichlid',               size: 1, pattern: 1, bodyColor: 11, patternColor: 7  },
  { name: 'Cotton Candy Blobfish', size: 0, pattern: 5, bodyColor: 6,  patternColor: 3  },
  { name: 'Dottyback',             size: 0, pattern: 0, bodyColor: 10, patternColor: 4  },
  { name: 'Emperor Red Snapper',   size: 0, pattern: 3, bodyColor: 0,  patternColor: 14 },
  { name: 'Goatfish',              size: 0, pattern: 3, bodyColor: 0,  patternColor: 4  },
  { name: 'Moorish Idol',          size: 1, pattern: 3, bodyColor: 0,  patternColor: 15 },
  { name: 'Ornate Butterflyfish',  size: 1, pattern: 3, bodyColor: 0,  patternColor: 1  },
  { name: 'Parrotfish',            size: 0, pattern: 0, bodyColor: 9,  patternColor: 6  },
  { name: 'Queen Angelfish',       size: 1, pattern: 4, bodyColor: 5,  patternColor: 3  },
  { name: 'Red Cichlid',           size: 0, pattern: 0, bodyColor: 14, patternColor: 1  },
  { name: 'Red Lipped Blenny',     size: 1, pattern: 5, bodyColor: 7,  patternColor: 14 },
  { name: 'Red Snapper',           size: 0, pattern: 0, bodyColor: 14, patternColor: 15 },
  { name: 'Threadfin',             size: 1, pattern: 0, bodyColor: 0,  patternColor: 4  },
  { name: 'Triggerfish',           size: 1, pattern: 1, bodyColor: 7,  patternColor: 0  },
  { name: 'Yellow Tang',           size: 1, pattern: 0, bodyColor: 4,  patternColor: 4  },
  { name: 'Yellowtail Parrotfish', size: 0, pattern: 3, bodyColor: 9,  patternColor: 4  },
  { name: 'Clownfish',             size: 0, pattern: 0, bodyColor: 1,  patternColor: 0  },
]

function makeVariantId(size, pattern, bodyColor, patternColor) {
  // Use string key to avoid 32-bit integer overflow issues
  return `${size}_${pattern}_${bodyColor}_${patternColor}`
}

// Build a lookup map for named variants
const namedLookup = {}
for (const nv of NAMED_VARIANTS) {
  namedLookup[makeVariantId(nv.size, nv.pattern, nv.bodyColor, nv.patternColor)] = nv.name
}

// ── Common fish ──────────────────────────────────────────────────────────────
export const COMMON_FISH = [
  {
    id: 'cod',
    name: 'Cod',
    category: 'common',
    wikiImage: 'https://minecraft.wiki/images/Cod_JE2_BE2.png',
  },
  {
    id: 'salmon',
    name: 'Salmon',
    category: 'common',
    wikiImage: 'https://minecraft.wiki/images/Salmon_JE2_BE2.png',
  },
  {
    id: 'pufferfish',
    name: 'Pufferfish',
    category: 'common',
    wikiImage: 'https://minecraft.wiki/images/Pufferfish_JE2_BE2.png',
  },
]

// ── Generate all 3,072 tropical fish variants ────────────────────────────────
export function generateTropicalFish() {
  const fish = []
  for (let size = 0; size < 2; size++) {
    for (let pattern = 0; pattern < 6; pattern++) {
      for (let bodyColor = 0; bodyColor < 16; bodyColor++) {
        for (let patternColor = 0; patternColor < 16; patternColor++) {
          const key = makeVariantId(size, pattern, bodyColor, patternColor)
          const namedName = namedLookup[key]
          const patternObj = PATTERNS[pattern]
          const patternName = size === 0 ? patternObj.small : patternObj.large
          const bodyColorObj = COLORS[bodyColor]
          const patternColorObj = COLORS[patternColor]

          fish.push({
            id: `tropical_${key}`,
            name: namedName || `${bodyColorObj.name} ${patternColorObj.name} ${patternName}`,
            isNamed: !!namedName,
            category: 'tropical',
            size,
            pattern,
            bodyColor,
            patternColor,
            patternName,
            bodyColorHex: bodyColorObj.hex,
            patternColorHex: patternColorObj.hex,
            bodyColorName: bodyColorObj.name,
            patternColorName: patternColorObj.name,
            sizeName: SIZES[size].name,
          })
        }
      }
    }
  }
  return fish
}

// Lazily generated and cached
let _tropicalFishCache = null
export function getTropicalFish() {
  if (!_tropicalFishCache) _tropicalFishCache = generateTropicalFish()
  return _tropicalFishCache
}

export const TOTAL_FISH = COMMON_FISH.length + 3072 // 3 + 3072 = 3075
