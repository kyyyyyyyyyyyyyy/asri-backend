import midtransClient from "midtrans-client";
import { createHash } from "node:crypto";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const serverKey = process.env.MIDTRANS_SERVER_KEY!;
const clientKey = process.env.MIDTRANS_CLIENT_KEY!;

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

const baseUrl = isProduction
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

export async function getTransactionStatus(
  orderId: string
): Promise<Record<string, unknown>> {
  const response = await fetch(`${baseUrl}/${orderId}/status`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Midtrans status check failed: ${response.status} ${errorBody}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}

export function verifySignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const hash = createHash("sha512")
    .update(payload.order_id + payload.status_code + payload.gross_amount + serverKey)
    .digest("hex");

  return hash === payload.signature_key;
}
