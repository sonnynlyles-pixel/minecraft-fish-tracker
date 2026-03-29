import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'sprites')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const BASE = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/entity/fish/'

const FILES = [
  'cod.png',
  'salmon.png',
  'pufferfish0.png',
  'tropical_a.png',
  'tropical_b.png',
  'tropical_a_pattern_1.png',
  'tropical_a_pattern_2.png',
  'tropical_a_pattern_3.png',
  'tropical_a_pattern_4.png',
  'tropical_a_pattern_5.png',
  'tropical_a_pattern_6.png',
  'tropical_b_pattern_1.png',
  'tropical_b_pattern_2.png',
  'tropical_b_pattern_3.png',
  'tropical_b_pattern_4.png',
  'tropical_b_pattern_5.png',
  'tropical_b_pattern_6.png',
]

function download(filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUT_DIR, filename)
    if (fs.existsSync(dest)) { console.log(`  skip ${filename}`); resolve(); return }
    const file = fs.createWriteStream(dest)
    https.get(BASE + filename, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close()
        fs.unlinkSync(dest)
        https.get(res.headers.location, (res2) => {
          res2.pipe(file)
          file.on('finish', () => { file.close(); console.log(`  ✓ ${filename}`); resolve() })
        }).on('error', reject)
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        console.warn(`  ✗ ${filename} (${res.statusCode})`)
        resolve()
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); console.log(`  ✓ ${filename}`); resolve() })
    }).on('error', (err) => { fs.unlinkSync(dest); reject(err) })
  })
}

console.log('Downloading Minecraft fish sprites...')
for (const f of FILES) await download(f)
console.log('Done!')
