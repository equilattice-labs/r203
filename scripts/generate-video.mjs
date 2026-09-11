import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import sharp from 'sharp'

const root = process.cwd()
const frameDir = path.join(root, '.frames-tabalpha')
const output = path.join(root, 'twitter', 'launch-animation.mp4')
await fs.rm(frameDir, { recursive: true, force: true })
await fs.mkdir(frameDir, { recursive: true })

const W = 1280
const H = 720
const FPS = 30
const FRAMES = 150
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n))
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3)

function svgFrame(i) {
  const t = i / (FRAMES - 1)
  const intro = ease(t / .18)
  const cards = ease((t - .15) / .35)
  const chart = ease((t - .34) / .34)
  const outro = ease((t - .68) / .22)
  const glowX = 710 + chart * 435
  const lineEnd = 1180 - (1 - chart) * 470
  const cardY1 = 176 + (1 - cards) * 110
  const cardY2 = 278 + (1 - cards) * 150
  const cardY3 = 380 + (1 - cards) * 190
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="orb"><stop stop-color="#c8ff3d" stop-opacity=".26"/><stop offset="1" stop-color="#c8ff3d" stop-opacity="0"/></radialGradient>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3"/><feComponentTransfer><feFuncA type="table" tableValues="0 .065"/></feComponentTransfer></filter>
      <clipPath id="reveal"><rect x="700" y="0" width="${Math.max(0, lineEnd - 680)}" height="720"/></clipPath>
    </defs>
    <rect width="1280" height="720" fill="#080907"/>
    <path d="M0 120H1280M0 240H1280M0 360H1280M0 480H1280M0 600H1280M160 0V720M320 0V720M480 0V720M640 0V720M800 0V720M960 0V720M1120 0V720" stroke="#c8ff3d" stroke-opacity=".06"/>
    <circle cx="${glowX}" cy="230" r="240" fill="url(#orb)"/>
    <g opacity="${intro}" transform="translate(${70 - (1 - intro) * 30} 0)">
      <rect x="70" y="68" width="64" height="64" rx="14" fill="#10130d" stroke="#f3f4ec" stroke-opacity=".18"/>
      <path d="M83 83h38v11h-14v25H96V94H83z" fill="#c8ff3d"/><path d="M107 105l7-7 8 8" fill="none" stroke="#67e8e3" stroke-width="4"/>
      <text x="150" y="116" fill="#f3f4ec" font-family="Arial" font-size="43" font-weight="700" letter-spacing="-3">TabAlpha</text>
      <text x="72" y="206" fill="#8e9388" font-family="Courier New" font-size="14" letter-spacing="2">SOCIAL STRATEGY INFRASTRUCTURE</text>
    </g>
    <g opacity="${cards}">
      <g transform="translate(710 ${cardY1})"><rect width="430" height="82" fill="#11140d" stroke="#f3f4ec" stroke-opacity=".18"/><text x="23" y="31" fill="#73786e" font-family="Courier New" font-size="12">01 / LIVE TAB</text><text x="23" y="61" fill="#f3f4ec" font-family="Arial" font-size="27" font-weight="700">AI COMPUTE</text><text x="346" y="55" fill="#c8ff3d" font-family="Courier New" font-size="17">+4.8%</text></g>
      <g transform="translate(750 ${cardY2})"><rect width="390" height="82" fill="#11140d" stroke="#f3f4ec" stroke-opacity=".14"/><text x="23" y="31" fill="#73786e" font-family="Courier New" font-size="12">02 / LIVE TAB</text><text x="23" y="61" fill="#f3f4ec" font-family="Arial" font-size="27" font-weight="700">POWER GRID</text><text x="306" y="55" fill="#67e8e3" font-family="Courier New" font-size="17">+3.1%</text></g>
      <g transform="translate(790 ${cardY3})"><rect width="350" height="82" fill="#11140d" stroke="#f3f4ec" stroke-opacity=".1"/><text x="23" y="31" fill="#73786e" font-family="Courier New" font-size="12">03 / LIVE TAB</text><text x="23" y="61" fill="#f3f4ec" font-family="Arial" font-size="27" font-weight="700">RATE CUT</text><text x="270" y="55" fill="#c8ff3d" font-family="Courier New" font-size="17">+2.4%</text></g>
    </g>
    <g clip-path="url(#reveal)" opacity="${chart}"><path d="M700 570 C760 550 790 575 845 515 C900 455 930 520 985 410 C1030 320 1075 405 1120 295 C1150 220 1182 250 1210 175" fill="none" stroke="#c8ff3d" stroke-width="6"/><path d="M700 570 C760 550 790 575 845 515 C900 455 930 520 985 410 C1030 320 1075 405 1120 295 C1150 220 1182 250 1210 175 L1210 650 L700 650Z" fill="#c8ff3d" opacity=".07"/></g>
    <g opacity="${outro}" transform="translate(0 ${(1 - outro) * 25})">
      <text x="70" y="330" fill="#f3f4ec" font-family="Arial" font-size="73" font-weight="700" letter-spacing="-5">OPEN A THESIS.</text>
      <text x="70" y="410" fill="#c8ff3d" font-family="Arial" font-size="73" font-weight="700" letter-spacing="-5">FOLLOW THE ALPHA.</text>
      <text x="74" y="470" fill="#9da197" font-family="Arial" font-size="21">Market conviction, packaged as live onchain strategies.</text>
      <text x="74" y="625" fill="#f3f4ec" font-family="Courier New" font-size="15" letter-spacing="2">TABALPHA.COM / BUILT FOR ROBINHOOD CHAIN</text>
    </g>
    <rect width="1280" height="720" filter="url(#grain)"/>
  </svg>`
}

for (let i = 0; i < FRAMES; i += 1) {
  const name = `frame-${String(i).padStart(4, '0')}.png`
  await sharp(Buffer.from(svgFrame(i))).png().toFile(path.join(frameDir, name))
}

await new Promise((resolve, reject) => {
  const ffmpeg = spawn('ffmpeg', [
    '-y', '-framerate', String(FPS), '-i', path.join(frameDir, 'frame-%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
    '-movflags', '+faststart', '-crf', '18', '-r', String(FPS), output,
  ], { stdio: 'inherit' })
  ffmpeg.on('error', reject)
  ffmpeg.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)))
})

await fs.rm(frameDir, { recursive: true, force: true })
console.log(`Generated ${output}`)
