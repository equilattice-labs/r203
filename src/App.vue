<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const ROBINHOOD_CHAIN = {
  chainId: '0x1237',
  chainName: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.robinhoodchain.com'],
  blockExplorerUrls: ['https://explorer.robinhoodchain.com'],
}

const walletAddress = ref('')
const walletError = ref('')
const isConnecting = ref(false)
const menuOpen = ref(false)
const activeFaq = ref(0)
const currentChainId = ref('')

const tabs = [
  { label: 'AI COMPUTE', move: '+4.8%', tone: 'lime', weights: ['NVDA 34%', 'TSM 24%', 'AVGO 22%', 'CASH 20%'], risk: 'Balanced' },
  { label: 'POWER GRID', move: '+3.1%', tone: 'cyan', weights: ['CEG 28%', 'VST 26%', 'ETN 24%', 'CASH 22%'], risk: 'Focused' },
  { label: 'RATE CUT', move: '+2.4%', tone: 'paper', weights: ['TLT 36%', 'IWM 28%', 'VNQ 22%', 'CASH 14%'], risk: 'Macro' },
]

const faqs = [
  ['What is a Tab?', 'A Tab is a versioned market thesis: the idea, eligible assets, target weights, risk rules, and every published change in one transparent object.'],
  ['Is TabAlpha a copy-trading product?', 'No. TabAlpha is thesis-first. Users see the logic and risk before choosing whether to follow, simulate, or approve an eligible transaction.'],
  ['Does TabAlpha hold user funds?', 'The product is designed to be non-custodial. Wallet owners review and approve their own transactions, with explicit bounds and previews.'],
  ['Is the website live for trading?', 'This release connects wallets to Robinhood Chain mainnet, but no strategy execution is enabled on this marketing site.'],
]

const shortAddress = computed(() => walletAddress.value ? `${walletAddress.value.slice(0, 6)}…${walletAddress.value.slice(-4)}` : '')
const correctNetwork = computed(() => currentChainId.value.toLowerCase() === ROBINHOOD_CHAIN.chainId)

async function readChain() {
  if (!window.ethereum) return
  currentChainId.value = await window.ethereum.request({ method: 'eth_chainId' })
}

async function switchNetwork() {
  walletError.value = ''
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ROBINHOOD_CHAIN.chainId }],
    })
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ROBINHOOD_CHAIN],
      })
    } else {
      walletError.value = error.message || 'Could not switch networks.'
    }
  }
  await readChain()
}

async function connectWallet() {
  walletError.value = ''
  if (!window.ethereum) {
    walletError.value = 'No EVM wallet detected. Install MetaMask or open this page in a wallet browser.'
    return
  }
  isConnecting.value = true
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    walletAddress.value = accounts[0] || ''
    await readChain()
    if (!correctNetwork.value) await switchNetwork()
  } catch (error) {
    walletError.value = error.message || 'Wallet connection was cancelled.'
  } finally {
    isConnecting.value = false
  }
}

function disconnectWallet() {
  walletAddress.value = ''
  walletError.value = ''
}

function onAccountsChanged(accounts) {
  walletAddress.value = accounts[0] || ''
}

function onChainChanged(chainId) {
  currentChainId.value = chainId
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
  }, { threshold: 0.12 })
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))

  if (window.ethereum) {
    window.ethereum.on?.('accountsChanged', onAccountsChanged)
    window.ethereum.on?.('chainChanged', onChainChanged)
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      walletAddress.value = accounts[0] || ''
      if (walletAddress.value) readChain()
    })
  }
})

onBeforeUnmount(() => {
  window.ethereum?.removeListener?.('accountsChanged', onAccountsChanged)
  window.ethereum?.removeListener?.('chainChanged', onChainChanged)
})
</script>

<template>
  <div class="site-shell">
    <div class="noise"></div>
    <header class="nav-wrap">
      <a href="#top" class="wordmark" aria-label="TabAlpha home">
        <img src="/brand/tabalpha-logo.png" alt="TabAlpha" />
      </a>
      <nav :class="['nav-links', { open: menuOpen }]">
        <a href="#product" @click="menuOpen = false">Product</a>
        <a href="#creators" @click="menuOpen = false">Creators</a>
        <a href="#network" @click="menuOpen = false">Network</a>
        <a href="#roadmap" @click="menuOpen = false">Roadmap</a>
      </nav>
      <div class="nav-actions">
        <button v-if="!walletAddress" class="wallet-button" @click="connectWallet">
          <span class="pulse-dot"></span>{{ isConnecting ? 'Connecting' : 'Connect wallet' }}
        </button>
        <button v-else class="wallet-button connected" @click="disconnectWallet">
          <span class="pulse-dot"></span>{{ shortAddress }}
        </button>
        <button class="menu-button" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
          <span></span><span></span>
        </button>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="hero-copy" data-reveal>
          <div class="eyebrow"><span>01</span> SOCIAL STRATEGY INFRASTRUCTURE</div>
          <h1>Open a thesis.<br /><em>Follow the alpha.</em></h1>
          <p class="hero-lede">TabAlpha turns market conviction into live, transparent onchain strategies—so the idea, the position, and the proof finally move together.</p>
          <div class="hero-actions">
            <button class="primary-cta" @click="connectWallet">Open your first Tab <span>↗</span></button>
            <a class="text-link" href="#product">See how it works <span>↓</span></a>
          </div>
          <p v-if="walletError" class="wallet-error">{{ walletError }}</p>
          <div v-if="walletAddress" class="network-state">
            <span :class="['status-light', { good: correctNetwork }]" />
            {{ correctNetwork ? 'Connected to Robinhood Chain' : 'Wrong network' }}
            <button v-if="!correctNetwork" @click="switchNetwork">Switch</button>
          </div>
        </div>

        <div class="hero-stage" aria-label="Animated TabAlpha market strategy preview" data-reveal>
          <div class="orb orb-one"></div>
          <div class="orb orb-two"></div>
          <div class="stage-grid"></div>
          <div class="signal-axis"><span>CONVICTION</span><span>PROOF</span></div>
          <div class="market-card card-back">
            <span class="card-index">03</span>
            <strong>RATE CUT</strong>
            <span class="gain">+2.4%</span>
          </div>
          <div class="market-card card-mid">
            <span class="card-index">02</span>
            <strong>POWER GRID</strong>
            <span class="gain">+3.1%</span>
          </div>
          <div class="market-card card-front">
            <div class="card-topline"><span><i></i> LIVE TAB</span><span>V.08</span></div>
            <div class="card-title"><strong>AI COMPUTE</strong><span class="gain">+4.8%</span></div>
            <svg class="chart" viewBox="0 0 560 210" role="img" aria-label="Illustrative rising market chart">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#c8ff3d" stop-opacity=".42" />
                  <stop offset="1" stop-color="#c8ff3d" stop-opacity="0" />
              </linearGradient>
              </defs>
              <path class="area" d="M0 176 C42 165 62 174 91 146 C126 111 154 155 190 122 C226 91 250 112 278 84 C313 50 350 95 382 61 C419 22 445 73 477 38 C504 10 532 35 560 8 L560 210 L0 210Z" />
              <path class="line" pathLength="1" d="M0 176 C42 165 62 174 91 146 C126 111 154 155 190 122 C226 91 250 112 278 84 C313 50 350 95 382 61 C419 22 445 73 477 38 C504 10 532 35 560 8" />
              <circle cx="560" cy="8" r="5" fill="#c8ff3d" />
              <circle class="chart-pulse" cx="560" cy="8" r="13" fill="none" stroke="#c8ff3d" />
            </svg>
            <div class="weights"><span>NVDA 34%</span><span>TSM 24%</span><span>AVGO 22%</span><span>CASH 20%</span></div>
          </div>
          <div class="proof-chip"><span>✓</span> Thesis signed onchain</div>
        </div>
      </section>

      <section class="ticker-strip" aria-label="TabAlpha principles">
        <div class="ticker-track">
          <span>THESIS FIRST</span><b>✦</b><span>NON-CUSTODIAL</span><b>✦</b><span>VERSIONED PROOF</span><b>✦</b><span>CREATOR OWNED</span><b>✦</b><span>BUILT FOR ROBINHOOD CHAIN</span><b>✦</b>
          <span>THESIS FIRST</span><b>✦</b><span>NON-CUSTODIAL</span><b>✦</b><span>VERSIONED PROOF</span><b>✦</b><span>CREATOR OWNED</span><b>✦</b><span>BUILT FOR ROBINHOOD CHAIN</span><b>✦</b>
        </div>
      </section>

      <section id="product" class="section product-section">
        <div class="section-heading" data-reveal>
          <div class="eyebrow"><span>02</span> THE PRODUCT</div>
          <h2>A market idea you can<br />actually <em>inspect.</em></h2>
          <p>Tabs keep context attached to every position: why it exists, what changes it, and who published it first.</p>
        </div>
        <div class="steps-grid">
          <article data-reveal>
            <span class="step-no">01 / PUBLISH</span>
            <div class="step-icon signal-icon"><i></i><i></i><i></i></div>
            <h3>Package conviction</h3>
            <p>Turn a thesis into defined assets, target weights, invalidation rules, and a rebalance cadence.</p>
          </article>
          <article data-reveal>
            <span class="step-no">02 / FOLLOW</span>
            <div class="step-icon follow-icon"><i></i><i></i><i></i></div>
            <h3>Choose with context</h3>
            <p>Inspect the full history, simulate the idea, and decide how much—if anything—you want to follow.</p>
          </article>
          <article data-reveal>
            <span class="step-no">03 / PROVE</span>
            <div class="step-icon proof-icon"><i>✓</i></div>
            <h3>Verify every change</h3>
            <p>Signed versions replace hindsight and screenshots with a durable record of process and outcome.</p>
          </article>
        </div>
      </section>

      <section class="section tab-gallery">
        <div class="gallery-top" data-reveal>
          <div>
            <div class="eyebrow"><span>03</span> THE FEED</div>
            <h2>Signal, not noise.</h2>
          </div>
          <p>Illustrative Genesis Tabs demonstrate the product format. Live strategy execution is not enabled in this prototype.</p>
        </div>
        <div class="tab-row">
          <article v-for="(tab, index) in tabs" :key="tab.label" :class="['tab-preview', tab.tone]" data-reveal>
            <div class="preview-head"><span>0{{ index + 1 }}</span><span>{{ tab.risk }}</span></div>
            <div class="preview-title"><h3>{{ tab.label }}</h3><strong>{{ tab.move }}</strong></div>
            <div class="mini-bars"><i v-for="weight in tab.weights" :key="weight" :style="{ width: weight.match(/\d+/)[0] + '%' }"></i></div>
            <div class="preview-weights"><span v-for="weight in tab.weights" :key="weight">{{ weight }}</span></div>
            <div class="preview-footer"><span>Illustrative</span><button aria-label="Open illustrative tab">↗</button></div>
          </article>
        </div>
      </section>

      <section id="creators" class="section creator-section">
        <div class="creator-visual" data-reveal>
          <div class="creator-ring ring-one"></div><div class="creator-ring ring-two"></div>
          <div class="creator-core"><span>TA</span><small>PROOF<br />GRAPH</small></div>
          <div class="creator-node node-a">THESIS</div><div class="creator-node node-b">FOLLOW</div><div class="creator-node node-c">EARN</div><div class="creator-node node-d">PROVE</div>
        </div>
        <div class="creator-copy" data-reveal>
          <div class="eyebrow"><span>04</span> FOR CREATORS</div>
          <h2>Make conviction<br /><em>compound.</em></h2>
          <p class="large-copy">Your best idea should build more than impressions. TabAlpha turns it into a product, a proof record, and a direct relationship with the people who choose to follow.</p>
          <ul>
            <li><span>01</span> Own your audience and strategy history</li>
            <li><span>02</span> Choose public, paid, or community-gated access</li>
            <li><span>03</span> Earn through transparent, aligned fees</li>
          </ul>
          <a class="primary-cta inline" href="mailto:founders@tabalpha.com">Become a founding creator <span>↗</span></a>
        </div>
      </section>

      <section id="network" class="network-section">
        <div class="network-grid"></div>
        <div class="network-copy" data-reveal>
          <div class="eyebrow light"><span>05</span> THE NETWORK</div>
          <h2>Every Tab makes the<br />next signal <em>smarter.</em></h2>
          <p>Publishing creates proof. Proof improves discovery. Discovery drives follows. Follows reward creators. The loop compounds into an open strategy graph for tokenized markets.</p>
        </div>
        <div class="flywheel" data-reveal>
          <div class="wheel-center">TAB<br />ALPHA</div>
          <div class="wheel-item w1"><b>01</b><span>PUBLISH</span></div>
          <div class="wheel-item w2"><b>02</b><span>DISTRIBUTE</span></div>
          <div class="wheel-item w3"><b>03</b><span>FOLLOW</span></div>
          <div class="wheel-item w4"><b>04</b><span>PROVE</span></div>
          <div class="wheel-item w5"><b>05</b><span>EARN</span></div>
        </div>
      </section>

      <section id="roadmap" class="section roadmap-section">
        <div class="section-heading" data-reveal>
          <div class="eyebrow"><span>06</span> ROADMAP</div>
          <h2>From a sharp wedge<br />to an <em>open network.</em></h2>
        </div>
        <div class="roadmap-list">
          <article data-reveal><span>NOW / 2026</span><h3>Genesis</h3><p>Brand, creator design partners, public Tabs, simulation, and Robinhood Chain mainnet wallet connection.</p><b>01</b></article>
          <article data-reveal><span>NEXT / Q4 2026</span><h3>Proof</h3><p>Signed versions, creator profiles, Proof Season, live cards, and the first reputation graph.</p><b>02</b></article>
          <article data-reveal><span>2027</span><h3>Execute</h3><p>Audited intents, eligible tokenized assets, bounded rebalancing, paid Tabs, and transparent fee sharing.</p><b>03</b></article>
          <article data-reveal><span>EXPANSION</span><h3>Network</h3><p>Alpha API, wallet embeds, agent-readable strategies, and infrastructure for professional publishers.</p><b>04</b></article>
        </div>
      </section>

      <section class="section faq-section">
        <div class="faq-title" data-reveal><div class="eyebrow"><span>07</span> QUESTIONS</div><h2>Read the<br /><em>fine signal.</em></h2></div>
        <div class="faq-list" data-reveal>
          <article v-for="(faq, index) in faqs" :key="faq[0]" :class="{ active: activeFaq === index }">
            <button @click="activeFaq = activeFaq === index ? -1 : index"><span>0{{ index + 1 }}</span><strong>{{ faq[0] }}</strong><i>{{ activeFaq === index ? '−' : '+' }}</i></button>
            <p>{{ faq[1] }}</p>
          </article>
        </div>
      </section>

      <section class="final-cta">
        <div class="cta-orb"></div>
        <div data-reveal>
          <span class="micro-label">THE FIRST TABS ARE OPENING</span>
          <h2>Bring your thesis<br /><em>onchain.</em></h2>
          <button class="primary-cta dark" @click="connectWallet">Connect wallet <span>↗</span></button>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-brand"><img src="/brand/tabalpha-logo.png" alt="TabAlpha" /><p>The social investing layer for Robinhood Chain.</p></div>
      <div><span>EXPLORE</span><a href="#product">Product</a><a href="#creators">Creators</a><a href="#roadmap">Roadmap</a></div>
      <div><span>CONNECT</span><a href="https://x.com/tabalpha" target="_blank" rel="noreferrer">X / Twitter</a><a href="mailto:founders@tabalpha.com">Founding creators</a><a href="mailto:hello@tabalpha.com">Contact</a></div>
      <div class="footer-meta"><span>© 2026 TABALPHA</span><p>Prototype only. Nothing on this site is investment advice or an offer to buy or sell any asset.</p></div>
    </footer>
  </div>
</template>
