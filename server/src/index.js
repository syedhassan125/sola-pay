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
      user_pubkey text not null,
      recipient_pubkey text not null,
      amount_sol numeric not null,
      signature text,
      status text default 'completed',
      metadata jsonb,
      created_at timestamptz default now()
    );
    create table if not exists kyc (
      id serial primary key,
      user_pubkey text,
      data jsonb,
      created_at timestamptz default now()
    );
  `);
}

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// GET /wallet/balance?publicKey=...
app.get("/wallet/balance", async (req, res) => {
  try {
    const qp = z.object({ publicKey: z.string().min(30) }).parse(req.query);
    const pubkey = new PublicKey(qp.publicKey);
    const lamports = await connection.getBalance(pubkey);
    const sol = lamports / 1_000_000_000;
    // Mock fiat conversion
    const rate = 150; // 1 SOL ≈ 150 USD (mock)
    res.json({ sol, fiat: { currency: "USD", amount: sol * rate, rate } });
  } catch (e) {
    res.status(400).send(e.message || "Invalid request");
  }
});

// POST /wallet/send (record a completed tx)
app.post("/wallet/send", async (req, res) => {
  try {
    const body = z.object({
      senderPublicKey: z.string().min(30),
      recipientPublicKey: z.string().min(30),
      amountSol: z.number().positive(),
      signature: z.string().min(10),
      metadata: z.any().optional(),
    }).parse(req.body);

    // Optionally verify confirmation
    try {
      const info = await connection.getSignatureStatus(body.signature);
      if (!info?.value) {
        console.warn("No signature status yet");
      }
    } catch {}

    if (pool) {
      await pool.query(
        `insert into transactions (user_pubkey, recipient_pubkey, amount_sol, signature, status, metadata) values ($1,$2,$3,$4,$5,$6)`,
        [body.senderPublicKey, body.recipientPublicKey, body.amountSol, body.signature, "completed", body.metadata || null]
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
    const qp = z.object({ publicKey: z.string().min(30).optional() }).parse(req.query);
    let result;
    if (qp.publicKey) {
      result = await pool.query(
        `select * from transactions where user_pubkey = $1 or recipient_pubkey = $1 order by created_at desc limit 100`,
        [qp.publicKey]
      );
    } else {
      result = await pool.query(`select * from transactions order by created_at desc limit 100`);
    }
    res.json(result.rows);
  } catch (e) {
    res.status(500).send("Failed to fetch transactions");
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

// Placeholder for Google auth (requires OAuth credentials)
app.post("/auth/google", (_req, res) => {
  res.status(501).json({ error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID/SECRET and implement callback." });
});

app.listen(PORT, async () => {
  if (pool) {
    try { await ensureTables(); } catch (e) { console.error("DB init failed", e); }
  }
  console.log(`SolaPay server running on :${PORT}`);
});