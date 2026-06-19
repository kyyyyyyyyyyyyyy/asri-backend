import { z } from "zod";

export const createComplaintSchema = z.object({
  orderId: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().min(1)
});
