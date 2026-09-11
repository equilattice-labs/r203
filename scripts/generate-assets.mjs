import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const twitterDir = path.join(root, 'twitter')
const brandDir = path.join(root, 'website', 'public', 'brand')
await fs.mkdir(twitterDir, { recursive: true })
await fs.mkdir(brandDir, { recursive: true })

const colors = { ink: '#080907', paper: '#F3F4EC', lime: '#C8FF3D', cyan: '#67E8E3', gray: '#969A90' }

function grain(id = 'grain') {
  return `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer></filter>`
}

function mark(x, y, size, dark = false) {
  const bg = dark ? colors.paper : colors.ink
  return `<g transform="translate(${x} ${y}) scale(${size / 100})">
    <rect width="100" height="100" rx="22" fill="${bg}"/>
    <path d="M19 24h62v17H59v41H41V41H19z" fill="${colors.lime}"/>
    <path d="M59 57l10-10 13 13" fill="none" stroke="${colors.cyan}" stroke-width="7" stroke-linecap="square" stroke-linejoin="miter"/>
  </g>`
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
    ${mark(24, 50, 200)}
    <text x="265" y="197" fill="${colors.paper}" font-family="Arial, Helvetica, sans-serif" font-size="142" font-weight="700" letter-spacing="-10">TabAlpha</text>
  </svg>`
}

function avatarSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs><radialGradient id="g" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#20261a"/><stop offset="1" stop-color="${colors.ink}"/></radialGradient>${grain()}</defs>
    <rect width="800" height="800" fill="url(#g)"/><rect width="800" height="800" filter="url(#grain)"/>
    <g transform="translate(130 130) scale(5.4)"><rect width="100" height="100" rx="20" fill="none" stroke="${colors.paper}" stroke-width="2" opacity=".16"/><path d="M18 24h64v18H59v40H41V42H18z" fill="${colors.lime}"/><path d="M58 59l11-11 14 14" fill="none" stroke="${colors.cyan}" stroke-width="7"/></g>
    <circle cx="640" cy="150" r="9" fill="${colors.lime}"/><circle cx="640" cy="150" r="28" fill="none" stroke="${colors.lime}" opacity=".35"/>
  </svg>`
}

function bannerSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#080907"/><stop offset="1" stop-color="#12170d"/></linearGradient><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${colors.lime}" stop-opacity=".4"/><stop offset="1" stop-color="${colors.lime}" stop-opacity="0"/></linearGradient>${grain()}</defs>
    <rect width="1500" height="500" fill="url(#bg)"/><path d="M0 80H1500M0 160H1500M0 240H1500M0 320H1500M0 400H1500M120 0V500M240 0V500M360 0V500M480 0V500M600 0V500M720 0V500M840 0V500M960 0V500M1080 0V500M1200 0V500M1320 0V500" stroke="#c8ff3d" stroke-opacity=".08"/>
    <path d="M0 430 C160 405 220 445 340 350 C455 260 570 355 680 250 C785 150 895 240 1000 130 C1115 15 1230 140 1500 45 L1500 500 L0 500Z" fill="url(#fade)"/>
    <path d="M0 430 C160 405 220 445 340 350 C455 260 570 355 680 250 C785 150 895 240 1000 130 C1115 15 1230 140 1500 45" fill="none" stroke="${colors.lime}" stroke-width="5"/>
    <circle cx="1000" cy="130" r="8" fill="${colors.lime}"/><circle cx="1000" cy="130" r="25" fill="none" stroke="${colors.lime}" opacity=".45"/>
    ${mark(92, 86, 96)}
    <text x="215" y="155" fill="${colors.paper}" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" letter-spacing="-4">TabAlpha</text>
    <text x="92" y="240" fill="${colors.paper}" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" letter-spacing="-4">OPEN A THESIS.</text>
    <text x="92" y="305" fill="${colors.lime}" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" letter-spacing="-4">FOLLOW THE ALPHA.</text>
    <text x="96" y="365" fill="${colors.gray}" font-family="Courier New, monospace" font-size="18" letter-spacing="2">SOCIAL STRATEGY INFRASTRUCTURE / ROBINHOOD CHAIN</text>
    <rect width="1500" height="500" filter="url(#grain)"/>
  </svg>`
}

function socialFrame({ index, kicker, title1, title2, body, type }) {
  const diagrams = {
    launch: `<g transform="translate(965 155)"><rect x="0" y="90" width="470" height="300" fill="#11140d" stroke="#f3f4ec" stroke-opacity=".18"/><rect x="42" y="45" width="390" height="72" fill="#151911" stroke="#f3f4ec" stroke-opacity=".2"/><rect x="96" y="0" width="300" height="72" fill="#1b2114" stroke="#f3f4ec" stroke-opacity=".2"/><path d="M35 340C100 320 120 350 178 280C233 215 270 290 326 190C365 122 415 162 455 110" fill="none" stroke="${colors.lime}" stroke-width="7"/><circle cx="455" cy="110" r="10" fill="${colors.lime}"/><text x="30" y="365" fill="#83887e" font-family="Courier New" font-size="15">THESIS / POSITION / PROOF</text></g>`,
    flow: `<g transform="translate(790 180)" font-family="Arial" font-weight="700"><path d="M150 115H190M340 115H380M530 115H570" stroke="${colors.lime}" stroke-width="3" stroke-dasharray="8 9"/><g fill="#10130d" stroke="#f3f4ec" stroke-opacity=".25"><rect width="150" height="230"/><rect x="190" width="150" height="230"/><rect x="380" width="150" height="230"/><rect x="570" width="150" height="230"/></g><g fill="${colors.paper}" font-size="20" text-anchor="middle"><text x="75" y="105">SIGNAL</text><text x="265" y="105">TAB</text><text x="455" y="105">FOLLOW</text><text x="645" y="105">PROOF</text></g><g fill="${colors.lime}" font-family="Courier New" font-size="14" text-anchor="middle"><text x="75" y="152">01</text><text x="265" y="152">02</text><text x="455" y="152">03</text><text x="645" y="152">04</text></g></g>`,
    network: `<g transform="translate(1230 445)"><circle r="230" fill="none" stroke="${colors.lime}" stroke-opacity=".32"/><circle r="150" fill="none" stroke="${colors.lime}" stroke-opacity=".25" stroke-dasharray="5 8"/><circle r="76" fill="${colors.lime}"/><text y="-4" fill="${colors.ink}" font-family="Arial" font-weight="700" font-size="24" text-anchor="middle">PROOF</text><text y="26" fill="${colors.ink}" font-family="Arial" font-weight="700" font-size="24" text-anchor="middle">GRAPH</text><g fill="${colors.paper}" font-family="Courier New" font-size="14" text-anchor="middle"><text x="0" y="-250">PUBLISH</text><text x="240" y="-24">DISTRIBUTE</text><text x="150" y="210">FOLLOW</text><text x="-150" y="210">EARN</text><text x="-240" y="-24">PROVE</text></g><g fill="${colors.cyan}"><circle cy="-230" r="9"/><circle cx="219" cy="-71" r="9"/><circle cx="135" cy="186" r="9"/><circle cx="-135" cy="186" r="9"/><circle cx="-219" cy="-71" r="9"/></g></g>`,
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#080907"/><stop offset="1" stop-color="#151a0f"/></linearGradient>${grain()}</defs>
    <rect width="1600" height="900" fill="url(#bg)"/><path d="M0 150H1600M0 300H1600M0 450H1600M0 600H1600M0 750H1600M200 0V900M400 0V900M600 0V900M800 0V900M1000 0V900M1200 0V900M1400 0V900" stroke="#c8ff3d" stroke-opacity=".06"/>
    ${mark(72, 62, 72)}<text x="162" y="115" fill="${colors.paper}" font-family="Arial" font-size="40" font-weight="700" letter-spacing="-2">TabAlpha</text>
    <text x="72" y="235" fill="${colors.lime}" font-family="Courier New" font-size="16" letter-spacing="2">${index} / ${kicker}</text>
    <text x="72" y="350" fill="${colors.paper}" font-family="Arial" font-size="96" font-weight="700" letter-spacing="-7">${title1}</text>
    <text x="72" y="450" fill="${colors.lime}" font-family="Arial" font-size="96" font-weight="700" letter-spacing="-7">${title2}</text>
    <foreignObject x="75" y="510" width="650" height="180"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#a9ada3;font:26px/1.55 Arial,sans-serif">${body}</div></foreignObject>
    ${diagrams[type]}
    <text x="72" y="836" fill="#72766d" font-family="Courier New" font-size="15" letter-spacing="2">TABALPHA.COM  /  BUILT FOR ROBINHOOD CHAIN</text>
    <rect width="1600" height="900" filter="url(#grain)"/>
  </svg>`
}

await sharp(Buffer.from(logoSvg())).png().toFile(path.join(brandDir, 'tabalpha-logo.png'))
await sharp(Buffer.from(avatarSvg())).png().toFile(path.join(twitterDir, 'twitter-logo.png'))
await sharp(Buffer.from(bannerSvg())).png().toFile(path.join(twitterDir, 'twitter-banner.png'))
await sharp(Buffer.from(socialFrame({ index: '01', kicker: 'INTRODUCING TABALPHA', title1: 'OPEN A THESIS.', title2: 'FOLLOW THE ALPHA.', body: 'Market conviction, packaged as live, transparent onchain strategies.', type: 'launch' }))).jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(path.join(twitterDir, 'tweet-01-open-a-thesis.jpg'))
await sharp(Buffer.from(socialFrame({ index: '02', kicker: 'HOW IT WORKS', title1: 'KEEP THE WHY', title2: 'WITH THE TRADE.', body: 'From signal to signed strategy—without losing context between the post and the position.', type: 'flow' }))).jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(path.join(twitterDir, 'tweet-02-how-it-works.jpg'))
await sharp(Buffer.from(socialFrame({ index: '03', kicker: 'THE CREATOR NETWORK', title1: 'ATTENTION BUILDS', title2: 'VERIFIABLE VALUE.', body: 'Publish. Distribute. Follow. Prove. Earn. Every useful Tab strengthens the open strategy graph.', type: 'network' }))).jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(path.join(twitterDir, 'tweet-03-creator-network.jpg'))
await sharp(Buffer.from(socialFrame({ index: 'TA', kicker: 'SOCIAL STRATEGY INFRASTRUCTURE', title1: 'OPEN A THESIS.', title2: 'FOLLOW THE ALPHA.', body: 'The social investing layer for Robinhood Chain.', type: 'launch' }))).png().toFile(path.join(brandDir, 'tabalpha-social.png'))

console.log('Generated TabAlpha PNG and JPG assets.')
