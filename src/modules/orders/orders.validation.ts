import { z } from "zod";
import { ORDER_STATUSES } from "../../shared/constants/status.constant.js";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive()
    })
  ).min(1)
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES)
});
