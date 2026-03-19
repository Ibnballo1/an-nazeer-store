const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE = "https://api.paystack.co";

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

type InitializeData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

type VerifyData = {
  status: string; // "success" | "failed" | "abandoned"
  reference: string;
  amount: number; // in kobo
  currency: string;
  paid_at: string;
  channel: string;
  customer: {
    email: string;
    name: string;
    phone: string | null;
  };
  authorization: {
    authorization_code: string;
    bank: string;
    brand: string;
    card_type: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
  };
  metadata: Record<string, unknown>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialize a transaction
// ─────────────────────────────────────────────────────────────────────────────

export async function initializePayment(opts: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeData> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      amount: opts.amountKobo,
      reference: opts.reference,
      callback_url: opts.callbackUrl,
      currency: "NGN",
      metadata: opts.metadata ?? {},
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Paystack initialization failed.");
  }

  const json: PaystackResponse<InitializeData> = await res.json();

  if (!json.status) {
    throw new Error(json.message ?? "Paystack initialization failed.");
  }

  return json.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Verify a transaction by reference
// ─────────────────────────────────────────────────────────────────────────────

export async function verifyPayment(reference: string): Promise<VerifyData> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      // No caching — always fresh from Paystack
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Paystack verification failed.");
  }

  const json: PaystackResponse<VerifyData> = await res.json();

  if (!json.status) {
    throw new Error(json.message ?? "Paystack verification failed.");
  }

  return json.data;
}
