import type { TRANSACTION_STATUSES } from "../../shared/constants/status.constant.js";

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export type Transaction = {
  id: string;
  orderId: string;
  status: TransactionStatus;
  amount: number;
};
