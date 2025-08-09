import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Pool } from "pg";
import { z } from "zod";

dotenv.config();

const PORT = process.env.PORT || 4000;
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl("devnet");
const DEFAULT_FIAT = process.env.DEFAULT_FIAT || "GBP";
const MOCK_RATE_GBP_TO_PKR = Number(process.env.MOCK_RATE_GBP_TO_PKR || 360);
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

const DATABASE_URL = process.env.DATABASE_URL;
let pool = null;
if (DATABASE_URL) {
  pool = new Pool({ connectionString: DATABASE_URL, ssl: DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : undefined });
}

async function ensureTables() {
  if (!pool) return;
  await pool.query(`
    create table if not exists users (
      id serial primary key,
      google_id text,
      email text,
      name text,
      wallet_pubkey text,
      created_at timestamptz default now()
    );
    create table if not exists transactions (
      id serial primary key,
      signature text unique,
      from_address text not null,
      to_address text not null,
      amount_lamports bigint not null,
      network text default 'devnet',
      fiat_currency text default '${DEFAULT_FIAT}',
      created_at timestamptz default now()
    );
    create index if not exists idx_tx_created_at on transactions(created_at desc);
    create index if not exists idx_tx_from_to on transactions(from_address, to_address);
    create table if not exists kyc (
      id serial primary key,
      user_pubkey text,
      data jsonb,
      created_at timestamptz default now()
    );
  `);
}

const app = express();
app.use(cors({
  origin: [/^http:\/\/localhost:5173$/, /vercel\.app$/],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// GET /wallet/balance?pk=...
app.get("/wallet/balance", async (req, res) => {
  try {
    const qp = z.object({ pk: z.string().min(30) }).parse(req.query);
    const pubkey = new PublicKey(qp.pk);
    const lamports = await connection.getBalance(pubkey);
    const sol = lamports / 1_000_000_000;

    // Mock fiat: if DEFAULT_FIAT is GBP, compute GBP; if PKR, apply fake rate
    let fiatCurrency = DEFAULT_FIAT;
    let fiatValue = sol * 150; // Base mock to USD equivalent
    if (fiatCurrency === "GBP") fiatValue = sol * 120;
    if (fiatCurrency === "PKR") fiatValue = sol * 120 * MOCK_RATE_GBP_TO_PKR;

    res.json({ lamports, sol, fiatValue, fiatCurrency });
  } catch (e) {
    res.status(400).send(e.message || "Invalid request");
  }
});

// POST /wallet/send
app.post("/wallet/send", async (req, res) => {
  try {
    const body = z.object({
      signature: z.string().min(10),
      from: z.string().min(30),
      to: z.string().min(30),
      amountLamports: z.number().int().positive(),
      network: z.string().default("devnet"),
      fiatCurrency: z.string().default(DEFAULT_FIAT),
    }).parse(req.body);

    // Verify signature exists on chain
    try {
      const status = await connection.getSignatureStatus(body.signature);
      if (!status?.value) {
        console.warn("Signature not found yet on chain", body.signature);
      }
    } catch {}

    if (pool) {
      // ignore duplicates via unique(signature)
      await pool.query(
        `insert into transactions (signature, from_address, to_address, amount_lamports, network, fiat_currency)
         values ($1,$2,$3,$4,$5,$6) on conflict (signature) do nothing`,
        [body.signature, body.from, body.to, body.amountLamports, body.network, body.fiatCurrency]
      );
    }

    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(400).send(e.message || "Invalid request");
  }
});

// GET /transactions?publicKey=...
app.get("/transactions", async (req, res) => {
  try {
    if (!pool) return res.json([]);
    const qp = z.object({ publicKey: z.string().min(30) }).parse(req.query);
    const result = await pool.query(
      `select signature, from_address, to_address, amount_lamports, network, fiat_currency, created_at
       from transactions
       where from_address = $1 or to_address = $1
       order by created_at desc limit 200`,
      [qp.publicKey]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(400).send(e.message || "Invalid request");
  }
});

// POST /kyc
app.post("/kyc", async (req, res) => {
  try {
    const body = z.object({
      userPublicKey: z.string().min(30),
      data: z.any(),
    }).parse(req.body);
    if (pool) {
      await pool.query(`insert into kyc (user_pubkey, data) values ($1,$2)`, [body.userPublicKey, body.data]);
    }
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(400).send(e.message || "Invalid request");
  }
});

// Placeholder for Google auth
app.post("/auth/google", (_req, res) => {
  res.status(501).json({ error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID/SECRET and implement callback." });
});

app.listen(PORT, async () => {
  if (pool) {
    try { await ensureTables(); } catch (e) { console.error("DB init failed", e); }
  }
  console.log(`listening on :${PORT}`);
});