// src/lib/payments/paystack.ts

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface InitializePaymentParams {
  email: string;
  amount: number; // in kobo (NGN * 100)
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string; // "success" | "failed" | "abandoned"
    reference: string;
    amount: number;
    paid_at: string;
    channel: string;
    currency: string;
    customer: {
      email: string;
      name: string;
    };
    metadata: Record<string, unknown>;
  };
}

export async function initializePayment(
  params: InitializePaymentParams
): Promise<PaystackInitResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100), // convert to kobo
      reference: params.reference,
      metadata: params.metadata,
      callback_url: params.callbackUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/order-success`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to initialize Paystack payment");
  }

  return response.json();
}

export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify Paystack payment");
  }

  return response.json();
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ANH-${timestamp}-${random}`;
}

export function generatePaystackReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `anh_${timestamp}_${random}`;
}