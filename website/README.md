# TabAlpha Website

Vue 3 + Vite marketing site for TabAlpha.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Wallet integration

The site uses the browser's EIP-1193 provider (`window.ethereum`) and requests Robinhood Chain mainnet when a wallet connects.

- Chain ID: `4663` (`0x1237`)
- RPC: `https://rpc.robinhoodchain.com`
- Explorer: `https://explorer.robinhoodchain.com`
- Native gas token: ETH

This marketing prototype does not submit trades, token approvals, or value-bearing transactions.

## Main files

- `src/App.vue` — content, interactions, FAQ, wallet state
- `src/style.css` — responsive design system and motion
- `public/brand/` — production logo and social preview assets
