import { z } from "zod";

export const createProductSchema = z.object({
  storeId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative()
});
