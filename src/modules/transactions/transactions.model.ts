import type { TRANSACTION_STATUSES } from "../../shared/constants/status.constant.js";

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export type Transaction = {
  id: string;
  orderId: string;
  status: TransactionStatus;
  amount: number;
  transactionCode: string | null;
  paymentType: string | null;
  paymentReference: string | null;
  gatewayTransactionId: string | null;
  snapToken: string | null;
  paidAt: Date | null;
  expiredAt: Date | null;
  transactionTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
