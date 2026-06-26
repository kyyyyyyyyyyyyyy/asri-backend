import { TransactionsRepository } from "./transactions.repository.js";
import { verifySignature, getTransactionStatus } from "../../shared/config/midtrans.js";
import { query } from "../../shared/database/postgres.js";

export class TransactionsService {
  constructor(
    private readonly transactionsRepository = new TransactionsRepository()
  ) {}

  async handleNotification(payload: Record<string, unknown>): Promise<{ status: string; message: string }> {
    const orderId = payload.order_id as string;
    const statusCode = payload.status_code as string;
    const grossAmount = payload.gross_amount as string;
    const signatureKey = payload.signature_key as string;

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return { status: "error", message: "Missing required fields" };
    }

    const valid = verifySignature({
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
    });

    if (!valid) {
      return { status: "error", message: "Invalid signature" };
    }

    const transaction = await this.transactionsRepository.findByTransactionCode(orderId);

    if (!transaction) {
      return { status: "error", message: "Transaction not found" };
    }

    const midtransStatus = await getTransactionStatus(orderId);

    const transactionStatus = midtransStatus.transaction_status as string;
    const paymentType = (midtransStatus.payment_type as string) ?? null;
    const gatewayTransactionId = (midtransStatus.transaction_id as string) ?? null;
    const transactionTime = midtransStatus.transaction_time
      ? new Date(midtransStatus.transaction_time as string)
      : undefined;

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      await this.transactionsRepository.updatePayment(transaction.id, {
        status: "paid",
        paymentType: paymentType ?? undefined,
        gatewayTransactionId: gatewayTransactionId ?? undefined,
        paidAt: new Date(),
        transactionTime,
      });

      await query(
        `UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2`,
        ["processing", transaction.orderId]
      );

      return { status: "success", message: "Payment confirmed" };
    }

    if (["deny", "cancel", "expire"].includes(transactionStatus)) {
      await this.transactionsRepository.updatePayment(transaction.id, {
        status: "failed",
        paymentType: paymentType ?? undefined,
        gatewayTransactionId: gatewayTransactionId ?? undefined,
        transactionTime,
      });

      return { status: "success", message: "Payment failed" };
    }

    return { status: "pending", message: `Transaction status: ${transactionStatus}` };
  }
}
