import { z } from "zod";
import { TRANSACTION_STATUSES } from "../../shared/constants/status.constant.js";

export const createTransactionSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().nonnegative()
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(TRANSACTION_STATUSES)
});
