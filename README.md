# SolaPay (MVP)

Cross-border payments web app on Solana with a PayPal-like UX.

## Tech Stack
- Frontend: Vite + React + Tailwind, Framer Motion, Recharts, Solana Wallet Adapter (Phantom)
- Backend: Node.js + Express, PostgreSQL, Solana web3.js
- Deploy: Frontend (Vercel), Backend (Render)

## Monorepo Layout
- Frontend: `src/` (existing UI preserved)
- Backend: `server/`

## Quick Start

### Prereqs
- Node 18+
- Phantom Wallet (Devnet)
- Postgres (Render or local)

### 1) Environment
Copy `.env.example` to `.env` and fill values as needed.

```bash
cp .env.example .env
```

- Frontend uses `VITE_API_URL` to talk to backend
- Backend uses `DATABASE_URL` and `SOLANA_RPC_URL`

### 2) Backend
```bash
cd server
npm i
npm run dev
```
Server runs on http://localhost:4000. Tables are created automatically if `DATABASE_URL` is set.

Endpoints:
- POST `/auth/google` (stub)
- POST `/wallet/send` (record a signed+submitted SOL transfer)
- GET `/wallet/balance?publicKey=...`
- GET `/transactions?publicKey=...`
- POST `/kyc`

### 3) Frontend
```bash
cd ..
npm i
npm run dev
```
Open http://localhost:5173. Connect Phantom (Devnet), go to Send, enter a recipient wallet address, and an amount in SOL.

## Notes
- Real SOL transfers use Phantom to sign and send. The backend records the transaction and provides balances with mocked fiat.
- Existing components and styling were preserved; minor label changes reflect SOL.
- QR Payments and Google OAuth are scaffolded; productionization required.

## Deploy
- Frontend (Vercel): set `VITE_API_URL` env to your Render backend URL.
- Backend (Render): set `DATABASE_URL` (Render Postgres) and `SOLANA_RPC_URL`.