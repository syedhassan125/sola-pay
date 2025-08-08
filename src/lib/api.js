export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getBalance: async (publicKeyBase58) => {
    return request(`/wallet/balance?publicKey=${encodeURIComponent(publicKeyBase58)}`);
  },
  sendRecord: async ({ senderPublicKey, recipientPublicKey, amountSol, signature, metadata }) => {
    return request(`/wallet/send`, {
      method: "POST",
      body: JSON.stringify({ senderPublicKey, recipientPublicKey, amountSol, signature, metadata })
    });
  },
  getTransactions: async (publicKeyBase58) => {
    const qp = publicKeyBase58 ? `?publicKey=${encodeURIComponent(publicKeyBase58)}` : "";
    return request(`/transactions${qp}`);
  },
  submitKyc: async (payload) => {
    return request(`/kyc`, { method: "POST", body: JSON.stringify(payload) });
  }
};