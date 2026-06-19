import { z } from "zod";

export const submitProductValidationSchema = z.object({
  productId: z.string().uuid(),
  notes: z.string().optional()
});
