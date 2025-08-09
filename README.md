# SolaPay (MVP)

Cross-border payments web app on Solana with a PayPal-like UX.

## Tech Stack
- Frontend: Vite + React + Tailwind, Framer Motion, Recharts, Solana Wallet Adapter (Phantom)
- Backend: Node.js + Express, PostgreSQL, Solana web3.js
- Deploy: Frontend (Vercel), Backend (Render)

## Monorepo Layout
- Frontend: `src/` (existing UI preserved)
- Backend: `server/`

## Run locally

1) Backend
```bash
cd server
npm i
cp ../.env.example .env
npm run dev
```
Expected: logs "listening on :4000" and `GET http://localhost:4000/health` returns `{ok:true}`.

2) Frontend
```bash
cd ..
npm i
cp .env.example .env
# ensure VITE_API_URL=http://localhost:4000
npm run dev
```
Open `http://localhost:5173`.

3) Phantom & Devnet
- Install Phantom, switch to Devnet.
- Airdrop if needed:
  - CLI: `solana airdrop 1 <YOUR_PUBLIC_KEY> --url https://api.devnet.solana.com`
  - Or use Phantom’s Devnet faucet.

## End-to-end test
- Connect Phantom in sidebar.
- Dashboard shows SOL balance and mocked fiat.
- Send: paste a Devnet address (validate base58), send 0.001 SOL.
- Success toast shows signature + link to Explorer (Devnet).
- History shows your transaction after it’s recorded by the backend.

## API
- `GET /health` → `{ok:true}`
- `GET /wallet/balance?pk=<pubkey>` → `{ lamports, sol, fiatValue, fiatCurrency }`
- `POST /wallet/send` → `{ signature, from, to, amountLamports, network, fiatCurrency }`
- `GET /transactions?publicKey=<pubkey>` → latest rows involving your key
- `POST /kyc` → stores KYC payload
- `POST /auth/google` → stub

## Deploy
- Frontend (Vercel): set `VITE_API_URL` to backend URL.
- Backend (Render): set `DATABASE_URL`, `SOLANA_RPC_URL`, `DEFAULT_FIAT`.